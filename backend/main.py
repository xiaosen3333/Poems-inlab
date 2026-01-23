from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import json
import os
import uuid
import requests
import httpx
import logging
from typing import List, Optional
import asyncio
from datetime import datetime
import base64
from pydantic import BaseModel
import random
from urllib.parse import urlparse

# ----------------------
# Configuration
# ----------------------

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins; restrict in production.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path configuration
WORKFLOW_TEMPLATE = os.getenv("WORKFLOW_TEMPLATE", "MyPoemWorkflow.json")
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "ComfyUI/input/uploaded_images")
DEFAULT_OUTPUT_DIR = os.getenv("DEFAULT_OUTPUT_DIR", "ComfyUI/output")

COMFYUI_API = os.getenv("COMFYUI_API", "http://localhost:8188/api/prompt")
_parsed_comfyui = urlparse(COMFYUI_API)
COMFYUI_BASE_URL = (
    f"{_parsed_comfyui.scheme}://{_parsed_comfyui.netloc}"
    if _parsed_comfyui.scheme and _parsed_comfyui.netloc
    else "http://localhost:8188"
)

# AI API configuration
AI_API_URL = os.getenv("AI_API_URL", "")
AI_API_KEY = os.getenv("AI_API_KEY", "")

# Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# ----------------------
# Request models
# ----------------------

class GenerateRequest(BaseModel):
    lora: str
    prompts: List[str]
    images_base64: List[str]  # Base64-encoded images

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    model: str = "deepseek-chat"
    temperature: float = 0.7
    max_tokens: Optional[int] = None
    stream: bool = False

# ----------------------
# FastAPI routes
# ----------------------

@app.post("/chat")
async def ai_chat(request: ChatRequest):
    """AI chat endpoint."""
    try:
        if not AI_API_URL or not AI_API_KEY:
            raise HTTPException(
                status_code=400,
                detail="AI_API_URL/AI_API_KEY not configured. Set them in backend/.env.",
            )

        # Convert to the upstream API format
        payload = {
            "model": request.model,
            "messages": [{"role": msg.role, "content": msg.content} for msg in request.messages],
            "temperature": request.temperature
        }
        
        # Include max_tokens if provided
        if request.max_tokens is not None:
            payload["max_tokens"] = request.max_tokens
            
        # Stream flag
        payload["stream"] = request.stream

        # Call AI API
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {AI_API_KEY}"
        }
        
        logger.info("Sending AI chat request.")
        
        response = requests.post(
            AI_API_URL,
            headers=headers,
            json=payload
        )
        
        # Check response
        response.raise_for_status()
        
        # Return result
        result = response.json()
        logger.info("AI chat response received.")
        
        return JSONResponse(content=result)
        
    except requests.RequestException as e:
        error_msg = f"AI API request failed: {str(e)}"
        logger.error(error_msg)
        if hasattr(e, 'response') and e.response is not None:
            logger.error(f"API error response: {e.response.text}")
        raise HTTPException(status_code=500, detail=error_msg)
    except Exception as e:
        error_msg = f"Error while handling chat request: {str(e)}"
        logger.error(error_msg, exc_info=True)
        raise HTTPException(status_code=500, detail=error_msg)

@app.post("/generate")
async def generate_images(request: GenerateRequest):
    try:
        file_count = len(request.images_base64)
        prompt_count = len(request.prompts)
        if file_count != prompt_count:
            error_msg = (
                "Image count does not match prompt count. "
                f"images={file_count}, prompts={prompt_count}"
            )
            raise HTTPException(status_code=400, detail=error_msg)

        # 1. Save Base64-encoded images
        uploaded_paths = await save_base64_images(request.images_base64)
        logger.info("Images saved.")

        # 2. Process each task in order
        result_images_base64 = []

        for i in range(len(request.images_base64)):
            task_id = str(uuid.uuid4())
            logger.info(f"Processing task {i}, Task ID: {task_id}")

            # 3. Build workflow
            try:
                workflow = modify_workflow(
                    image_path=uploaded_paths[i],
                    prompt=request.prompts[i],
                    lora_name=request.lora,
                    task_id=task_id
                )
            except Exception as e:
                logger.error(f"Workflow generation failed: {str(e)}")
                continue

            # 4. Submit to ComfyUI
            try:
                comfyui_response = requests.post(
                    COMFYUI_API,
                    json={"prompt": workflow},
                )
                comfyui_response.raise_for_status()
                response_data = comfyui_response.json()

                if "prompt_id" not in response_data:
                    raise ValueError("Invalid ComfyUI response: missing prompt_id")

                prompt_id = response_data["prompt_id"]
                logger.info(f"Task submitted. Prompt ID: {prompt_id}")

            except Exception as e:
                logger.error(f"ComfyUI submission failed: {str(e)}")
                continue

            # 5. Poll for completion
            try:
                image_filename = await wait_for_completion(prompt_id, task_id)
                image_path = os.path.join(DEFAULT_OUTPUT_DIR, image_filename)
                if os.path.exists(image_path):
                    with open(image_path, "rb") as f:
                        image_content = f.read()
                    # Convert image to Base64
                    image_base64 = base64.b64encode(image_content).decode('utf-8')
                    result_images_base64.append(image_base64)

                else:
                    logger.error(f"Generated image file not found: {image_path}")

            except Exception as e:
                logger.error(f"Polling failed: {str(e)}")

        return JSONResponse({"images": result_images_base64})

    except Exception as e:
        logger.error(f"Unhandled error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

# ----------------------
# Helpers
# ----------------------
async def save_base64_images(images_base64: List[str]) -> List[str]:
    """Save Base64-encoded images and return their paths."""
    paths = []
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    for i, base64_str in enumerate(images_base64):
        try:
            # Strip any data URL prefix if present
            if "," in base64_str:
                base64_str = base64_str.split(",", 1)[1]
            
            # Decode Base64 string
            image_data = base64.b64decode(base64_str)
            
            # Save to file
            path = os.path.join(UPLOAD_DIR, f"upload_{i}.png")
            with open(path, "wb") as f:
                f.write(image_data)
            
            # Ensure file exists
            if not os.path.exists(path):
                raise IOError(f"Failed to save file: {path}")
            
            paths.append(os.path.abspath(path))
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to process image {i}: {str(e)}")
    
    return paths

def modify_workflow(image_path: str, prompt: str, lora_name: str, task_id: str) -> dict:
    """Apply dynamic values to the workflow template."""
    with open(WORKFLOW_TEMPLATE, "r") as f:
        workflow = json.load(f)

    # Ensure required node types exist
    required_classes = ["LoadImage", "CLIPTextEncode", "LoraLoaderModelOnly", "SaveImage"]
    node_types = {node.get("class_type") for node in workflow.values()}

    for req_class in required_classes:
        if req_class not in node_types:
            raise ValueError(f"Workflow is missing required node: {req_class}")

    # Update node inputs
    for node in workflow.values():
        class_type = node.get("class_type")

        if class_type == "LoadImage":
            # Validate image path
            if not os.path.exists(image_path):
                raise FileNotFoundError(f"Image file not found: {image_path}")
            node["inputs"]["image"] = image_path

        elif class_type == "CLIPTextEncode":
            # Clean prompt
            cleaned_prompt = prompt.strip().replace('"', '\\"')
            node["inputs"]["text"] = cleaned_prompt

        elif class_type == "LoraLoaderModelOnly":
            # Ensure extension
            if not lora_name.endswith(".safetensors"):
                lora_name += ".safetensors"
            node["inputs"]["lora_name"] = lora_name
            node["inputs"]["strength_model"] = 0.8

        elif class_type == "SaveImage":
            # Timestamp-based output prefix
            current_time = datetime.now().strftime("%Y%m%d%H%M%S")
            node["inputs"]["filename_prefix"] = f"{current_time}_{task_id}"
            
        elif class_type == "KSampler":
            node["inputs"]["seed"] = random.randint(0, 999999)

    return workflow

async def wait_for_completion(prompt_id: str, task_id: str) -> str:
    """Poll ComfyUI history until completion."""
    async with httpx.AsyncClient(timeout=30) as client:
        while True:
            try:
                # Check history
                history_resp = await client.get(f"{COMFYUI_BASE_URL}/history/{prompt_id}")
                history_resp.raise_for_status()
                history_data = history_resp.json()

                if prompt_id in history_data:
                    outputs = history_data[prompt_id]["outputs"]
                    for node_id in outputs:
                        if "images" in outputs[node_id]:
                            return outputs[node_id]["images"][0]["filename"]

                await asyncio.sleep(2)

            except httpx.ReadTimeout:
                logger.warning(f"Task {task_id} polling timed out. Retrying...")
                await asyncio.sleep(5)
            except Exception as e:
                raise RuntimeError(f"Polling failed: {str(e)}")

# ----------------------
# Local entrypoint
# ----------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_config=None
    )

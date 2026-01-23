# Backend Guide

This backend exposes two endpoints used by the frontend:
- `/chat` for AI chat requests.
- `/generate` for image generation via ComfyUI.

## Requirements
- Python 3.11.2 (see `.python-version`)
- ComfyUI running externally
- Required ComfyUI models (FLUX + CLIP + VAE)

## Install

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

## Run

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000 --env-file .env
```

## ComfyUI Setup (External)

1) Install ComfyUI:

```bash
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI
pip install -r requirements.txt
```

2) Start ComfyUI:

```bash
python main.py --listen
```

3) Install the FLUX models:

Follow the official guide for FLUX.1 and download the correct model files:
- https://comfyanonymous.github.io/ComfyUI_examples/flux/
- https://blackforestlabs.ai/

Typical model locations:
- `ComfyUI/models/unet/flux1-dev.safetensors`
- `ComfyUI/models/vae/ae.safetensors`
- `ComfyUI/models/clip/clip_l.safetensors`
- `ComfyUI/models/clip/t5xxl_fp16.safetensors`

4) Workflow template:

This repo includes `backend/MyPoemWorkflow.json`. The backend loads it via `WORKFLOW_TEMPLATE`.
If you use a different file or path, update `WORKFLOW_TEMPLATE` in `backend/.env`.

## Environment Variables

See `backend/.env.example` for all settings.

## Notes

- This repo does not ship model weights.
- ComfyUI runs as an external dependency and must be reachable via `COMFYUI_API`.
- Keep API keys out of version control.

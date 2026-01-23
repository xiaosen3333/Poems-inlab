# <p align="center"> PoemPalette: Facilitating Poetry Creative Exploration and Foundational Understanding through the Ideorealm Alignment of Paintings and Poems </p>
*<p align="center">
  [Paper Link](https://doi.org/10.1145/3772318.3791460)
</p>

*<p align="center">
  by Ying Zhang<sup>1</sup>, Kaixin Jia<sup>1</sup>, Hongjian Zhang<sup>1</sup>, Kewen Zhu<sup>1</sup>, Chenye Meng<sup>1</sup>, Jiesi Zhang<sup>1</sup>, Zejian Li*<sup>1</sup>, Pei Chen<sup>1</sup>, Lingyun Sun<sup>1</sup>
</p>

*<p align="center">
  <sup>1</sup>Zhejiang University
</p>

## Abstract
Poems InLab is an interactive system for poem exploration, visualization, and AI-assisted image generation. It combines a Next.js frontend for poem browsing and composition, a FastAPI backend for chat and image requests, and an external ComfyUI pipeline for image synthesis. This repository is intended for paper reviewers and practitioners to self-deploy and experience the system.

## Reviewer Quickstart (UI-only)

If you only want to explore the UI and poem visualizations (no AI chat / no image generation), run the frontend only:

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

What works without API keys:
- Poem browsing and visualization: Yes
- Chat/Q&A tab: No (requires `AI_API_KEY`)
- Image generation: No (requires ComfyUI)

## Environment Setup

Tested with:
- Node.js 23.2.0 (see `.nvmrc`)
- Python 3.11.2 (see `backend/.python-version`)
- ComfyUI + required models (external)

## Full Experience (Chat + Image Generation)

### 1) Frontend

```bash
cp .env.example .env.local
npm install
npm run dev
```

### 2) Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --host 0.0.0.0 --port 8000 --env-file .env
```

### 3) ComfyUI (External)

Follow the setup guide in `backend/README.md` and ensure your ComfyUI instance is reachable from the backend.

The workflow template used by the backend is `backend/MyPoemWorkflow.json` (configurable via `WORKFLOW_TEMPLATE`).

## Docker (Optional)

If you prefer Docker for the frontend and backend (ComfyUI stays external):

```bash
cp .env.example .env.local
cp backend/.env.example backend/.env
docker compose up --build
```

When running ComfyUI on the host machine, set in `backend/.env`:

```
COMFYUI_API=http://host.docker.internal:8188/api/prompt
```

## Environment Variables

### Frontend (`.env.local`)

```
NEXT_PUBLIC_GENERATION_SERVER=http://localhost:8000
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
NEXT_PUBLIC_IMGBB_EXPIRATION=1555200
```

### Backend (`backend/.env`)

```
AI_API_URL=https://api.deepseek.com/v1/chat/completions
AI_API_KEY=your_deepseek_api_key
COMFYUI_API=http://127.0.0.1:8188/api/prompt
WORKFLOW_TEMPLATE=MyPoemWorkflow.json
UPLOAD_DIR=/absolute/path/to/ComfyUI/input/uploaded_images
DEFAULT_OUTPUT_DIR=/absolute/path/to/ComfyUI/output
```

## AI API Key (DeepSeek)

This repository does not include API keys. Apply for a DeepSeek API key here:
- https://platform.deepseek.com/
- https://platform.deepseek.com/api-keys

Set `AI_API_KEY` in `backend/.env` and keep it out of version control.

## API Endpoints

- `POST /chat`: forwards chat messages to the configured AI provider.
- `POST /generate`: sends base64 images + prompts to ComfyUI and returns generated images.

## Citation

Please cite the paper that this code accompanies.

```
PoemPalette: Facilitating Poetry Creative Exploration and Foundational Understanding through the Ideorealm Alignment of Paintings and Poems.
Ying Zhang, Kaixin Jia, Hongjian Zhang, Kewen Zhu, Chenye Meng, Jiesi Zhang, Zejian Li, Pei Chen, Lingyun Sun.
ACM ISBN 979-8-4007-2278-3/2026/04. https://doi.org/10.1145/3772318.3791460
```

A BibTeX entry will be provided once the paper metadata is finalized.

## Acknowledgements

- ComfyUI: https://github.com/comfyanonymous/ComfyUI
- DeepSeek API: https://platform.deepseek.com/
- ImgBB: https://imgbb.com/

## License

MIT License. See `LICENSE`.

# Secura AI

Multi-modal deepfake detection platform with a FastAPI backend and a React/Vite frontend.

## Quick Start

Run the backend:
```sh
cd backend
uvicorn main:app --reload
```

Run the frontend:
```sh
npm run dev
```

Open the app and use the Try Demo page to upload image, video, or audio files.

## How It Works

- User uploads image, video, or audio
- Backend processes via the ML pipeline
- Response includes risk_score (0-100), decision (allow / tag / block), and a short reason

## ML Pipeline Summary

- Image -> CNN (ResNet/EfficientNet)
- Video -> frame extraction + image model
- Audio -> spectrogram + CNN
- If model files are missing, inference falls back to a safe random score

## Model Location

- [ml/models/](ml/models/)

## ML Docs

See [ml/README.md](ml/README.md) for training, datasets, and advanced details.

## Project info

**URL**: https://lovable.dev/projects/4f28676b-dc7d-4833-9b4d-efeaebf97b50

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/4f28676b-dc7d-4833-9b4d-efeaebf97b50) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/4f28676b-dc7d-4833-9b4d-efeaebf97b50) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Visual moderation pipeline (visual-only)

This project now uses a visual-only moderation flow that does **not** rely on filenames or text prompts. The moderation output supports three categories:

- **REAL** — authentic photos
- **AI_SAFE** — AI-generated but safe content (e.g., portraits)
- **DEEPFAKE** — manipulated or inappropriate content (blocked)

### Supabase functions

- `supabase/functions/impersonation-check` — visual-only image moderation for the Instagram clone
- `supabase/functions/analyze-deepfake` — visual-only image moderation for the demo lab (videos return “review required”)
- `supabase/functions/moderation-report` — accepts user reports for review

#### Optional model endpoint

Set `VISUAL_CLASSIFIER_URL` in your Supabase function environment to route image bytes to your production model. The function expects a JSON response containing:

```
{
	"category": "REAL" | "AI_SAFE" | "DEEPFAKE",
	"confidence": number,
	"label": string,
	"explanation": string,
	"evidence": string[],
	"needsReview": boolean,
	"reviewReason": string,
	"model": { "source": "remote", "version": string },
	"analysisType": "image"
}
```

When unset, the functions fall back to a lightweight visual heuristic (pixel statistics) for demos.

## Dataset manifest + balance checks

Add your dataset entries to a manifest (example in `tools/dataset/manifest.sample.json`). Use the scripts below to enforce balance and coverage across lighting, devices, and contexts.

```sh
npm run dataset:check
npm run dataset:report
```

Manifest schema is in `tools/dataset/manifest.schema.json`.

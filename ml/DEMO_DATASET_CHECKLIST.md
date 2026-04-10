# Demo Dataset Checklist (Images Only)

Goal: Create a tiny dataset fast so training and the demo work end-to-end.

## Target Size (Quick Demo)
- Real images: 20-40
- Fake images: 20-40

## Folder Structure
Place files here:
- ml/data/image/real/
- ml/data/image/fake/

## Allowed Formats
- .jpg
- .jpeg
- .png

## Recommended Sources
Real images (pick one):
- Your own photos (best for privacy)
- Public-domain portraits (e.g., Unsplash)

Fake images (pick one):
- AI-generated faces (e.g., thispersondoesnotexist.com)
- Free AI image generator outputs

## Naming Convention
Use simple names with no spaces:
- real_001.jpg, real_002.jpg, ...
- fake_001.jpg, fake_002.jpg, ...

## Quick Validation
- Same number of real and fake images (within +/- 10%)
- Mix of lighting, angles, and ages
- No duplicates

## Train
Run from project root:

```powershell
python -m ml.train.train_image
```

Expected output:
- ml/models/image_model.pth

## Verify Demo
- Start backend (from backend/):

```powershell
uvicorn main:app --reload
```

- Upload an image to /verify-upload
- Check response includes "model_status": "loaded"

# Demo Dataset Checklist (Video Frames)

Goal: Build a tiny video dataset by extracting frames into the image folders.

## Target Size (Quick Demo)
- Real videos: 5-10
- Fake videos: 5-10
- Frames per video: 5-10

## Folder Structure
Place extracted frames here:
- ml/data/image/real/
- ml/data/image/fake/

## Recommended Sources
Real videos (pick one):
- Your own short clips
- Public-domain videos

Fake videos (pick one):
- Short deepfake samples from public datasets
- Any AI-generated or manipulated clips you already have

## Extract Frames (Windows PowerShell)
From project root, replace INPUT and OUTPUT as needed:

```powershell
mkdir ml\data\image\real
mkdir ml\data\image\fake

# Example: extract 1 frame per second
ffmpeg -i INPUT_REAL.mp4 -vf "fps=1" ml\data\image\real\real_%03d.jpg
ffmpeg -i INPUT_FAKE.mp4 -vf "fps=1" ml\data\image\fake\fake_%03d.jpg
```

Notes:
- Use short clips (5-15 seconds) to keep it fast
- Mix lighting, angles, and compression
- Keep real/fake counts within +/- 10%

## Train
```powershell
python -m ml.train.train_image
```

## Verify Demo
- Start backend (from backend/):

```powershell
uvicorn main:app --reload
```

- Upload a video to /verify-upload
- Check response includes "model_status": "loaded"

# Demo Dataset Checklist (Audio)

Goal: Build a tiny audio dataset for a fast end-to-end demo.

## Target Size (Quick Demo)
- Real audio: 15-30 clips
- Fake audio: 15-30 clips

## Folder Structure
Place files here:
- ml/data/audio/real/
- ml/data/audio/fake/

## Allowed Formats
- .wav (recommended)
- .mp3

## Recommended Sources
Real audio (pick one):
- Your own recordings
- Public-domain speech (short clips)

Fake audio (pick one):
- AI-generated speech using any free TTS tool
- Public deepfake audio samples you already have

## Quick Validation
- Clip length: 3-15 seconds is fine
- Same number of real and fake clips (within +/- 10%)
- No duplicates

## Train
```powershell
python -m ml.train.train_audio
```

Expected output:
- ml/models/audio_model.pth

## Verify Demo
- Start backend (from backend/):

```powershell
uvicorn main:app --reload
```

- Upload an audio file to /verify-upload
- Check response includes "model_status": "loaded"

# Demo Checklist (Image + Video Together)

Goal: Use one image model to handle both images and videos.

## Steps
1) Build image dataset OR video-frame dataset (sections above).
2) Train image model:

```powershell
python -m ml.train.train_image
```

3) Start backend (from backend/):

```powershell
uvicorn main:app --reload
```

## Verify Demo
- Upload an image to /verify-upload
- Upload a video to /verify-upload
- Check response includes "model_status": "loaded"

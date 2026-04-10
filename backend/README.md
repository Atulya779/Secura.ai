# Secura AI Backend

FastAPI backend for upload-time deepfake detection across image, video, and audio files.

## Install

```bash
pip install fastapi uvicorn python-multipart opencv-python librosa numpy
```

## Run

From the backend folder:

```bash
uvicorn main:app --reload
```

## Endpoint

- POST /verify-upload
- Accepts: .jpg, .jpeg, .png, .mp4, .wav, .mp3

## Example (curl)

```bash
curl -X POST "http://127.0.0.1:8000/verify-upload" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/sample.jpg"
```

## Response

```json
{
  "type": "real",
  "risk_score": 12.34,
  "decision": "allow",
  "reason": "Low risk score",
  "model_status": "loaded"
}
```

## Demo Mode

If model weights are missing, the API returns a deterministic demo score and sets
`model_status` to `missing`. The `reason` field includes a note so you do not
mistake demo results for real model output.

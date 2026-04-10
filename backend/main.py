import os
import shutil
import sys
from pathlib import Path
from typing import Tuple
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware


BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from ml.inference.inference import detect_audio, detect_image, detect_video
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".mp4", ".wav", ".mp3"}
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}
VIDEO_EXTENSIONS = {".mp4"}
AUDIO_EXTENSIONS = {".wav", ".mp3"}

app = FastAPI(title="Secura AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _decision_from_risk(risk_score: float) -> Tuple[str, str, str]:
    if risk_score < 30:
        return "real", "allow", "Low risk score"
    if risk_score < 70:
        return "ai", "tag", "Medium risk score"
    return "deepfake", "block", "High risk score"


def _append_demo_reason(reason: str, model_status: str) -> str:
    if model_status == "loaded":
        return reason
    return f"{reason}. Model missing; demo score generated"


def _detect_file_type(file_name: str) -> str:
    ext = Path(file_name).suffix.lower()
    if ext in IMAGE_EXTENSIONS:
        return "image"
    if ext in VIDEO_EXTENSIONS:
        return "video"
    if ext in AUDIO_EXTENSIONS:
        return "audio"
    return "unknown"


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/verify-upload")
async def verify_upload(file: UploadFile = File(...)):
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    temp_path = UPLOAD_DIR / f"upload_{os.getpid()}_{file.filename}"
    print(f"[upload] Saving file: {temp_path.name}")

    try:
        with temp_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        file_type = _detect_file_type(file.filename or "")
        if file_type == "image":
            risk_score, model_status = detect_image(temp_path)
        elif file_type == "video":
            risk_score, model_status = detect_video(temp_path)
        elif file_type == "audio":
            risk_score, model_status = detect_audio(temp_path)
        else:
            raise HTTPException(status_code=400, detail="Invalid file type")

        media_type, decision, reason = _decision_from_risk(risk_score)
        reason = _append_demo_reason(reason, model_status)
        response = {
            "type": media_type,
            "risk_score": round(float(risk_score), 2),
            "decision": decision,
            "reason": reason,
            "model_status": model_status,
        }
        print(f"[result] {response}")
        return response
    finally:
        try:
            temp_path.unlink(missing_ok=True)
        except OSError:
            pass

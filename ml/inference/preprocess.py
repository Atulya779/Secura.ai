from pathlib import Path
from typing import List

import cv2
import librosa
import numpy as np
import torch
from PIL import Image
from torchvision import transforms


def preprocess_image(file_path: Path, image_size: int = 224) -> torch.Tensor:
    transform = transforms.Compose(
        [
            transforms.Resize((image_size, image_size)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ]
    )
    image = Image.open(file_path).convert("RGB")
    return transform(image).unsqueeze(0)


def preprocess_audio(
    file_path: Path,
    sample_rate: int = 16000,
    n_mels: int = 64,
    max_len: int = 256,
) -> torch.Tensor:
    y, sr = librosa.load(str(file_path), sr=sample_rate)
    mel = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=n_mels)
    mel_db = librosa.power_to_db(mel, ref=np.max)

    if mel_db.shape[1] < max_len:
        pad_width = max_len - mel_db.shape[1]
        mel_db = np.pad(mel_db, ((0, 0), (0, pad_width)), mode="constant")
    else:
        mel_db = mel_db[:, : max_len]

    mel_db = (mel_db - mel_db.mean()) / (mel_db.std() + 1e-6)
    tensor = torch.tensor(mel_db, dtype=torch.float32).unsqueeze(0).unsqueeze(0)
    return tensor


def extract_video_frames(file_path: Path, max_frames: int = 10) -> List[np.ndarray]:
    cap = cv2.VideoCapture(str(file_path))
    if not cap.isOpened():
        return []

    fps = cap.get(cv2.CAP_PROP_FPS)
    if not fps or fps <= 0:
        fps = 1.0
    frame_interval = max(int(round(fps)), 1)

    frames = []
    frame_index = 0
    extracted = 0

    while extracted < max_frames:
        ret, frame = cap.read()
        if not ret:
            break
        if frame_index % frame_interval == 0:
            frames.append(frame)
            extracted += 1
        frame_index += 1

    cap.release()
    return frames

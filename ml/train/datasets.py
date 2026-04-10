from pathlib import Path
from typing import List, Tuple

import librosa
import numpy as np
import torch
from torch.utils.data import Dataset

AUDIO_EXTENSIONS = {".wav", ".mp3", ".flac", ".m4a"}


def _collect_audio_files(root: Path) -> List[Tuple[Path, int]]:
    items: List[Tuple[Path, int]] = []
    class_to_idx = {"fake": 0, "real": 1}
    for label in ("fake", "real"):
        folder = root / label
        if not folder.exists():
            continue
        for path in folder.rglob("*"):
            if path.suffix.lower() in AUDIO_EXTENSIONS:
                items.append((path, class_to_idx[label]))
    return items


class AudioDataset(Dataset):
    def __init__(
        self,
        root_dir: Path,
        sample_rate: int = 16000,
        n_mels: int = 64,
        max_len: int = 256,
    ) -> None:
        self.root_dir = root_dir
        self.sample_rate = sample_rate
        self.n_mels = n_mels
        self.max_len = max_len
        self.items = _collect_audio_files(root_dir)

    def __len__(self) -> int:
        return len(self.items)

    def _load_mel(self, file_path: Path) -> np.ndarray:
        y, sr = librosa.load(str(file_path), sr=self.sample_rate)
        mel = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=self.n_mels)
        mel_db = librosa.power_to_db(mel, ref=np.max)

        if mel_db.shape[1] < self.max_len:
            pad_width = self.max_len - mel_db.shape[1]
            mel_db = np.pad(mel_db, ((0, 0), (0, pad_width)), mode="constant")
        else:
            mel_db = mel_db[:, : self.max_len]

        return mel_db

    def __getitem__(self, idx: int):
        file_path, label = self.items[idx]
        mel_db = self._load_mel(file_path)
        mel_db = (mel_db - mel_db.mean()) / (mel_db.std() + 1e-6)
        tensor = torch.tensor(mel_db, dtype=torch.float32).unsqueeze(0)
        return tensor, label

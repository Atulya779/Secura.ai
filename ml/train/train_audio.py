import argparse
from pathlib import Path

import matplotlib.pyplot as plt
import torch
from torch import nn, optim
from torch.utils.data import DataLoader, random_split

from ml.train.datasets import AudioDataset
from ml.utils import accuracy_from_logits, get_device, save_best_checkpoint, set_seed


class AudioCNN(nn.Module):
    def __init__(self, num_classes: int = 2):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(1, 16, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(16, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d((4, 4)),
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(64 * 4 * 4, 128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, num_classes),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.features(x)
        return self.classifier(x)


def build_dataloaders(data_dir: Path, batch_size: int, max_len: int):
    dataset = AudioDataset(root_dir=data_dir, max_len=max_len)
    val_size = max(1, int(0.2 * len(dataset)))
    train_size = len(dataset) - val_size
    train_set, val_set = random_split(dataset, [train_size, val_size])

    train_loader = DataLoader(train_set, batch_size=batch_size, shuffle=True, num_workers=2)
    val_loader = DataLoader(val_set, batch_size=batch_size, shuffle=False, num_workers=2)

    class_to_idx = {"fake": 0, "real": 1}
    return class_to_idx, train_loader, val_loader


def train(args):
    set_seed(42)
    device = get_device()
    data_dir = Path(args.data_dir)
    model_dir = Path(args.model_dir)
    model_dir.mkdir(parents=True, exist_ok=True)

    class_to_idx, train_loader, val_loader = build_dataloaders(
        data_dir, args.batch_size, args.max_len
    )

    model = AudioCNN().to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=args.lr)

    best_acc = 0.0
    train_losses = []
    val_losses = []

    for epoch in range(args.epochs):
        model.train()
        epoch_loss = 0.0
        epoch_acc = 0.0

        for inputs, labels in train_loader:
            inputs = inputs.to(device)
            labels = labels.to(device)

            optimizer.zero_grad()
            logits = model(inputs)
            loss = criterion(logits, labels)
            loss.backward()
            optimizer.step()

            epoch_loss += loss.item()
            epoch_acc += accuracy_from_logits(logits, labels)

        train_losses.append(epoch_loss / max(1, len(train_loader)))

        model.eval()
        val_loss = 0.0
        val_acc = 0.0
        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs = inputs.to(device)
                labels = labels.to(device)
                logits = model(inputs)
                loss = criterion(logits, labels)
                val_loss += loss.item()
                val_acc += accuracy_from_logits(logits, labels)

        val_loss /= max(1, len(val_loader))
        val_acc /= max(1, len(val_loader))
        val_losses.append(val_loss)

        print(
            f"Epoch {epoch + 1}/{args.epochs} | "
            f"Train Loss: {train_losses[-1]:.4f} | "
            f"Val Loss: {val_loss:.4f} | "
            f"Val Acc: {val_acc:.4f}"
        )

        if val_acc > best_acc:
            best_acc = val_acc
            checkpoint = {
                "model_state": model.state_dict(),
                "class_to_idx": class_to_idx,
                "arch": "audio_cnn",
                "max_len": args.max_len,
            }
            save_best_checkpoint(checkpoint, model_dir / "audio_model.pth")

    if args.plot:
        plt.figure(figsize=(6, 4))
        plt.plot(train_losses, label="train")
        plt.plot(val_losses, label="val")
        plt.legend()
        plt.title("Audio Model Loss")
        plt.tight_layout()
        plt.savefig(model_dir / "audio_training_loss.png")

    print(f"Best validation accuracy: {best_acc:.4f}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train audio deepfake model")
    parser.add_argument("--data-dir", default="../data/audio", type=str)
    parser.add_argument("--model-dir", default="../models", type=str)
    parser.add_argument("--epochs", default=12, type=int)
    parser.add_argument("--batch-size", default=16, type=int)
    parser.add_argument("--lr", default=1e-4, type=float)
    parser.add_argument("--max-len", default=256, type=int)
    parser.add_argument("--plot", action="store_true")
    args = parser.parse_args()

    train(args)

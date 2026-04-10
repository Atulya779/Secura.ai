import argparse
import os
from pathlib import Path

import matplotlib.pyplot as plt
import torch
from torch import nn, optim
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, models, transforms

from ml.utils import accuracy_from_logits, get_device, save_best_checkpoint, set_seed


def build_dataloaders(data_dir: Path, batch_size: int, image_size: int):
    transform = transforms.Compose(
        [
            transforms.Resize((image_size, image_size)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ]
    )

    dataset = datasets.ImageFolder(root=str(data_dir), transform=transform)
    val_size = max(1, int(0.2 * len(dataset)))
    train_size = len(dataset) - val_size
    train_set, val_set = random_split(dataset, [train_size, val_size])

    # Avoid multiprocessing issues on Windows.
    num_workers = 0 if os.name == "nt" else 2
    train_loader = DataLoader(train_set, batch_size=batch_size, shuffle=True, num_workers=num_workers)
    val_loader = DataLoader(val_set, batch_size=batch_size, shuffle=False, num_workers=num_workers)

    return dataset.class_to_idx, train_loader, val_loader


def build_model(num_classes: int = 2):
    model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
    model.fc = nn.Linear(model.fc.in_features, num_classes)
    return model


def train(args):
    set_seed(42)
    device = get_device()
    data_dir = Path(args.data_dir)
    model_dir = Path(args.model_dir)
    model_dir.mkdir(parents=True, exist_ok=True)

    class_to_idx, train_loader, val_loader = build_dataloaders(
        data_dir, args.batch_size, args.image_size
    )

    model = build_model().to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=args.lr)

    best_acc = 0.0
    train_losses = []
    val_losses = []

    for epoch in range(args.epochs):
        model.train()
        epoch_loss = 0.0
        epoch_acc = 0.0

        for batch, (inputs, labels) in enumerate(train_loader, start=1):
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
                "arch": "resnet18",
                "image_size": args.image_size,
            }
            save_best_checkpoint(checkpoint, model_dir / "image_model.pth")

    if args.plot:
        plt.figure(figsize=(6, 4))
        plt.plot(train_losses, label="train")
        plt.plot(val_losses, label="val")
        plt.legend()
        plt.title("Image Model Loss")
        plt.tight_layout()
        plt.savefig(model_dir / "image_training_loss.png")

    print(f"Best validation accuracy: {best_acc:.4f}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train image deepfake model")
    parser.add_argument("--data-dir", default="../data/image", type=str)
    parser.add_argument("--model-dir", default="../models", type=str)
    parser.add_argument("--epochs", default=10, type=int)
    parser.add_argument("--batch-size", default=16, type=int)
    parser.add_argument("--lr", default=1e-4, type=float)
    parser.add_argument("--image-size", default=224, type=int)
    parser.add_argument("--plot", action="store_true")
    args = parser.parse_args()

    train(args)

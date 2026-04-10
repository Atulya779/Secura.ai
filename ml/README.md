# Secura AI ML

## Overview
Training and inference for Secura AI deepfake detection (image, video via frame sampling, and audio). Models are loaded from ml/models/.

## Folder Structure
```
ml/
  train/
    train_image.py
    train_audio.py
    datasets.py
  inference/
    inference.py
    preprocess.py
  models/
  data/
    image/
      real/
      fake/
    audio/
      real/
      fake/
  utils.py
```

## Setup
- Python 3.9+

Install dependencies:
```
pip install torch torchvision opencv-python librosa numpy matplotlib
```

## Dataset Prep
- Image:
  ml/data/image/real/
  ml/data/image/fake/
- Audio:
  ml/data/audio/real/
  ml/data/audio/fake/

Notes:
- Keep classes balanced
- Recommended image size: 224x224
- Recommended audio: 16kHz mono
- Use exactly two folders: real/ and fake/ (case-sensitive)
- Label mapping: real -> 0, fake -> 1
- Supported image types: .jpg, .jpeg, .png
- Supported audio types: .wav (recommended), .mp3 (converted internally)
- Filenames: avoid spaces and special characters
- Avoid duplicates across train/val
- Ensure fake samples are truly manipulated or AI-generated
- Videos are not trained directly; frames are sampled for image inference

## Training Commands
- Image:
  python -m ml.train.train_image
- Audio:
  python -m ml.train.train_audio

## Outputs
- Saved models:
  ml/models/image_model.pth
  ml/models/audio_model.pth

## Inference
Functions in ml/inference/inference.py:
- detect_image(path) -> (risk_score, model_status)
- detect_audio(path) -> (risk_score, model_status)
- detect_video(path) -> (risk_score, model_status)

The backend calls these in /verify-upload.

## Fallback Behavior
If model files are missing, the inference functions return a deterministic demo score and
set `model_status` to `missing`. This keeps the demo running while clearly labeling
non-model output.

## Tips
- Use GPU if available
- Start with small datasets
- Do not commit ml/data/ or large .pth files

## Recommended Dataset Size
- Image:
  - Minimum: ~500 samples per class (real/fake)
  - Good: 2,000–5,000 per class
- Audio:
  - Minimum: ~200 samples per class
  - Good: 1,000+ per class
- Split: Train 80% | Validation 20%
- Balance: keep classes within ±10%

Notes:
- Start small to verify the pipeline, then scale
- More diversity (lighting, devices, compression) beats sheer volume

## Basic Data Augmentation
Images:
- Random horizontal flip
- Small rotations (±10–15 degrees)
- Brightness/contrast jitter
- Resize/crop to 224x224

Audio:
- Add light background noise
- Time shift (small offsets)
- Volume scaling
- Convert to mel-spectrogram for CNN input

Guidelines:
- Do not over-augment (avoid unrealistic distortions)
- Apply augmentation only to the training set (not validation)

## Reproducibility
- Set a fixed random seed for splits and training
- Log hyperparameters (batch size, lr, epochs)
- Save the best model based on validation accuracy/loss

## Example Training Log
```
Epoch 1/10 - loss: 0.68 - acc: 0.59 - val_loss: 0.65 - val_acc: 0.62
Epoch 2/10 - loss: 0.60 - acc: 0.67 - val_loss: 0.58 - val_acc: 0.69
Epoch 3/10 - loss: 0.53 - acc: 0.73 - val_loss: 0.52 - val_acc: 0.74
Epoch 4/10 - loss: 0.47 - acc: 0.78 - val_loss: 0.49 - val_acc: 0.76
Epoch 5/10 - loss: 0.43 - acc: 0.81 - val_loss: 0.46 - val_acc: 0.78
...
Best model saved to ml/models/image_model.pth
```

Notes:
- Monitor both training and validation metrics
- Watch for overfitting (train up, val down)

## Expected Training Time (Approx.)
CPU (no GPU):
- Image (ResNet18, small dataset ~1-2k/class): 20-60 minutes (5-10 epochs)
- Audio (CNN on spectrograms): 10-30 minutes

GPU (if available):
- Image: 5-15 minutes
- Audio: 3-10 minutes

Variables:
- Dataset size
- Batch size
- Image resolution
- Hardware

Tip:
- Start with 3-5 epochs to validate the pipeline, then scale

## Quick Sanity Checklist
- Model loads from ml/models/ without error
- /verify-upload returns consistent JSON (type, risk_score, decision, reason)
- Predictions are stable across similar inputs
- No crashes when model files are missing (fallback works)

## Troubleshooting
- Module not found: ensure the project root is the working directory
- CUDA issues: fallback to CPU

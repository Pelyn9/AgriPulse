"""Train MobileNetV2 rice leaf disease classifier with transfer learning."""
import os
import sys
import json
import shutil
import random
import numpy as np
from pathlib import Path

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout, Input
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import (
    EarlyStopping,
    ModelCheckpoint,
    ReduceLROnPlateau,
)
from tensorflow.keras.preprocessing.image import ImageDataGenerator

try:
    from download_dataset import download_rice_dataset, download_soil_dataset, count_images, CATEGORY_MAP, DATA_DIR
except ImportError:
    from download_dataset import download_rice_dataset, download_soil_dataset, count_images, CATEGORY_MAP, DATA_DIR

BACKEND_DIR = Path(__file__).resolve().parent
MODELS_DIR = BACKEND_DIR / "models"
DATA_DIR = BACKEND_DIR / "data"

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
NUM_CLASSES = len(CATEGORY_MAP)
EPOCHS_PHASE1 = 20
EPOCHS_PHASE2 = 15
FINE_TUNE_AT = 100
CLASS_NAMES = sorted(CATEGORY_MAP.values())
SEED = 42

random.seed(SEED)
np.random.seed(SEED)
tf.random.set_seed(SEED)


def prepare_data(rice_dir: Path) -> tuple[Path, Path, Path]:
    """Organize images into train/val/test splits (70/15/15)."""
    splits_dir = DATA_DIR / "splits"
    if splits_dir.exists():
        shutil.rmtree(splits_dir)

    for split in ["train", "val", "test"]:
        for label in CLASS_NAMES:
            (splits_dir / split / label).mkdir(parents=True, exist_ok=True)

    for folder_name, label in CATEGORY_MAP.items():
        src = rice_dir / folder_name
        if not src.exists():
            print(f"  WARNING: {folder_name} not found, skipping {label}")
            continue

        images = [f for f in os.listdir(src) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
        random.shuffle(images)

        n = len(images)
        n_train = int(n * 0.70)
        n_val = int(n * 0.15)

        train_imgs = images[:n_train]
        val_imgs = images[n_train:n_train + n_val]
        test_imgs = images[n_train + n_val:]

        for img_name in train_imgs:
            shutil.copy2(str(src / img_name), str(splits_dir / "train" / label / img_name))
        for img_name in val_imgs:
            shutil.copy2(str(src / img_name), str(splits_dir / "val" / label / img_name))
        for img_name in test_imgs:
            shutil.copy2(str(src / img_name), str(splits_dir / "test" / label / img_name))

        print(f"  {label}: {len(train_imgs)} train, {len(val_imgs)} val, {len(test_imgs)} test")

    return splits_dir / "train", splits_dir / "val", splits_dir / "test"


def build_model() -> Model:
    """Build MobileNetV2 with custom classification head."""
    base_model = MobileNetV2(
        input_shape=(224, 224, 3),
        include_top=False,
        weights="imagenet",
        pooling="avg",
    )

    base_model.trainable = False

    inputs = Input(shape=(224, 224, 3))
    x = base_model(inputs, training=False)
    x = Dense(256, activation="relu")(x)
    x = Dropout(0.3)(x)
    x = Dense(128, activation="relu")(x)
    x = Dropout(0.3)(x)
    outputs = Dense(NUM_CLASSES, activation="softmax")(x)

    model = Model(inputs=inputs, outputs=outputs, name="RiceLeafMobileNetV2")
    return model, base_model


def train(train_dir: Path, val_dir: Path, test_dir: Path):
    """Full training pipeline with transfer learning."""
    MODELS_DIR.mkdir(parents=True, exist_ok=True)

    train_datagen = ImageDataGenerator(
        preprocessing_function=preprocess_input,
        rotation_range=30,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        vertical_flip=True,
        brightness_range=[0.7, 1.3],
        fill_mode="nearest",
    )

    val_datagen = ImageDataGenerator(preprocessing_function=preprocess_input)

    train_gen = train_datagen.flow_from_directory(
        str(train_dir),
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode="categorical",
        shuffle=True,
        seed=SEED,
    )

    val_gen = val_datagen.flow_from_directory(
        str(val_dir),
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode="categorical",
        shuffle=False,
    )

    test_gen = val_datagen.flow_from_directory(
        str(test_dir),
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode="categorical",
        shuffle=False,
    )

    print(f"\nClasses found: {train_gen.class_indices}")
    print(f"Training samples: {train_gen.samples}")
    print(f"Validation samples: {val_gen.samples}")
    print(f"Test samples: {test_gen.samples}")

    model, base_model = build_model()

    callbacks_phase1 = [
        EarlyStopping(monitor="val_loss", patience=5, restore_best_weights=True, verbose=1),
        ModelCheckpoint(str(MODELS_DIR / "best_frozen.keras"), monitor="val_accuracy", save_best_only=True, mode="max", verbose=1),
        ReduceLROnPlateau(monitor="val_loss", factor=0.2, patience=3, min_lr=1e-7, verbose=1),
    ]

    print("\n" + "=" * 60)
    print("PHASE 1: Training classifier head (base frozen)")
    print("=" * 60)

    model.compile(
        optimizer=Adam(learning_rate=1e-3),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    history1 = model.fit(
        train_gen,
        epochs=EPOCHS_PHASE1,
        validation_data=val_gen,
        callbacks=callbacks_phase1,
        verbose=1,
    )

    print("\n" + "=" * 60)
    print("PHASE 2: Fine-tuning top layers")
    print("=" * 60)

    base_model.trainable = True
    for layer in base_model.layers[:FINE_TUNE_AT]:
        layer.trainable = False

    trainable_count = sum(1 for layer in base_model.layers if layer.trainable)
    print(f"Unfrozen base layers: {trainable_count}/{len(base_model.layers)}")

    callbacks_phase2 = [
        EarlyStopping(monitor="val_loss", patience=5, restore_best_weights=True, verbose=1),
        ModelCheckpoint(str(MODELS_DIR / "best_finetuned.keras"), monitor="val_accuracy", save_best_only=True, mode="max", verbose=1),
        ReduceLROnPlateau(monitor="val_loss", factor=0.2, patience=3, min_lr=1e-8, verbose=1),
    ]

    model.compile(
        optimizer=Adam(learning_rate=1e-5),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    history2 = model.fit(
        train_gen,
        epochs=EPOCHS_PHASE2,
        validation_data=val_gen,
        initial_epoch=history1.epoch[-1],
        callbacks=callbacks_phase2,
        verbose=1,
    )

    print("\n" + "=" * 60)
    print("EVALUATING ON TEST SET")
    print("=" * 60)

    test_loss, test_acc = model.evaluate(test_gen, verbose=1)
    print(f"\nTest Accuracy: {test_acc:.4f}")
    print(f"Test Loss: {test_loss:.4f}")

    best_model_path = MODELS_DIR / "best_finetuned.keras"
    if best_model_path.exists():
        model = tf.keras.models.load_model(str(best_model_path))

    final_path = MODELS_DIR / "rice_leaf_mobilenetv2.keras"
    model.save(str(final_path))
    print(f"\nModel saved to: {final_path}")

    class_names_list = list(train_gen.class_indices.keys())
    meta = {
        "version": "2.0",
        "architecture": "MobileNetV2",
        "input_shape": [224, 224, 3],
        "num_classes": NUM_CLASSES,
        "class_names": class_names_list,
        "class_indices": train_gen.class_indices,
        "test_accuracy": float(test_acc),
        "test_loss": float(test_loss),
        "training_samples": train_gen.samples,
        "epochs_phase1": len(history1.history["loss"]),
        "epochs_phase2": len(history2.history["loss"]) - len(history1.history["loss"]),
        "preprocessing": "mobilenet_v2.preprocess_input (scales to [-1, 1])",
    }

    meta_path = MODELS_DIR / "model_meta.json"
    with open(meta_path, "w") as f:
        json.dump(meta, f, indent=2)
    print(f"Model metadata saved to: {meta_path}")

    shutil.copy2(str(final_path), str(BACKEND_DIR / "rice_leaf_mobilenetv2.keras"))
    shutil.copy2(str(meta_path), str(BACKEND_DIR / "model_meta.json"))
    print(f"Model copied to backend root for serving")

    return test_acc


def retrain_with_user_data():
    """Retrain using accumulated user-submitted training images from Supabase."""
    print("Retrain with user data - requires Supabase connection")
    print("Run train_model.py to retrain with Kaggle data + any additional images in data/custom/")

    custom_dir = DATA_DIR / "custom"
    if custom_dir.exists():
        for label in CLASS_NAMES:
            label_dir = custom_dir / label
            if label_dir.exists():
                n = len([f for f in os.listdir(label_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
                print(f"  Custom {label}: {n} images")

    print("\nTo add custom images, place them in:")
    print(f"  backend/data/custom/{{label}}/")
    print(f"  Labels: {', '.join(CLASS_NAMES)}")


if __name__ == "__main__":
    print("=" * 60)
    print("AgriPulse MobileNetV2 Training Pipeline")
    print("=" * 60)

    if "--retrain" in sys.argv:
        retrain_with_user_data()
        sys.exit(0)

    rice_dir = DATA_DIR / "rice_leaf_disease"
    if not rice_dir.exists():
        print("\nDownloading datasets...")
        rice_dir = download_rice_dataset()
        try:
            download_soil_dataset()
        except Exception as e:
            print(f"Soil dataset download skipped: {e}")

    counts = count_images(rice_dir)
    total = sum(counts.values())
    print(f"\nDataset: {total} images across {len(counts)} classes")
    for label, count in counts.items():
        print(f"  {label}: {count}")

    if total < 50:
        print("\nERROR: Not enough images for training. Need at least 50 total.")
        sys.exit(1)

    print("\nPreparing train/val/test splits...")
    train_dir, val_dir, test_dir = prepare_data(rice_dir)

    print("\nStarting MobileNetV2 training...")
    accuracy = train(train_dir, val_dir, test_dir)

    print("\n" + "=" * 60)
    print("TRAINING COMPLETE")
    print(f"Test Accuracy: {accuracy:.2%}")
    print(f"Model: {MODELS_DIR / 'rice_leaf_mobilenetv2.keras'}")
    print("=" * 60)

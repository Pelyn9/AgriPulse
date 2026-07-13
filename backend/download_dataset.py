"""Download rice leaf disease and soil datasets from Kaggle."""
import os
import shutil
from pathlib import Path

try:
    import kagglehub
    from kagglehub import KaggleDatasetAdapter
except ImportError:
    print("Installing kagglehub...")
    os.system("pip install kagglehub[pandas-datasets]")
    import kagglehub
    from kagglehub import KaggleDatasetAdapter

DATA_DIR = Path(__file__).resolve().parent / "data"
RICE_DIR = DATA_DIR / "rice_leaf_disease"
SOIL_DIR = DATA_DIR / "soil_type"

RICE_DATASET_ID = "uynguyenthai/rice-leaf-disease-final-dataset"
SOIL_DATASET_ID = "aniketkumaraugustya/soil-type-dataset"

CATEGORY_MAP = {
    "healthy": "Healthy",
    "brown_spot": "Brown Spot",
    "leaf_blast": "Rice Blast",
    "bacterial_leaf_blight": "Bacterial Leaf Blight",
}


def download_rice_dataset() -> Path:
    """Download the rice leaf disease dataset."""
    print(f"Downloading rice leaf disease dataset ({RICE_DATASET_ID})...")
    path = kagglehub.dataset_download(RICE_DATASET_ID)
    print(f"  Downloaded to: {path}")

    extracted = Path(path) / "rice_disease_raw_deduped"
    if not extracted.exists():
        for item in Path(path).iterdir():
            if item.is_dir() and any(subdir.name in CATEGORY_MAP for subdir in item.iterdir() if subdir.is_dir()):
                extracted = item
                break

    target = RICE_DIR
    if target.exists():
        shutil.rmtree(target)

    shutil.copytree(str(extracted), str(target))
    print(f"  Organized to: {target}")
    return target


def download_soil_dataset() -> Path:
    """Download the soil type dataset."""
    print(f"Downloading soil type dataset ({SOIL_DATASET_ID})...")
    df = kagglehub.load_dataset(
        KaggleDatasetAdapter.PANDAS,
        SOIL_DATASET_ID,
        "",
    )

    target = SOIL_DIR
    target.mkdir(parents=True, exist_ok=True)

    csv_path = target / "soil_with_crop_recommendations.csv"
    df.to_csv(csv_path, index=False)
    print(f"  Saved to: {csv_path}")
    print(f"  Records: {len(df)}")
    return target


def count_images(rice_dir: Path) -> dict:
    """Count available images per category."""
    counts = {}
    for folder_name, label in CATEGORY_MAP.items():
        folder = rice_dir / folder_name
        if folder.exists():
            n = len([f for f in os.listdir(folder) if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
            counts[label] = n
        else:
            counts[label] = 0
    return counts


if __name__ == "__main__":
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    print("=" * 60)
    print("STEP 1: Downloading datasets from Kaggle")
    print("=" * 60)

    rice_dir = download_rice_dataset()
    soil_dir = download_soil_dataset()

    print("\n" + "=" * 60)
    print("DATASET SUMMARY")
    print("=" * 60)

    counts = count_images(rice_dir)
    total = 0
    for label, count in counts.items():
        print(f"  {label}: {count} images")
        total += count
    print(f"  TOTAL: {total} images across {len(counts)} classes")

    print(f"\n  Soil CSV: {soil_dir / 'soil_with_crop_recommendations.csv'}")
    print("\nDatasets ready for training!")

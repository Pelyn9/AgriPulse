"""Regenerate reference_features.json and color signatures from all available data sources.

Combines:
  1. Kaggle rice leaf disease dataset (Healthy, Brown Spot, Rice Blast, Bacterial Leaf Blight)
  2. Local assets (Nitrogen Deficiency, Phosphorus Deficiency, Potassium Deficiency, Rice Leaf Diseases)
  3. User-submitted training images from data/custom/ (if present)

Usage:
  python regenerate_features.py              # Combine all sources
  python regenerate_features.py --local-only # Local assets only (no Kaggle needed)
"""
import json, os, sys, cv2, numpy as np, csv, random
from pathlib import Path
from sklearn.preprocessing import StandardScaler
from collections import defaultdict, Counter

random.seed(42)
np.random.seed(42)

BACKEND_DIR = Path(__file__).resolve().parent
PUBLIC_DIR = BACKEND_DIR.parent / "public"
ASSETS_DIR = BACKEND_DIR.parent / "src" / "assets"

LOCAL_ONLY = "--local-only" in sys.argv

if not LOCAL_ONLY:
    KAGGLE_RICE = BACKEND_DIR / "data" / "rice_leaf_disease"
    SOIL_CSV = BACKEND_DIR / "data" / "soil_type" / "soil_with_crop_recommendations.csv"

ALL_CATEGORIES = [
    "Healthy",
    "Nitrogen Deficiency",
    "Phosphorus Deficiency",
    "Potassium Deficiency",
    "Brown Spot",
    "Rice Blast",
    "Bacterial Leaf Blight",
    "Rice Leaf Diseases",
]

LOCAL_FOLDER_MAP = {
    "healthyriceleaf": "Healthy",
    "nitrogendeficiency": "Nitrogen Deficiency",
    "phosphorusdeficiency": "Phosphorus Deficiency",
    "potassiumdeficiency": "Potassium Deficiency",
    "RiceLeafDiseases(Future Expansion)": "Rice Leaf Diseases",
}

KAGGLE_FOLDER_MAP = {
    "healthy": "Healthy",
    "brown_spot": "Brown Spot",
    "leaf_blast": "Rice Blast",
    "bacterial_leaf_blight": "Bacterial Leaf Blight",
}

SAMPLES_PER_KAGGLE_CLASS = 300


def extract_features(image: np.ndarray) -> list:
    """Extract 103-dimensional feature vector."""
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(hsv)
    hist_h = cv2.calcHist([h], [0], None, [32], [0, 180]).flatten()
    hist_s = cv2.calcHist([s], [0], None, [32], [0, 256]).flatten()
    hist_v = cv2.calcHist([v], [0], None, [32], [0, 256]).flatten()
    hist_h = hist_h / (hist_h.sum() + 1e-8)
    hist_s = hist_s / (hist_s.sum() + 1e-8)
    hist_v = hist_v / (hist_v.sum() + 1e-8)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 50, 150)
    edge_density = float(edges.mean())
    mean_h, mean_s, mean_v = float(h.mean()), float(s.mean()), float(v.mean())
    std_h, std_s, std_v = float(h.std()), float(s.std()), float(v.std())
    return np.concatenate([hist_h, hist_s, hist_v, [edge_density], [mean_h, mean_s, mean_v, std_h, std_s, std_v]]).tolist()


def extract_color_signature(images: list) -> dict:
    """Extract average HSV and RGB from a set of images."""
    all_hsv = []
    for img in images:
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        h, s, v = cv2.split(hsv)
        mask = (s > 30) & (v > 40)
        valid_h = h[mask]
        valid_s = s[mask]
        valid_v = v[mask]
        if len(valid_h) == 0:
            continue
        all_hsv.append((float(valid_h.mean()), float(valid_s.mean()), float(valid_v.mean())))
    if not all_hsv:
        return {"rgb": [0, 0, 0], "hsv": [0, 0, 0], "label": ""}
    avg_h = float(np.mean([x[0] for x in all_hsv]))
    avg_s = float(np.mean([x[1] for x in all_hsv]))
    avg_v = float(np.mean([x[2] for x in all_hsv]))
    avg_rgb = cv2.cvtColor(np.uint8([[[avg_h, avg_s, avg_v]]]), cv2.COLOR_HSV2RGB)[0][0].tolist()
    return {"rgb": avg_rgb, "hsv": [avg_h, avg_s, avg_v], "label": ""}


def load_images_from_dir(directory: Path, limit: int = 0) -> list:
    """Load all images from a directory, resized to 224x224."""
    images = []
    if not directory.exists():
        return images
    files = [f for f in os.listdir(directory) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
    if limit > 0:
        random.shuffle(files)
        files = files[:limit]
    for fname in files:
        img = cv2.imread(str(directory / fname))
        if img is not None:
            images.append(cv2.resize(img, (224, 224)))
    return images


print("=" * 60)
print("Regenerating Reference Features & Color Signatures")
print(f"Mode: {'LOCAL ONLY' if LOCAL_ONLY else 'ALL SOURCES'}")
print("=" * 60)

all_features = []
all_labels = []
color_images = {cat: [] for cat in ALL_CATEGORIES}
class_counts = {cat: 0 for cat in ALL_CATEGORIES}

# === 1. Load local assets (N/P/K deficiency + Rice Leaf Diseases) ===
print("\n--- Local Assets ---")
for folder_name, label in LOCAL_FOLDER_MAP.items():
    folder = ASSETS_DIR / folder_name
    if not folder.exists():
        print(f"  {label}: folder not found, skipping")
        continue
    images = load_images_from_dir(folder)
    for img in images:
        all_features.append(extract_features(img))
        all_labels.append(label)
        class_counts[label] += 1
    color_images[label] = images[:100]
    print(f"  {label}: {len(images)} images")

# === 2. Load Kaggle dataset (if available and not local-only) ===
if not LOCAL_ONLY and KAGGLE_RICE.exists():
    print("\n--- Kaggle Dataset ---")
    for folder_name, label in KAGGLE_FOLDER_MAP.items():
        folder = KAGGLE_RICE / folder_name
        if not folder.exists():
            print(f"  {label}: folder not found, skipping")
            continue
        all_jpgs = [f for f in os.listdir(folder) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        random.shuffle(all_jpgs)
        selected = all_jpgs[:SAMPLES_PER_KAGGLE_CLASS]
        print(f"  {label}: {len(selected)}/{len(all_jpgs)} images")
        for fname in selected:
            img = cv2.imread(str(folder / fname))
            if img is None:
                continue
            img_resized = cv2.resize(img, (224, 224))
            all_features.append(extract_features(img_resized))
            all_labels.append(label)
            class_counts[label] += 1
            if len(color_images[label]) < 100:
                color_images[label].append(img_resized)
else:
    if not LOCAL_ONLY:
        print("\n--- Kaggle dataset not found (run download_dataset.py first) ---")

# === 3. Load custom user-submitted images ===
custom_dir = BACKEND_DIR / "data" / "custom"
if custom_dir.exists():
    print("\n--- Custom User Images ---")
    for label in ALL_CATEGORIES:
        label_dir = custom_dir / label.replace(" ", "_")
        if not label_dir.exists():
            label_dir = custom_dir / label
        if not label_dir.exists():
            continue
        images = load_images_from_dir(label_dir)
        for img in images:
            all_features.append(extract_features(img))
            all_labels.append(label)
            class_counts[label] += 1
        color_images[label].extend(images[:50])
        print(f"  {label}: {len(images)} custom images")

# === Summary ===
print("\n--- Dataset Summary ---")
total = 0
for label in ALL_CATEGORIES:
    count = class_counts[label]
    total += count
    status = "OK" if count >= 3 else "LOW (add more images!)"
    print(f"  {label}: {count} images [{status}]")
print(f"  TOTAL: {total} images across {len(ALL_CATEGORIES)} classes")

if total < 10:
    print("\nERROR: Not enough images. Need at least 10 total.")
    sys.exit(1)

# === Generate reference_features.json ===
print("\n--- Generating reference_features.json ---")
all_features_arr = np.array(all_features, dtype=np.float32)
scaler = StandardScaler()
all_features_scaled = scaler.fit_transform(all_features_arr)

reference_data = []
for i in range(len(all_labels)):
    reference_data.append({
        "features": all_features_scaled[i].tolist(),
        "label": all_labels[i],
    })

output = {
    "version": 3,
    "description": "All 8 rice leaf classes. Sources: Kaggle dataset + local assets + user submissions.",
    "classes": ALL_CATEGORIES,
    "samples_per_class": {cat: class_counts[cat] for cat in ALL_CATEGORIES},
    "total_samples": total,
    "scaler_mean": scaler.mean_.tolist(),
    "scaler_scale": scaler.scale_.tolist(),
    "data": reference_data,
}

with open(PUBLIC_DIR / "reference_features.json", "w") as f:
    json.dump(output, f, separators=(",", ":"))
print(f"  Saved: {PUBLIC_DIR / 'reference_features.json'} ({len(reference_data)} samples)")

# === Generate color_signatures.json ===
print("\n--- Generating color_signatures.json ---")
color_signatures = {}
for label in ALL_CATEGORIES:
    if color_images[label]:
        sig = extract_color_signature(color_images[label])
        color_signatures[label] = sig
        print(f"  {label}: rgb=({sig['rgb'][0]},{sig['rgb'][1]},{sig['rgb'][2]}) hsv=({sig['hsv'][0]:.0f},{sig['hsv'][1]:.0f},{sig['hsv'][2]:.0f})")
    else:
        print(f"  {label}: no images (using fallback)")
        fallback = {
            "Healthy": {"rgb": [102, 132, 41], "hsv": [40, 175, 133]},
            "Nitrogen Deficiency": {"rgb": [200, 214, 74], "hsv": [68, 180, 214]},
            "Phosphorus Deficiency": {"rgb": [106, 76, 147], "hsv": [268, 180, 147]},
            "Potassium Deficiency": {"rgb": [217, 119, 6], "hsv": [28, 250, 217]},
            "Brown Spot": {"rgb": [139, 69, 19], "hsv": [25, 222, 139]},
            "Rice Blast": {"rgb": [160, 120, 90], "hsv": [24, 100, 160]},
            "Bacterial Leaf Blight": {"rgb": [212, 184, 106], "hsv": [43, 110, 212]},
            "Rice Leaf Diseases": {"rgb": [198, 40, 40], "hsv": [0, 215, 198]},
        }
        color_signatures[label] = fallback.get(label, {"rgb": [128, 128, 128], "hsv": [0, 0, 128], "label": ""})

with open(PUBLIC_DIR / "color_signatures.json", "w") as f:
    json.dump(color_signatures, f, indent=2)
print(f"  Saved: {PUBLIC_DIR / 'color_signatures.json'}")

# === Soil analysis (only if CSV available) ===
if not LOCAL_ONLY and SOIL_CSV.exists():
    print("\n--- Soil Dataset Analysis ---")
    soil_types = Counter()
    crop_map = defaultdict(set)
    with open(SOIL_CSV, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            st = row.get("Soil_Type", "").strip()
            if st:
                soil_types[st] += 1
            for crop_field in ["Crop1", "Crop2", "Crop3"]:
                crop = row.get(crop_field, "").strip()
                if crop and st:
                    crop_map[crop].add(st)
    soil_rice_types = sorted(crop_map.get("Rice", set()))
    with open(PUBLIC_DIR / "soil_analysis.json", "w") as f:
        json.dump({
            "rice_recommended_soil_types": soil_rice_types,
            "all_soil_types": sorted(soil_types.keys()),
            "soil_type_counts": dict(soil_types.most_common()),
            "crop_to_soil_types": {k: sorted(v) for k, v in crop_map.items()},
        }, f, indent=2)
    print(f"  Saved: {PUBLIC_DIR / 'soil_analysis.json'}")

print("\n" + "=" * 60)
print("DONE! All reference files regenerated.")
print("=" * 60)

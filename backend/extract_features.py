import json, os, cv2, numpy as np
from pathlib import Path
from sklearn.preprocessing import StandardScaler

ASSETS_DIR = Path(__file__).resolve().parent.parent / "src" / "assets"

CATEGORY_MAP = {
    "healthyriceleaf": "Healthy",
    "nitrogendeficiency": "Nitrogen Deficiency",
    "phosphorusdeficiency": "Phosphorus Deficiency",
    "potassiumdeficiency": "Potassium Deficiency",
    "riceleafdiseases": "Rice Leaf Diseases",
}

def extract_features(image: np.ndarray) -> list:
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

    return np.concatenate([
        hist_h, hist_s, hist_v,
        [edge_density],
        [mean_h, mean_s, mean_v, std_h, std_s, std_v],
    ]).tolist()

features = []
labels = []

for folder_name in os.listdir(ASSETS_DIR):
    folder_path = ASSETS_DIR / folder_name
    if not folder_path.is_dir():
        continue

    label = None
    for key, val in CATEGORY_MAP.items():
        if key.lower() in folder_name.lower().replace(" ", "").replace("-", "").replace("_", ""):
            label = val
            break
    if label is None:
        continue

    for file_name in os.listdir(folder_path):
        if not file_name.lower().endswith((".jpg", ".jpeg", ".png", ".webp", ".bmp")):
            continue
        img_path = folder_path / file_name
        img = cv2.imread(str(img_path))
        if img is None:
            continue
        img = cv2.resize(img, (224, 224))
        feat = extract_features(img)
        features.append(feat)
        labels.append(label)
        print(f"  {label}: {file_name}")

features = np.array(features, dtype=np.float32)
scaler = StandardScaler()
scaler.fit(features)
features_scaled = scaler.transform(features)

output = {
    "features": features_scaled.tolist(),
    "labels": labels,
    "scaler_mean": scaler.mean_.tolist(),
    "scaler_scale": scaler.scale_.tolist(),
    "label_to_idx": {l: i for i, l in enumerate(sorted(set(labels)))},
}

output_path = Path(__file__).resolve().parent / "reference_features.json"
with open(output_path, "w") as f:
    json.dump(output, f)

print(f"\nSaved {len(features)} samples to {output_path}")
print(f"Labels: {sorted(set(labels))}")

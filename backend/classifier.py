"""Rice leaf disease classifier using MobileNetV2 CNN.

The old KNN classifier is preserved in this file as _LegacyKNNClassifier
and will be used as a fallback if the MobileNetV2 model is not found.
"""
import os
import json
import warnings
import numpy as np
from pathlib import Path

warnings.filterwarnings("ignore", category=UserWarning)

BACKEND_DIR = Path(__file__).resolve().parent
MODELS_DIR = BACKEND_DIR / "models"
MODEL_PATH = BACKEND_DIR / "rice_leaf_mobilenetv2.keras"
META_PATH = BACKEND_DIR / "model_meta.json"
ASSETS_DIR = BACKEND_DIR.parent / "src" / "assets"

CATEGORY_MAP = {
    "healthyriceleaf": "Healthy",
    "nitrogendeficiency": "Nitrogen Deficiency",
    "phosphorusdeficiency": "Phosphorus Deficiency",
    "potassiumdeficiency": "Potassium Deficiency",
    "riceleafdiseases": "Rice Leaf Diseases",
}

FULL_CATEGORY_MAP = {
    "Healthy": "Healthy",
    "Nitrogen Deficiency": "Nitrogen Deficiency",
    "Phosphorus Deficiency": "Phosphorus Deficiency",
    "Potassium Deficiency": "Potassium Deficiency",
    "Brown Spot": "Brown Spot",
    "Rice Blast": "Rice Blast",
    "Bacterial Leaf Blight": "Bacterial Leaf Blight",
    "Rice Leaf Diseases": "Rice Leaf Diseases",
}

CONFIDENCE_SCALE = 95.0


class MobileNetClassifier:
    """MobileNetV2-based CNN classifier for rice leaf diseases."""

    def __init__(self):
        self.model = None
        self.class_names = []
        self.meta = {}
        self.loaded = False

    def load(self):
        """Load the pre-trained MobileNetV2 model."""
        if self.loaded:
            return

        model_path = MODEL_PATH
        alt_path = MODELS_DIR / "rice_leaf_mobilenetv2.keras"

        if not model_path.exists() and alt_path.exists():
            model_path = alt_path

        if not model_path.exists():
            print("MobileNetV2 model not found, will fall back to KNN")
            return

        import tensorflow as tf
        self.model = tf.keras.models.load_model(str(model_path))
        print(f"MobileNetV2 model loaded from: {model_path}")

        if META_PATH.exists():
            with open(META_PATH) as f:
                self.meta = json.load(f)
            self.class_names = self.meta.get("class_names", [])
            print(f"Classes: {self.class_names}")
            print(f"Training accuracy: {self.meta.get('test_accuracy', 'unknown')}")
        else:
            self.class_names = sorted(FULL_CATEGORY_MAP.values())

        self.loaded = True

    def predict(self, image: np.ndarray) -> dict:
        """Classify a rice leaf image using MobileNetV2.

        Args:
            image: BGR numpy array (from OpenCV)

        Returns:
            dict with 'prediction', 'confidence', and 'all_probabilities'
        """
        if not self.loaded or self.model is None:
            raise RuntimeError("MobileNetV2 model not loaded")

        import tensorflow as tf
        from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

        img = tf.image.resize(image, [224, 224])
        img = tf.expand_dims(img, axis=0)
        img = preprocess_input(img)

        predictions = self.model.predict(img, verbose=0)
        pred_probs = predictions[0]

        top_indices = np.argsort(pred_probs)[::-1]
        top_idx = top_indices[0]
        prediction = self.class_names[top_idx] if top_idx < len(self.class_names) else "Unknown"
        confidence = float(pred_probs[top_idx])
        confidence = max(60, min(99, int(round(confidence * 100))))

        all_probs = {}
        for i in range(len(self.class_names)):
            if i < len(pred_probs):
                all_probs[self.class_names[i]] = round(float(pred_probs[i]) * 100, 1)

        alternatives = []
        for idx in top_indices[1:4]:
            if idx < len(self.class_names):
                alternatives.append({
                    "prediction": self.class_names[idx],
                    "confidence": round(float(pred_probs[idx]) * 100, 1),
                })

        return {
            "prediction": prediction,
            "confidence": confidence,
            "all_probabilities": all_probs,
            "alternatives": alternatives,
            "model": "mobilenet_v2",
        }


class _LegacyKNNClassifier:
    """Original KNN classifier (preserved as fallback).

    Uses handcrafted HSV histogram + edge features with K-Nearest Neighbors.
    This is the original classifier from AgriPulse v1.
    """

    def __init__(self):
        self.scaler = None
        self.knn = None
        self.trained = False
        self.labels = []

    def _extract_features(self, image: np.ndarray) -> np.ndarray:
        """Extract 103-dimensional feature vector from an image."""
        import cv2
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        h, s, v = cv2.split(hsv)

        hist_h = cv2.calcHist([h], [0], None, [32], [0, 180]).flatten()
        hist_s = cv2.calcHist([s], [0], None, [32], [0, 256]).flatten()
        hist_v = cv2.calcHist([v], [0], None, [32], [0, 256]).flatten()

        hist_h /= hist_h.sum() + 1e-8
        hist_s /= hist_s.sum() + 1e-8
        hist_v /= hist_v.sum() + 1e-8

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 50, 150)
        edge_density = edges.mean()

        mean_h, mean_s, mean_v = h.mean(), s.mean(), v.mean()
        std_h, std_s, std_v = h.std(), s.std(), v.std()

        return np.concatenate([
            hist_h, hist_s, hist_v,
            [edge_density],
            [mean_h, mean_s, mean_v, std_h, std_s, std_v],
        ])

    def train(self):
        """Train KNN from local asset images."""
        import cv2
        from sklearn.preprocessing import StandardScaler
        from sklearn.neighbors import KNeighborsClassifier

        features = []
        labels_raw = []

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
                feat = self._extract_features(img)
                features.append(feat)
                labels_raw.append(label)

        if len(features) < 2:
            raise RuntimeError(f"Not enough reference images found in {ASSETS_DIR}.")

        features = np.array(features, dtype=np.float32)
        self.scaler = StandardScaler()
        self.scaler.fit(features)
        features_scaled = self.scaler.transform(features)
        self.knn = KNeighborsClassifier(n_neighbors=3, weights="distance")
        self.knn.fit(features_scaled, labels_raw)
        self.trained = True
        self.labels = sorted(set(labels_raw))
        print(f"Legacy KNN trained on {len(features)} images across {len(self.labels)} categories")

    def predict(self, image: np.ndarray) -> dict:
        """Classify using KNN (legacy fallback)."""
        import cv2
        if not self.trained:
            raise RuntimeError("KNN classifier not trained")

        img = cv2.resize(image, (224, 224))
        feat = self._extract_features(img).reshape(1, -1).astype(np.float32)
        feat_scaled = self.scaler.transform(feat)

        distances, indices = self.knn.kneighbors(feat_scaled, n_neighbors=min(3, len(self.knn.classes_)))
        prediction = self.knn.predict(feat_scaled)[0]

        sim = 1.0 / (1.0 + distances[0].mean())
        confidence = int(round(sim * CONFIDENCE_SCALE))
        confidence = max(60, min(99, confidence))

        return {
            "prediction": prediction,
            "confidence": confidence,
            "all_probabilities": {},
            "alternatives": [],
            "model": "knn_legacy",
        }


class RiceLeafClassifier:
    """Main classifier that tries MobileNetV2 first, falls back to KNN.

    This preserves full backward compatibility with the original AgriPulse
    classifier while adding the much more accurate MobileNetV2 CNN.
    """

    def __init__(self):
        self.cnn = MobileNetClassifier()
        self.knn = _LegacyKNNClassifier()
        self.active_model = None

    def train(self):
        """Train both models (MobileNetV2 if available, KNN always)."""
        try:
            self.cnn.load()
            if self.cnn.loaded:
                self.active_model = "mobilenet_v2"
                print("Active model: MobileNetV2 (CNN)")
            else:
                raise RuntimeError("MobileNetV2 model not loaded")
        except Exception as e:
            print(f"MobileNetV2 not available: {e}")
            print("Falling back to KNN classifier")
            self.knn.train()
            self.active_model = "knn_legacy"
            print("Active model: KNN (legacy fallback)")

    def predict(self, image: np.ndarray) -> dict:
        """Classify a rice leaf image.

        Tries MobileNetV2 first. If unavailable, uses legacy KNN.
        Returns standardized result dict with prediction, confidence,
        all_probabilities, alternatives, and model identifier.
        """
        if self.active_model == "mobilenet_v2" and self.cnn.loaded:
            try:
                return self.cnn.predict(image)
            except Exception as e:
                print(f"MobileNetV2 prediction failed: {e}, trying KNN")
                if self.knn.trained:
                    return self.knn.predict(image)
                raise

        if self.knn.trained:
            return self.knn.predict(image)

        raise RuntimeError("No classifier available. Call train() first.")

    @property
    def model_info(self) -> dict:
        """Return info about the active model."""
        if self.active_model == "mobilenet_v2":
            return {
                "active": "mobilenet_v2",
                "version": self.cnn.meta.get("version", "2.0"),
                "accuracy": self.cnn.meta.get("test_accuracy"),
                "classes": self.cnn.class_names,
                "training_samples": self.cnn.meta.get("training_samples"),
            }
        return {
            "active": "knn_legacy",
            "version": "1.0",
            "classes": self.knn.labels,
        }


_classifier_cache: RiceLeafClassifier | None = None


def get_classifier() -> RiceLeafClassifier:
    global _classifier_cache
    if _classifier_cache is None:
        clf = RiceLeafClassifier()
        clf.train()
        _classifier_cache = clf
    return _classifier_cache

# AgriPulse (RiceLeaf AI)

Mobile-first Progressive Web App for AI-powered rice leaf nutrient deficiency detection and fertilizer recommendations. Built for Filipino rice farmers and agricultural extension workers.

## Overview

AgriPulse uses computer vision and machine learning to analyze rice leaf images and identify nutrient deficiencies and diseases. The app provides actionable treatment recommendations, fertilizer rates, and recovery tips in English, Filipino, and Cebuano.

### Detected Conditions

| Category | Description |
|---|---|
| Healthy | No deficiency or disease detected |
| Nitrogen Deficiency | Yellowing of older leaves, stunted growth |
| Phosphorus Deficiency | Dark green to purplish leaves, delayed tillering |
| Potassium Deficiency | Brown scorching on leaf edges, weak stems |
| Brown Spot | Fungal disease (Cochliobolus miyabeanus) |
| Rice Blast | Fungal disease (Magnaporthe grisea) |
| Bacterial Leaf Blight | Bacterial disease (Xanthomonas oryzae) |
| Rice Leaf Diseases | General disease classification |

## How the AI Works

AgriPulse uses a dual-classifier architecture with automatic fallback:

### Primary: MobileNetV2 CNN (Backend)

- **Architecture:** MobileNetV2 pre-trained on ImageNet with custom classification head
- **Input:** 224x224 RGB image
- **Training:** Transfer learning in two phases:
  - Phase 1: Train classification head with frozen base (20 epochs, lr=1e-3)
  - Phase 2: Fine-tune top layers with low learning rate (15 epochs, lr=1e-5)
- **Data Augmentation:** Rotation, shift, shear, zoom, flip, brightness variation
- **Dataset:** Rice leaf disease dataset from Kaggle (`uynguyenthai/rice-leaf-disease-final-dataset`)
- **Split:** 70% train / 15% validation / 15% test
- **Output:** Prediction class, confidence score (60-99%), top-3 alternatives
- **Framework:** TensorFlow/Keras with `mobilenet_v2.preprocess_input` normalization

### Fallback: Legacy KNN Classifier (Backend)

- **Features:** 103-dimensional vector (32-bin HSV histograms x 3 channels + edge density + 6 color statistics)
- **Algorithm:** K-Nearest Neighbors (k=3, distance-weighted)
- **Preprocessing:** StandardScaler normalization
- **Used when:** MobileNetV2 model file is unavailable

### Client-Side Offline AI (Frontend)

When the backend is unreachable, the app runs a JavaScript-based ensemble classifier entirely in the browser:

1. **KNN Classifier:** Uses pre-computed reference features (`reference_features.json`) with distance-weighted voting (k=5)
2. **Rule-Based Classifier:** Pixel-level analysis of HSV color distributions to detect disease patterns (brown spots, gray lesions, yellowing, etc.)
3. **Color Voting Classifier:** HSV color distance voting against reference category colors
4. **Ensemble:** Weighted combination (45% KNN + 45% Rules + 10% Color Voting) with agreement bonus

### Live Camera Analysis

The Scan page provides real-time analysis every 800ms from the device camera:
- Frame deduplication via content hashing
- Fast feature extraction (downsampled to 160x160, ~3000 pixels)
- Spot detection using connected-component labeling (Union-Find)
- Health score calculation based on green ratio, disease pixels, and spot count
- Leaf color analysis with dominant hue detection

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite 5 | Build tool and dev server |
| Tailwind CSS 3 | Utility-first styling |
| Framer Motion | Page transitions and animations |
| Lucide React | Icon library |
| React Router 6 | Client-side routing |
| React Hook Form + Zod | Form validation |
| TanStack React Query | Server state management |
| Zustand | Client state management |
| Dexie (IndexedDB) | Offline local database |
| Capacitor 8 | Native Android wrapper |

### Backend

| Technology | Purpose |
|---|---|
| Python 3 | Runtime |
| FastAPI | REST API framework |
| Uvicorn | ASGI server |
| TensorFlow/Keras | MobileNetV2 CNN inference |
| OpenCV (headless) | Image preprocessing |
| NumPy | Numerical operations |
| Pillow | Image decoding |
| scikit-learn | KNN classifier (legacy fallback) |
| kagglehub | Dataset downloading |

### Infrastructure

| Technology | Purpose |
|---|---|
| Supabase | Auth, database sync, file storage |
| Vercel | Frontend hosting and deployment |
| IndexedDB (Dexie) | Offline-first local storage |
| Capacitor Android | Native mobile builds |

## Project Structure

```
AgriPulse/
├── backend/
│   ├── main.py                  # FastAPI server with /api/analyze endpoint
│   ├── classifier.py            # MobileNetV2 + KNN classifier classes
│   ├── train_model.py           # Transfer learning training pipeline
│   ├── download_dataset.py      # Kaggle dataset downloader
│   ├── extract_features.py      # Feature extraction utilities
│   ├── regenerate_features.py   # Reference feature regeneration
│   ├── reference_features.json  # Pre-computed features for offline KNN
│   ├── requirements.txt         # Python dependencies
│   ├── models/                  # Saved .keras model files
│   └── data/                    # Training datasets (Kaggle)
├── src/
│   ├── main.tsx                 # App entry point
│   ├── App.tsx                  # Root component with providers
│   ├── pages/
│   │   ├── SplashPage.tsx       # App splash screen
│   │   ├── LoginPage.tsx        # Email/password auth
│   │   ├── ForgotPasswordPage.tsx
│   │   ├── ResetPasswordPage.tsx
│   │   ├── HomePage.tsx         # Dashboard with stats and recent scans
│   │   ├── ScanPage.tsx         # Camera capture and AI analysis
│   │   ├── HistoryPage.tsx      # Past scan records
│   │   ├── ReportsPage.tsx      # Scan reports and summaries
│   │   └── SettingsPage.tsx     # App preferences
│   ├── components/
│   │   ├── CameraCard.tsx       # Camera feed with live analysis overlay
│   │   ├── ScannerOverlay.tsx   # AR-style scanning frame
│   │   ├── AnimatedCard.tsx     # Animated container
│   │   ├── BottomNavigation.tsx # Tab navigation
│   │   ├── TrainingContributionPrompt.tsx  # Crowdsourced training
│   │   └── ...                  # UI components
│   ├── services/
│   │   ├── aiService.ts         # AI analysis orchestrator (backend → fallback)
│   │   ├── mockAiService.ts     # Client-side ensemble classifier
│   │   ├── authService.ts       # Supabase auth
│   │   ├── syncService.ts       # Cloud sync logic
│   │   ├── tipsService.ts       # Recovery tips (online/offline)
│   │   ├── imageService.ts      # Image compression and thumbnails
│   │   └── updateService.ts     # App update checker
│   ├── store/
│   │   ├── appStore.ts          # Global app state (Zustand)
│   │   └── scanStore.ts         # Scan history state
│   ├── hooks/
│   │   ├── useConnectionStatus.ts  # Online/offline detection
│   │   ├── useSync.ts           # Auto-sync on reconnect
│   │   ├── useTheme.ts          # Light/dark/system theme
│   │   └── useUpdateChecker.ts  # Version update prompts
│   ├── offline/
│   │   └── database.ts          # Dexie IndexedDB schema
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   ├── config/
│   │   ├── version.ts           # App version constant
│   │   └── changelog.ts         # What's new entries
│   ├── routes/
│   │   └── AppRoutes.tsx        # Route definitions
│   ├── layouts/
│   │   ├── PhoneShell.tsx       # Mobile frame wrapper
│   │   └── MainLayout.tsx       # Authenticated layout
│   └── supabase/
│       ├── client.ts            # Supabase client init
│       └── schema.sql           # Database schema
├── capacitor.config.ts          # Capacitor Android config
├── vite.config.js               # Vite build config
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript config
├── vercel.json                  # Vercel deployment config
└── package.json                 # Node.js dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+
- npm or yarn
- pip (Python package manager)

### Frontend Setup

```bash
npm install
npm run dev
```

The dev server runs at `http://127.0.0.1:5173`.

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python train_model.py    # Downloads dataset and trains model
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The API runs at `http://127.0.0.1:8000`.

### Android Build

```bash
npm run build
npx cap sync android
npx cap open android
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check with active model info |
| GET | `/api/categories` | List all classification categories |
| GET | `/api/model-info` | Model version, accuracy, class names |
| GET | `/api/tips?prediction=X&lang=en` | Recovery tips in English/Filipino/Cebuano |
| POST | `/api/analyze` | Upload image, get prediction + confidence |
| POST | `/api/submit-training` | Submit labeled image for future retraining |

## Supabase Schema

The app uses four tables:

- **users** — User accounts (id, name, email)
- **scans** — Scan history records with prediction, confidence, image, sync status
- **settings** — Per-user preferences (theme, language, notifications, cloud backup)
- **training_images** — Crowdsourced labeled images for model improvement
- **model_versions** — Model version tracking with accuracy metrics

Storage buckets: `scan-images`, `training-images`

## Key Features

- **Offline-first:** All scans stored in IndexedDB; works without internet
- **Auto-sync:** Queued uploads when connection is restored
- **Multi-language:** English, Filipino (Tagalog), Cebuano recovery tips
- **Dark mode:** System-aware light/dark theme
- **Live camera analysis:** Real-time disease detection viewfinder
- **Crowdsourced training:** Users can submit corrected labels to improve the model
- **Low-confidence warnings:** Prompts for better image capture when confidence < 70%
- **PWA-ready:** Installable on Android as a native app via Capacitor

## Scripts

```bash
npm run dev          # Start Vite dev server
npm run build        # TypeScript compile + Vite build
npm run preview      # Preview production build
npm run lint         # ESLint check
npm run dev:backend  # Start FastAPI backend with auto-reload
```

## Environment Variables

Copy `.env.example` to `.env.local`:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## License

Private project — see repository for license details.

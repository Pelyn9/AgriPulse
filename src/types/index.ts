export type PredictionType =
  | 'Healthy'
  | 'Nitrogen Deficiency'
  | 'Phosphorus Deficiency'
  | 'Potassium Deficiency'
  | 'Rice Leaf Diseases'
  | 'Brown Spot'
  | 'Rice Blast'
  | 'Bacterial Leaf Blight';

export type ScanMode = 'Online' | 'Offline';

export type ThemePreference = 'light' | 'dark' | 'system';

export type SyncStatus = 'idle' | 'uploading' | 'complete' | 'error';

export interface AiResult {
  prediction: string;
  confidence: number;
  symptoms: string[];
  fertilizer: string;
  applicationRate: string;
  summary: string;
  recoveryTips: string[];
  description: string;
  causes: string[];
  treatment: string;
  prevention: string[];
  alternatives?: { prediction: string; confidence: number }[];
  model?: string;
}

export interface ScanRecord extends AiResult {
  id: string;
  image: string;
  mode: ScanMode;
  synced: boolean;
  createdAt: string;
  userId?: string;
}

export interface AppSettings {
  theme: ThemePreference;
  language: string;
  notifications: boolean;
  cloudBackup: boolean;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  provider: 'email' | 'mock';
}

export interface SyncProgress {
  status: SyncStatus;
  uploaded: number;
  total: number;
  message?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  tone?: 'success' | 'warning' | 'info' | 'error';
}

import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { HistoryPage } from '../pages/HistoryPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { ReportsPage } from '../pages/ReportsPage';
import { ScanPage } from '../pages/ScanPage';
import { SettingsPage } from '../pages/SettingsPage';
import { SplashPage } from '../pages/SplashPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<MainLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

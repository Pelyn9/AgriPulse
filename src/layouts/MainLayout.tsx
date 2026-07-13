import { Outlet } from 'react-router-dom';
import { BottomNavigation } from '../components/BottomNavigation';

export function MainLayout() {
  return (
    <div className="relative safe-top flex flex-1 flex-col min-h-0 overflow-hidden">
      <main className="flex-1 overflow-y-auto scrollbar-hide px-5 pt-4 pb-24" style={{ paddingBottom: 'calc(4.5rem + max(0.5rem, env(safe-area-inset-bottom)))' }}>
        <Outlet />
      </main>
      <div className="absolute bottom-0 left-0 right-0 z-50 safe-bottom bg-field-50 dark:bg-[#07140e]">
        <BottomNavigation />
      </div>
    </div>
  );
}

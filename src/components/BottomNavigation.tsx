import { BarChart3, History, Home, ScanLine, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../utils/cn';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

const items: NavItem[] = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/scan', label: 'Scan', icon: ScanLine },
  { to: '/history', label: 'History', icon: History },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function BottomNavigation() {
  return (
    <nav className="px-3">
      <div className="glass-panel grid grid-cols-5 rounded-2xl p-1 shadow-glass">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-sm font-bold transition',
                isActive
                  ? 'bg-field-700 text-white shadow-lg shadow-field-900/20 dark:bg-field-400 dark:text-field-950'
                  : 'text-slate-500 hover:bg-white/70 hover:text-field-800 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-field-100',
              )
            }
          >
            <item.icon className="h-7 w-7" strokeWidth={2.4} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

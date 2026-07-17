export interface ChangelogEntry {
  version: string;
  date: string;
  sections: {
    title: string;
    items: string[];
  }[];
}

export const changelog: ChangelogEntry[] = [
  {
    version: '16.0.2',
    date: 'July 17, 2026',
    sections: [
      {
        title: 'Improved',
        items: [
          'Reports pie chart redesigned as interactive donut chart with tooltips and percentages',
          'Reports bar chart now uses Recharts with value labels, sorted months, and interactive tooltips',
          'Export section redesigned — CSV, Excel (.xlsx), and PDF with proper file generation',
          'Excel export now includes all scan fields (symptoms, causes, treatment, prevention, recovery tips)',
          'PDF export generates a styled landscape document with table formatting',
          'Export buttons removed from History page — exports are now Reports-only',
        ],
      },
      {
        title: 'Fixed',
        items: [
          'Internet detection now uses real fetch check instead of relying only on Capacitor Network plugin',
          'Login page no longer falsely shows "No internet" when connection is available',
          'Connectivity status rechecks every 8 seconds for accurate real-time detection',
          'App starts optimistic (online) to prevent false offline flash on load',
        ],
      },
    ],
  },
  {
    version: '16.0.1',
    date: 'July 17, 2026',
    sections: [
      {
        title: 'Added',
        items: [
          'Login button in Settings for offline users to sign in and sync data',
          'Cloud backup toggle now redirects to login when in offline mode',
          'Full cloud sync — local scans upload to your account and cloud scans download back to device',
          'Images are now restored from cloud when logging in on a new device',
        ],
      },
      {
        title: 'Improved',
        items: [
          'Clear local data now preserves cloud-synced scans when cloud backup is enabled',
          'Sync toast shows how many scans were restored from cloud after login',
          'Cloud backup hint text updates based on login status',
          'Update dialog now shows notification reminder at 100% and a Restart App button after install',
        ],
      },
      {
        title: 'Fixed',
        items: [
          'Cloud images now properly download from Supabase Storage instead of showing empty',
          'Offline users can no longer accidentally toggle cloud backup without logging in first',
        ],
      },
    ],
  },
  {
    version: '15.0.2',
    date: 'July 14, 2026',
    sections: [
      {
        title: 'Added',
        items: [
          'In-app update now auto-restarts the app after install',
        ],
      },
      {
        title: 'Fixed',
        items: [
          'Update dialog progress now shows "Installing..." at 100% instead of staying stuck on "Downloading..."',
          'Update dialog backdrop now properly blurs over the navbar',
        ],
      },
    ],
  },
  {
    version: '15.0.1',
    date: 'July 14, 2026',
    sections: [
      {
        title: 'Added',
        items: [
          'What\'s New changelog dialog — shows once on update, re-readable from Settings',
        ],
      },
      {
        title: 'Improved',
        items: [
          'Reports pie chart now shows all 8 disease categories',
          'Monthly Scans bar chart hides when there is no data',
          'What\'s New dialog positioned lower for easy thumb reach',
          'Backdrop blur now covers full screen properly',
        ],
      },
    ],
  },
  {
    version: '15.0.0',
    date: 'July 14, 2026',
    sections: [
      {
        title: 'Added',
        items: [
          'Login & register with email via Supabase',
          'Forgot password & reset password flow',
          'Offline mode with "Continue Offline" option',
          'Cloud backup toggle in Settings',
          'In-app APK update checker from GitHub releases',
          'What\'s New changelog dialog on updates',
        ],
      },
      {
        title: 'Improved',
        items: [
          'Reports pie chart now shows all 8 disease categories',
          'Dashboard displays all disease categories with progress bars',
          'Email field remembers your last login',
          'Logout navigates cleanly back to login screen',
          'Service worker uses versioned cache for reliable updates',
        ],
      },
      {
        title: 'Fixed',
        items: [
          'Sync complete dialog no longer loops on empty data',
          'Splash screen correctly routes based on saved session',
        ],
      },
    ],
  },
];

export const LATEST_VERSION = changelog[0].version;

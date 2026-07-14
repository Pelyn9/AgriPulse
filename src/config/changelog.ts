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

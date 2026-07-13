import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        field: {
          50: '#f0fdf5',
          100: '#dcfce8',
          200: '#bbf7cf',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        harvest: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        soil: {
          100: '#ede5d6',
          300: '#b89f7a',
          500: '#795c3c',
          700: '#49331f',
        },
      },
      boxShadow: {
        soft: '0 18px 40px -24px rgba(12, 74, 39, 0.45)',
        glass: '0 20px 60px -28px rgba(4, 47, 24, 0.55)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        leafFloat: {
          '0%, 100%': {
            transform: 'translateY(0) rotate(-4deg)',
          },
          '50%': {
            transform: 'translateY(-10px) rotate(4deg)',
          },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
        leafFloat: 'leafFloat 2.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;

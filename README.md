# RiceLeaf AI

Mobile-first React + Vite PWA prototype for AI-powered rice leaf nutrient deficiency detection and fertilizer recommendations.

## Stack

- React, TypeScript, Vite, Tailwind CSS
- Framer Motion, Lucide React, React Router
- React Hook Form, React Query, Zustand
- Dexie IndexedDB offline storage
- Supabase-ready auth, database sync, and storage upload boundaries

## Scripts

```bash
npm run dev
npm run build
npm run lint
```

## Supabase

Copy `.env.example` to `.env.local` and add your Supabase URL and anon key. The SQL contract lives in `src/supabase/schema.sql`.

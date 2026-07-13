import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
export const scanImageBucket = (import.meta.env.VITE_SUPABASE_SCAN_BUCKET as string | undefined) ?? 'scan-images';
export const trainingImageBucket = (import.meta.env.VITE_SUPABASE_TRAINING_BUCKET as string | undefined) ?? 'training-images';

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

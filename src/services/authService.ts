import { supabase } from '../supabase/client';
import type { UserSession } from '../types';
import { createId } from '../utils/id';

interface Credentials {
  email: string;
  password: string;
}

function createMockUser(email: string): UserSession {
  const name = email.split('@')[0]?.replace(/[._-]/g, ' ') || 'Rice Grower';

  return {
    id: createId('user'),
    name: name.replace(/\b\w/g, (letter) => letter.toUpperCase()),
    email,
    provider: 'mock',
  };
}

export async function loginWithEmail({ email, password }: Credentials): Promise<UserSession> {
  if (!supabase) {
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    return createMockUser(email);
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw error;
  }

  return {
    id: data.user.id,
    name: data.user.user_metadata.name ?? data.user.email?.split('@')[0] ?? 'Rice Grower',
    email: data.user.email ?? email,
    provider: 'email',
  };
}

export async function registerWithEmail({ email, password }: Credentials): Promise<UserSession> {
  if (!supabase) {
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    return createMockUser(email);
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    throw error;
  }

  return {
    id: data.user?.id ?? createId('user'),
    name: email.split('@')[0] ?? 'Rice Grower',
    email,
    provider: 'email',
  };
}

export async function loginWithGooglePlaceholder(): Promise<UserSession> {
  await new Promise((resolve) => window.setTimeout(resolve, 650));

  return {
    id: createId('google'),
    name: 'Google User',
    email: 'google.user@example.com',
    provider: 'google',
  };
}

export async function logout() {
  if (supabase) {
    await supabase.auth.signOut();
  }
}

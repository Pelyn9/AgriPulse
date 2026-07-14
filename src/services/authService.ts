import { supabase } from '../supabase/client';
import type { UserSession } from '../types';
import { createId } from '../utils/id';

interface Credentials {
  email: string;
  password: string;
  name?: string;
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

export async function registerWithEmail({ email, password, name }: Credentials): Promise<UserSession> {
  if (!supabase) {
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    return createMockUser(email);
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name: name || email.split('@')[0] } },
  });

  if (error) {
    throw error;
  }

  return {
    id: data.user?.id ?? createId('user'),
    name: data.user?.user_metadata.name ?? name ?? email.split('@')[0] ?? 'Rice Grower',
    email,
    provider: 'email',
  };
}

export async function resetPassword(email: string): Promise<void> {
  if (!supabase) {
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    return;
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    throw error;
  }
}

export async function updatePassword(newPassword: string): Promise<void> {
  if (!supabase) {
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    return;
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    throw error;
  }
}

export async function logout() {
  if (supabase) {
    await supabase.auth.signOut();
  }
}

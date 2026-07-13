create table if not exists public.users (
  id uuid primary key,
  name text,
  email text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists public.scans (
  id text primary key,
  user_id uuid references public.users(id) on delete cascade,
  image text not null,
  prediction text not null,
  confidence integer not null,
  fertilizer text not null,
  application_rate text not null,
  symptoms text[] not null default '{}',
  mode text not null check (mode in ('Offline', 'Online')),
  synced boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  user_id uuid primary key references public.users(id) on delete cascade,
  theme text not null default 'system',
  language text not null default 'English',
  notifications boolean not null default true,
  cloud_backup boolean not null default false
);

create table if not exists public.training_images (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  image text not null,
  actual_label text not null,
  predicted_label text not null,
  confidence integer not null,
  used_in_training boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.model_versions (
  id serial primary key,
  version text not null,
  accuracy numeric,
  trained_at timestamptz not null default now(),
  training_samples integer,
  is_active boolean not null default false,
  notes text
);

insert into storage.buckets (id, name, public)
values ('scan-images', 'scan-images', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('training-images', 'training-images', false)
on conflict (id) do nothing;

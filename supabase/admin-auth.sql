-- ============================================================
-- Admin Authentication System
-- ============================================================

-- Admin Profiles Table
create table if not exists public.admin_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin', 'super_admin', 'editor')),
  full_name text,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now()),
  unique(user_id)
);

-- Index for fast lookups
create index if not exists idx_admin_profiles_user_id on public.admin_profiles (user_id);

-- RLS
alter table public.admin_profiles enable row level security;

-- Only authenticated users can read their own profile
create policy "Admins can read own profile" on public.admin_profiles
  for select
  using (auth.uid() = user_id);

-- ============================================================
-- Audit Log Table
-- ============================================================

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.admin_profiles(id),
  action text not null,
  table_name text,
  record_id text,
  old_data jsonb,
  new_data jsonb,
  ip_address text,
  created_at timestamptz default timezone('utc', now())
);

create index if not exists idx_audit_logs_admin_id on public.audit_logs (admin_id);
create index if not exists idx_audit_logs_table_name on public.audit_logs (table_name);
create index if not exists idx_audit_logs_created_at on public.audit_logs (created_at desc);

alter table public.audit_logs enable row level security;

-- ============================================================
-- Storage Bucket for Images
-- ============================================================

-- Create bucket if not exists (run in Supabase Dashboard > Storage)
-- insert into storage.buckets (id, name, public) values ('zenta-images', 'zenta-images', true);

-- RLS for storage
create policy "Public read access"
  on storage.objects for select
  using ( bucket_id = 'zenta-images' );

create policy "Authenticated users can upload"
  on storage.objects for insert
  with check ( bucket_id = 'zenta-images' and auth.role() = 'authenticated' );

create policy "Authenticated users can update own files"
  on storage.objects for update
  using ( bucket_id = 'zenta-images' and auth.role() = 'authenticated' );

create policy "Authenticated users can delete own files"
  on storage.objects for delete
  using ( bucket_id = 'zenta-images' and auth.role() = 'authenticated' );

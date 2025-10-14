-- ============================================================
-- Quick Contacts Table (빠른 문의)
-- ============================================================
create table if not exists public.quick_contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  consultation_type text not null,
  message text,
  status text default 'pending' check (status in ('pending', 'contacted', 'completed', 'cancelled')),
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create index if not exists idx_quick_contacts_created_at on public.quick_contacts (created_at desc);
create index if not exists idx_quick_contacts_status on public.quick_contacts (status);
create index if not exists idx_quick_contacts_phone on public.quick_contacts (phone);

-- ============================================================
-- Consultations Table (AI 상담 세션)
-- ============================================================
create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  visitor_name text not null,
  visitor_email text not null,
  visitor_phone text not null,
  legal_issue text not null,
  status text default 'active' check (status in ('active', 'pending', 'assigned', 'in_progress', 'completed', 'cancelled')),
  assigned_lawyer_id uuid references public.lawyers(id),
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create index if not exists idx_consultations_created_at on public.consultations (created_at desc);
create index if not exists idx_consultations_status on public.consultations (status);
create index if not exists idx_consultations_email on public.consultations (visitor_email);
create index if not exists idx_consultations_lawyer on public.consultations (assigned_lawyer_id);

-- ============================================================
-- Chat Messages Table (AI 상담 메시지)
-- ============================================================
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  consultation_id uuid not null references public.consultations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz default timezone('utc', now())
);

create index if not exists idx_chat_messages_consultation on public.chat_messages (consultation_id);
create index if not exists idx_chat_messages_created_at on public.chat_messages (created_at asc);

-- ============================================================
-- RLS 정책
-- ============================================================
alter table public.quick_contacts enable row level security;
alter table public.consultations enable row level security;
alter table public.chat_messages enable row level security;

-- 기존 정책 삭제
drop policy if exists "Allow public insert on quick_contacts" on public.quick_contacts;
drop policy if exists "Allow public all on consultations" on public.consultations;
drop policy if exists "Allow public all on chat_messages" on public.chat_messages;

-- 새 정책 생성
create policy "Allow public insert on quick_contacts" on public.quick_contacts for insert with check (true);
create policy "Allow public all on consultations" on public.consultations for all using (true) with check (true);
create policy "Allow public all on chat_messages" on public.chat_messages for all using (true) with check (true);

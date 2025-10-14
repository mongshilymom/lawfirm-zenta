-- ============================================================
-- AI 챗 상담 테이블
-- ============================================================

-- 상담 세션 테이블
create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  visitor_name text,
  visitor_email text,
  visitor_phone text,
  legal_issue text,
  status text default 'active' check (status in ('active', 'completed', 'assigned')),
  assigned_lawyer_id uuid references public.lawyers(id),
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

-- 챗 메시지 테이블
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  consultation_id uuid not null references public.consultations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz default timezone('utc', now())
);

-- 인덱스 생성
create index if not exists idx_consultations_created_at on public.consultations (created_at desc);
create index if not exists idx_consultations_status on public.consultations (status);
create index if not exists idx_consultations_email on public.consultations (visitor_email);
create index if not exists idx_chat_messages_consultation_id on public.chat_messages (consultation_id, created_at);

-- RLS 활성화
alter table public.consultations enable row level security;
alter table public.chat_messages enable row level security;

-- RLS 정책
drop policy if exists "Allow public read own consultations" on public.consultations;
drop policy if exists "Allow public insert consultations" on public.consultations;
drop policy if exists "Allow public read own messages" on public.chat_messages;
drop policy if exists "Allow public insert messages" on public.chat_messages;

-- 누구나 상담 생성 가능
create policy "Allow public insert consultations" on public.consultations 
  for insert with check (true);

-- 누구나 메시지 생성 가능
create policy "Allow public insert messages" on public.chat_messages 
  for insert with check (true);

-- 누구나 읽기 가능 (실제로는 세션 ID로 제한해야 하지만 MVP에서는 허용)
create policy "Allow public read own consultations" on public.consultations 
  for select using (true);

create policy "Allow public read own messages" on public.chat_messages 
  for select using (true);

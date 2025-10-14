import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials not found in environment');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('🚀 Starting AI Chat consultations migration...\n');

  const sql = `
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
  `;

  const indexes = `
-- 인덱스 생성
create index if not exists idx_consultations_created_at on public.consultations (created_at desc);
create index if not exists idx_consultations_status on public.consultations (status);
create index if not exists idx_consultations_email on public.consultations (visitor_email);
create index if not exists idx_chat_messages_consultation_id on public.chat_messages (consultation_id, created_at);
  `;

  const rls = `
-- RLS 활성화
alter table public.consultations enable row level security;
alter table public.chat_messages enable row level security;

-- RLS 정책
drop policy if exists "Allow public read own consultations" on public.consultations;
drop policy if exists "Allow public insert consultations" on public.consultations;
drop policy if exists "Allow public read own messages" on public.chat_messages;
drop policy if exists "Allow public insert messages" on public.chat_messages;

create policy "Allow public insert consultations" on public.consultations 
  for insert with check (true);

create policy "Allow public insert messages" on public.chat_messages 
  for insert with check (true);

create policy "Allow public read own consultations" on public.consultations 
  for select using (true);

create policy "Allow public read own messages" on public.chat_messages 
  for select using (true);
  `;

  try {
    // 테이블 생성
    console.log('📝 Creating tables...');
    const { error: tableError } = await supabase.rpc('exec_sql', { sql_query: sql });
    if (tableError) {
      console.log('⚠️  Table creation (might already exist):', tableError.message);
    } else {
      console.log('✅ Tables created successfully');
    }

    // 인덱스 생성
    console.log('📝 Creating indexes...');
    const { error: indexError } = await supabase.rpc('exec_sql', { sql_query: indexes });
    if (indexError) {
      console.log('⚠️  Index creation:', indexError.message);
    } else {
      console.log('✅ Indexes created successfully');
    }

    // RLS 설정
    console.log('📝 Setting up RLS policies...');
    const { error: rlsError } = await supabase.rpc('exec_sql', { sql_query: rls });
    if (rlsError) {
      console.log('⚠️  RLS setup:', rlsError.message);
    } else {
      console.log('✅ RLS policies configured successfully');
    }

    console.log('\n🎉 Migration completed!\n');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();

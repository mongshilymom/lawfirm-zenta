-- ============================================================
-- Template Law Firm Zenta - Database Schema (Fixed)
-- ============================================================

create extension if not exists pg_trgm with schema public;
create extension if not exists vector with schema public;

-- ============================================================
-- Lawyers Table (500+ 변호사 디렉토리)
-- ============================================================
create table if not exists public.lawyers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null check (role in ('Partner', 'Associate')),
  practice_areas text[] not null,
  experience_years int not null check (experience_years >= 0),
  bio text,
  headshot_url text,
  is_active boolean default true,
  created_at timestamptz default timezone('utc', now())
);

-- 검색 최적화 인덱스
create index if not exists idx_lawyers_name_trgm on public.lawyers using gin (name gin_trgm_ops);
create index if not exists idx_lawyers_practice_areas on public.lawyers using gin (practice_areas);
create index if not exists idx_lawyers_experience_years on public.lawyers (experience_years);
create index if not exists idx_lawyers_is_active on public.lawyers (is_active);

-- ============================================================
-- Case Studies Table (성공 사례)
-- ============================================================
create table if not exists public.case_studies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  practices text[] not null,
  impact_metric text,
  published_at timestamptz default timezone('utc', now())
);

create index if not exists idx_case_studies_practices on public.case_studies using gin (practices);
create index if not exists idx_case_studies_published_at on public.case_studies (published_at desc);

-- ============================================================
-- News Articles Table (뉴스/아티클)
-- ============================================================
create table if not exists public.news_articles (
  id uuid primary key default gen_random_uuid(),
  headline text not null,
  slug text unique,
  body text,
  published_at timestamptz default timezone('utc', now()),
  source_url text,
  author text
);

create index if not exists idx_news_articles_published_at on public.news_articles (published_at desc);
create index if not exists idx_news_articles_slug on public.news_articles (slug);

-- ============================================================
-- Insights Table (법률 인사이트/동향)
-- ============================================================
create table if not exists public.insights (
  id bigserial primary key,
  title text not null,
  body text,
  source_url text,
  published_at timestamptz default timezone('utc', now())
);

create index if not exists idx_insights_published_at on public.insights (published_at desc);

-- ============================================================
-- FAQs Table (자주 묻는 질문)
-- ============================================================
create table if not exists public.faqs (
  id bigserial primary key,
  question text not null,
  answer text,
  related_practice text
);

-- ============================================================
-- Automation Failures Table (자동화 실패 로그)
-- ============================================================
create table if not exists public.automation_failures (
  id bigserial primary key,
  source text not null,
  payload jsonb,
  error text,
  created_at timestamptz default timezone('utc', now())
);

create index if not exists idx_automation_failures_created_at on public.automation_failures (created_at desc);

-- ============================================================
-- Lead Intake Table (상담 신청)
-- ============================================================
create table if not exists public.lead_intake (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  company text,
  phone text,
  message text,
  source text default 'web',
  created_at timestamptz default timezone('utc', now())
);

create index if not exists idx_lead_intake_created_at on public.lead_intake (created_at desc);
create index if not exists idx_lead_intake_email on public.lead_intake (email);

-- ============================================================
-- FAQ Embeddings Table (AI 검색용 벡터)
-- ============================================================
create table if not exists public.faq_embeddings (
  faq_id bigint references public.faqs(id) on delete cascade,
  embedding vector(1536),
  constraint faq_embeddings_pkey primary key (faq_id)
);

-- ============================================================
-- Row Level Security (RLS) 활성화
-- ============================================================
alter table public.lawyers enable row level security;
alter table public.case_studies enable row level security;
alter table public.news_articles enable row level security;
alter table public.insights enable row level security;
alter table public.faqs enable row level security;
alter table public.lead_intake enable row level security;

-- ============================================================
-- RLS 정책 (기존 정책 삭제 후 재생성)
-- ============================================================

-- 기존 정책 삭제
drop policy if exists "Allow public read access on lawyers" on public.lawyers;
drop policy if exists "Allow public read access on case_studies" on public.case_studies;
drop policy if exists "Allow public read access on news_articles" on public.news_articles;
drop policy if exists "Allow public read access on insights" on public.insights;
drop policy if exists "Allow public read access on faqs" on public.faqs;
drop policy if exists "Allow public insert on lead_intake" on public.lead_intake;

-- 읽기 정책 (모두 허용)
create policy "Allow public read access on lawyers" on public.lawyers for select using (true);
create policy "Allow public read access on case_studies" on public.case_studies for select using (true);
create policy "Allow public read access on news_articles" on public.news_articles for select using (true);
create policy "Allow public read access on insights" on public.insights for select using (true);
create policy "Allow public read access on faqs" on public.faqs for select using (true);

-- 상담 신청은 누구나 생성 가능
create policy "Allow public insert on lead_intake" on public.lead_intake for insert with check (true);

-- ============================================================
-- 완료!
-- ============================================================

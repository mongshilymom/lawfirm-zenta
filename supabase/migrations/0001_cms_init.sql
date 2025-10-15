-- ============================================================
-- CMS System - Initial Migration
-- ============================================================
-- Author: Claude Sonnet 4.5
-- Date: 2025-10-15
-- Purpose: Add full CMS capabilities to existing law firm template

-- ============================================================
-- 1) ADMIN PROFILES & AUTHORIZATION
-- ============================================================

-- Admin profiles table (관리자 권한 관리)
create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin', 'editor', 'viewer')),
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

-- Admin check function (RLS에서 사용)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 
    from public.admin_profiles 
    where user_id = auth.uid()
  );
$$;

-- ============================================================
-- 2) ENUMS & TYPES
-- ============================================================

do $$ 
begin
  create type public.post_status as enum ('draft', 'published');
exception 
  when duplicate_object then null;
end $$;

-- ============================================================
-- 3) POSTS TABLE (블로그/아티클)
-- ============================================================

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content jsonb not null default '{}'::jsonb, -- Markdown content
  cover_image text,
  status public.post_status not null default 'draft',
  published_at timestamptz,
  author_id uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now()),
  
  -- 검색 최적화
  search_vector tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(excerpt, '')), 'B')
  ) stored
);

-- Indexes
create index if not exists idx_posts_slug on public.posts (slug);
create index if not exists idx_posts_status on public.posts (status);
create index if not exists idx_posts_published_at on public.posts (published_at desc) where status = 'published';
create index if not exists idx_posts_search on public.posts using gin (search_vector);
create index if not exists idx_posts_author on public.posts (author_id);

-- ============================================================
-- 4) CATEGORIES TABLE
-- ============================================================

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamptz default timezone('utc', now())
);

create index if not exists idx_categories_slug on public.categories (slug);

-- ============================================================
-- 5) POST-CATEGORY JUNCTION TABLE
-- ============================================================

create table if not exists public.post_categories (
  post_id uuid references public.posts(id) on delete cascade,
  category_id uuid references public.categories(id) on delete cascade,
  primary key (post_id, category_id)
);

create index if not exists idx_post_categories_post on public.post_categories (post_id);
create index if not exists idx_post_categories_category on public.post_categories (category_id);

-- ============================================================
-- 6) IMAGES METADATA TABLE
-- ============================================================

create table if not exists public.images_meta (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  storage_path text not null,
  width int,
  height int,
  bytes int,
  mime text,
  alt_text text,
  uploaded_by uuid references auth.users(id) on delete set null,
  uploaded_at timestamptz default timezone('utc', now())
);

create index if not exists idx_images_uploaded_by on public.images_meta (uploaded_by);
create index if not exists idx_images_uploaded_at on public.images_meta (uploaded_at desc);

-- ============================================================
-- 7) POST REVISIONS TABLE (버전 관리)
-- ============================================================

create table if not exists public.post_revisions (
  id bigserial primary key,
  post_id uuid references public.posts(id) on delete cascade,
  snapshot jsonb not null, -- {title, slug, content, cover_image, status, ...}
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default timezone('utc', now())
);

create index if not exists idx_post_revisions_post on public.post_revisions (post_id, created_at desc);

-- ============================================================
-- 8) AUDIT LOGS TABLE (감사 로그)
-- ============================================================

create table if not exists public.audit_logs (
  id bigserial primary key,
  entity text not null, -- 'post', 'faq', 'category', etc.
  entity_id text not null,
  action text not null, -- 'create', 'update', 'delete', 'publish', 'unpublish'
  changes jsonb, -- Before/after values
  actor_id uuid references auth.users(id) on delete set null,
  actor_email text,
  ip_address inet,
  user_agent text,
  created_at timestamptz default timezone('utc', now())
);

create index if not exists idx_audit_logs_entity on public.audit_logs (entity, entity_id);
create index if not exists idx_audit_logs_actor on public.audit_logs (actor_id);
create index if not exists idx_audit_logs_created on public.audit_logs (created_at desc);

-- ============================================================
-- 9) UPDATE EXISTING FAQS TABLE (기존 테이블 확장)
-- ============================================================

-- Add missing columns to existing FAQs table
do $$ 
begin
  -- Add status column if not exists
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' 
    and table_name = 'faqs' 
    and column_name = 'status'
  ) then
    alter table public.faqs add column status public.post_status default 'published';
  end if;

  -- Add answer_json for rich content
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' 
    and table_name = 'faqs' 
    and column_name = 'answer_json'
  ) then
    alter table public.faqs add column answer_json jsonb;
  end if;

  -- Add sort_order if not exists
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' 
    and table_name = 'faqs' 
    and column_name = 'sort_order'
  ) then
    alter table public.faqs add column sort_order int default 0;
  end if;

  -- Add updated_at if not exists
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' 
    and table_name = 'faqs' 
    and column_name = 'updated_at'
  ) then
    alter table public.faqs add column updated_at timestamptz default timezone('utc', now());
  end if;
end $$;

create index if not exists idx_faqs_status on public.faqs (status);
create index if not exists idx_faqs_sort_order on public.faqs (sort_order);

-- ============================================================
-- 10) ANNOUNCEMENTS TABLE (공지사항)
-- ============================================================

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content jsonb not null,
  status public.post_status not null default 'draft',
  priority int default 0, -- Higher = more important
  expires_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create index if not exists idx_announcements_status on public.announcements (status);
create index if not exists idx_announcements_priority on public.announcements (priority desc);
create index if not exists idx_announcements_expires on public.announcements (expires_at);

-- ============================================================
-- 11) TRIGGERS (자동 업데이트)
-- ============================================================

-- Update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- Apply to all tables with updated_at
create trigger posts_updated_at before update on public.posts
  for each row execute function public.handle_updated_at();

create trigger faqs_updated_at before update on public.faqs
  for each row execute function public.handle_updated_at();

create trigger announcements_updated_at before update on public.announcements
  for each row execute function public.handle_updated_at();

-- ============================================================
-- 12) POST REVISION TRIGGER (자동 버전 저장)
-- ============================================================

create or replace function public.save_post_revision()
returns trigger
language plpgsql
as $$
begin
  -- Save revision only on UPDATE
  if TG_OP = 'UPDATE' then
    insert into public.post_revisions (post_id, snapshot, updated_by)
    values (
      old.id,
      jsonb_build_object(
        'title', old.title,
        'slug', old.slug,
        'excerpt', old.excerpt,
        'content', old.content,
        'cover_image', old.cover_image,
        'status', old.status,
        'published_at', old.published_at
      ),
      new.updated_by
    );
  end if;
  return new;
end;
$$;

create trigger posts_save_revision before update on public.posts
  for each row execute function public.save_post_revision();

-- ============================================================
-- 13) AUDIT LOG TRIGGER
-- ============================================================

create or replace function public.log_audit()
returns trigger
language plpgsql
security definer
as $$
declare
  v_entity text;
  v_entity_id text;
  v_action text;
  v_changes jsonb;
begin
  -- Determine entity type
  v_entity := TG_TABLE_NAME;
  
  -- Determine action
  if TG_OP = 'INSERT' then
    v_action := 'create';
    v_entity_id := new.id::text;
    v_changes := to_jsonb(new);
  elsif TG_OP = 'UPDATE' then
    v_entity_id := new.id::text;
    -- Check if status changed to published
    if TG_TABLE_NAME = 'posts' and old.status = 'draft' and new.status = 'published' then
      v_action := 'publish';
    elsif TG_TABLE_NAME = 'posts' and old.status = 'published' and new.status = 'draft' then
      v_action := 'unpublish';
    else
      v_action := 'update';
    end if;
    v_changes := jsonb_build_object(
      'before', to_jsonb(old),
      'after', to_jsonb(new)
    );
  elsif TG_OP = 'DELETE' then
    v_action := 'delete';
    v_entity_id := old.id::text;
    v_changes := to_jsonb(old);
  end if;

  -- Insert audit log
  insert into public.audit_logs (entity, entity_id, action, changes, actor_id)
  values (v_entity, v_entity_id, v_action, v_changes, auth.uid());

  return coalesce(new, old);
end;
$$;

-- Apply audit triggers to key tables
create trigger posts_audit after insert or update or delete on public.posts
  for each row execute function public.log_audit();

create trigger categories_audit after insert or update or delete on public.categories
  for each row execute function public.log_audit();

create trigger faqs_audit after insert or update or delete on public.faqs
  for each row execute function public.log_audit();

create trigger announcements_audit after insert or update or delete on public.announcements
  for each row execute function public.log_audit();

-- ============================================================
-- Migration Complete
-- ============================================================

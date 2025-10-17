-- ============================================================
-- CMS Tables - ZENTA Law Firm
-- ============================================================

-- Categories Table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  sort_order int default 0,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create index if not exists idx_categories_slug on public.categories (slug);

-- Posts Table (Blog/Insights)
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content jsonb, -- {type: "markdown", value: "..."}
  cover_image text,
  status text default 'draft' check (status in ('draft', 'published', 'archived')),
  author_id uuid,
  published_at timestamptz,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create index if not exists idx_posts_slug on public.posts (slug);
create index if not exists idx_posts_status on public.posts (status);
create index if not exists idx_posts_published_at on public.posts (published_at desc);

-- Post-Categories Junction Table
create table if not exists public.post_categories (
  post_id uuid references public.posts(id) on delete cascade,
  category_id uuid references public.categories(id) on delete cascade,
  primary key (post_id, category_id)
);

-- Announcements Table
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content jsonb, -- {type: "markdown", value: "..."}
  status text default 'draft' check (status in ('draft', 'published', 'archived')),
  priority int default 0,
  expires_at timestamptz,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create index if not exists idx_announcements_status on public.announcements (status);
create index if not exists idx_announcements_priority on public.announcements (priority desc);

-- Images Metadata Table
create table if not exists public.images_meta (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  storage_path text,
  width int,
  height int,
  bytes int,
  mime text,
  alt_text text,
  created_at timestamptz default timezone('utc', now())
);

-- Update FAQs table to add CMS fields
alter table public.faqs add column if not exists status text default 'published' check (status in ('draft', 'published', 'archived'));
alter table public.faqs add column if not exists answer_json jsonb;
alter table public.faqs add column if not exists sort_order int default 0;

-- ============================================================
-- RLS Policies for CMS
-- ============================================================

alter table public.categories enable row level security;
alter table public.posts enable row level security;
alter table public.announcements enable row level security;
alter table public.images_meta enable row level security;

-- Public can read published content
create policy "Public read published categories" on public.categories for select using (true);
create policy "Public read published posts" on public.posts for select using (status = 'published');
create policy "Public read published announcements" on public.announcements for select using (status = 'published');
create policy "Public read images" on public.images_meta for select using (true);

-- Authenticated users (admins) can manage all
create policy "Admins manage categories" on public.categories for all using (auth.role() = 'authenticated');
create policy "Admins manage posts" on public.posts for all using (auth.role() = 'authenticated');
create policy "Admins manage announcements" on public.announcements for all using (auth.role() = 'authenticated');
create policy "Admins manage images" on public.images_meta for all using (auth.role() = 'authenticated');

-- ============================================================
-- Updated Trigger for updated_at
-- ============================================================

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on public.categories
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.posts
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.announcements
  for each row execute function public.handle_updated_at();

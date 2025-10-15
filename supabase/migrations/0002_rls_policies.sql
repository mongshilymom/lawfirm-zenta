-- ============================================================
-- CMS System - Row Level Security (RLS) Policies
-- ============================================================
-- Author: Claude Sonnet 4.5
-- Date: 2025-10-15
-- Purpose: Comprehensive RLS policies for CMS security

-- ============================================================
-- 1) ENABLE RLS ON ALL CMS TABLES
-- ============================================================

alter table public.admin_profiles enable row level security;
alter table public.posts enable row level security;
alter table public.categories enable row level security;
alter table public.post_categories enable row level security;
alter table public.images_meta enable row level security;
alter table public.post_revisions enable row level security;
alter table public.audit_logs enable row level security;
alter table public.announcements enable row level security;

-- FAQs already exists, just enable RLS
alter table public.faqs enable row level security;

-- ============================================================
-- 2) ADMIN PROFILES POLICIES
-- ============================================================

-- Only admins can view admin profiles
create policy "admin_profiles_admin_read" on public.admin_profiles
  for select
  using (is_admin());

-- Only admins can manage admin profiles
create policy "admin_profiles_admin_all" on public.admin_profiles
  for all
  using (is_admin())
  with check (is_admin());

-- ============================================================
-- 3) POSTS POLICIES
-- ============================================================

-- Public can read published posts
create policy "posts_public_read_published" on public.posts
  for select
  using (status = 'published');

-- Admins can do everything
create policy "posts_admin_all" on public.posts
  for all
  using (is_admin())
  with check (is_admin());

-- ============================================================
-- 4) CATEGORIES POLICIES
-- ============================================================

-- Public can read categories
create policy "categories_public_read" on public.categories
  for select
  using (true);

-- Admins can manage categories
create policy "categories_admin_all" on public.categories
  for all
  using (is_admin())
  with check (is_admin());

-- ============================================================
-- 5) POST-CATEGORIES POLICIES
-- ============================================================

-- Public can read post-category relations
create policy "post_categories_public_read" on public.post_categories
  for select
  using (true);

-- Admins can manage relations
create policy "post_categories_admin_all" on public.post_categories
  for all
  using (is_admin())
  with check (is_admin());

-- ============================================================
-- 6) FAQS POLICIES
-- ============================================================

-- Public can read published FAQs
create policy "faqs_public_read_published" on public.faqs
  for select
  using (status = 'published' or status is null); -- null for backward compatibility

-- Admins can manage FAQs
create policy "faqs_admin_all" on public.faqs
  for all
  using (is_admin())
  with check (is_admin());

-- ============================================================
-- 7) IMAGES METADATA POLICIES
-- ============================================================

-- Public can read image metadata (for display)
create policy "images_meta_public_read" on public.images_meta
  for select
  using (true);

-- Admins can manage images
create policy "images_meta_admin_all" on public.images_meta
  for all
  using (is_admin())
  with check (is_admin());

-- ============================================================
-- 8) POST REVISIONS POLICIES
-- ============================================================

-- Only admins can access revisions
create policy "post_revisions_admin_all" on public.post_revisions
  for all
  using (is_admin())
  with check (is_admin());

-- ============================================================
-- 9) AUDIT LOGS POLICIES
-- ============================================================

-- Only admins can read audit logs
create policy "audit_logs_admin_read" on public.audit_logs
  for select
  using (is_admin());

-- System can insert audit logs (trigger)
create policy "audit_logs_system_insert" on public.audit_logs
  for insert
  with check (true);

-- ============================================================
-- 10) ANNOUNCEMENTS POLICIES
-- ============================================================

-- Public can read published announcements
create policy "announcements_public_read" on public.announcements
  for select
  using (
    status = 'published' 
    and (expires_at is null or expires_at > now())
  );

-- Admins can manage announcements
create policy "announcements_admin_all" on public.announcements
  for all
  using (is_admin())
  with check (is_admin());

-- ============================================================
-- 11) STORAGE BUCKET POLICIES (Declarative)
-- ============================================================
-- Note: These need to be applied via Supabase Dashboard or CLI
-- as storage policies use different syntax

-- Bucket: 'images'
-- Path: public/* (publicly accessible)

-- Policy 1: Public read access
-- Name: images_public_read
-- Definition: bucket_id = 'images'
-- Allowed operations: SELECT

-- Policy 2: Admin upload
-- Name: images_admin_upload
-- Definition: bucket_id = 'images' AND is_admin()
-- Allowed operations: INSERT

-- Policy 3: Admin delete
-- Name: images_admin_delete
-- Definition: bucket_id = 'images' AND is_admin()
-- Allowed operations: DELETE

-- Policy 4: Admin update
-- Name: images_admin_update
-- Definition: bucket_id = 'images' AND is_admin()
-- Allowed operations: UPDATE

-- ============================================================
-- 12) HELPER VIEWS (Optional)
-- ============================================================

-- View: Published posts with category names
create or replace view public.posts_published as
select 
  p.*,
  array_agg(c.name) filter (where c.name is not null) as category_names,
  array_agg(c.slug) filter (where c.slug is not null) as category_slugs
from public.posts p
left join public.post_categories pc on p.id = pc.post_id
left join public.categories c on pc.category_id = c.id
where p.status = 'published'
group by p.id;

-- View: Admin dashboard stats
create or replace view public.admin_stats as
select
  (select count(*) from public.posts where status = 'draft') as drafts_count,
  (select count(*) from public.posts where status = 'published') as published_count,
  (select count(*) from public.faqs) as faqs_count,
  (select count(*) from public.categories) as categories_count,
  (select count(*) from public.images_meta) as images_count,
  (select count(*) from public.announcements where status = 'published' and (expires_at is null or expires_at > now())) as active_announcements;

-- Grant select on views (read-only)
grant select on public.posts_published to anon, authenticated;
grant select on public.admin_stats to authenticated;

-- ============================================================
-- RLS Policies Complete
-- ============================================================

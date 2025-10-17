-- ============================================================
-- CMS System - Seed Data
-- ============================================================
-- Author: Claude Sonnet 4.5
-- Date: 2025-10-15
-- Purpose: Initial seed data for CMS testing

-- ============================================================
-- 1) CREATE ADMIN USER (Manual step - via Supabase Dashboard)
-- ============================================================
-- ⚠️ IMPORTANT: You must create an admin user manually via Supabase Dashboard
-- Then add their UUID to admin_profiles table

-- Example (replace with actual user ID):
-- insert into public.admin_profiles (user_id, role)
-- values ('00000000-0000-0000-0000-000000000000', 'admin');

-- ============================================================
-- 2) SEED CATEGORIES
-- ============================================================

insert into public.categories (id, name, slug, description) values
  ('c1111111-1111-1111-1111-111111111111', 'Corporate Law', 'corporate-law', 'Business formation, M&A, corporate governance'),
  ('c2222222-2222-2222-2222-222222222222', 'Litigation', 'litigation', 'Civil and commercial litigation'),
  ('c3333333-3333-3333-3333-333333333333', 'Real Estate', 'real-estate', 'Property transactions and disputes'),
  ('c4444444-4444-4444-4444-444444444444', 'Employment Law', 'employment-law', 'Workplace disputes and compliance'),
  ('c5555555-5555-5555-5555-555555555555', 'Intellectual Property', 'intellectual-property', 'Patents, trademarks, copyrights')
on conflict (id) do nothing;

-- ============================================================
-- 3) SEED SAMPLE POSTS
-- ============================================================

insert into public.posts (
  id,
  title,
  slug,
  excerpt,
  content,
  cover_image,
  status,
  published_at
) values
  (
    'p1111111-1111-1111-1111-111111111111',
    'Understanding Corporate Governance in 2025',
    'understanding-corporate-governance-2025',
    'A comprehensive guide to modern corporate governance principles and best practices.',
    '{"type":"markdown","value":"# Introduction\n\nCorporate governance has evolved significantly in recent years...\n\n## Key Principles\n\n1. **Transparency**: Open communication with stakeholders\n2. **Accountability**: Clear lines of responsibility\n3. **Fairness**: Equitable treatment of all stakeholders\n\n## Recent Developments\n\nThe regulatory landscape continues to change..."}'::jsonb,
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
    'published',
    now() - interval '5 days'
  ),
  (
    'p2222222-2222-2222-2222-222222222222',
    'Employment Law Update: Remote Work Policies',
    'employment-law-remote-work-policies',
    'How recent court decisions are shaping remote work agreements.',
    '{"type":"markdown","value":"# Remote Work Legal Framework\n\nThe shift to remote work has created new legal challenges...\n\n## Key Considerations\n\n- Jurisdiction and applicable laws\n- Data privacy and security\n- Equipment and expense reimbursement\n- Worker classification\n\n## Best Practices\n\nEmployers should review and update their policies regularly..."}'::jsonb,
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902',
    'published',
    now() - interval '2 days'
  ),
  (
    'p3333333-3333-3333-3333-333333333333',
    'IP Protection Strategies for Tech Startups',
    'ip-protection-tech-startups',
    'Essential intellectual property strategies for early-stage technology companies.',
    '{"type":"markdown","value":"# Protecting Your Innovation\n\nIntellectual property is often a startup''s most valuable asset...\n\n## Types of IP Protection\n\n### Patents\nUtility patents protect functional innovations...\n\n### Trademarks\nBrand identity is crucial for market differentiation...\n\n### Trade Secrets\nSometimes the best protection is confidentiality..."}'::jsonb,
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
    'draft',
    null
  )
on conflict (id) do nothing;

-- ============================================================
-- 4) LINK POSTS TO CATEGORIES
-- ============================================================

insert into public.post_categories (post_id, category_id) values
  ('p1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111'),
  ('p2222222-2222-2222-2222-222222222222', 'c4444444-4444-4444-4444-444444444444'),
  ('p3333333-3333-3333-3333-333333333333', 'c5555555-5555-5555-5555-555555555555'),
  ('p3333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111')
on conflict (post_id, category_id) do nothing;

-- ============================================================
-- 5) SEED FAQS
-- ============================================================

-- Update existing FAQs with new columns
update public.faqs 
set 
  status = 'published',
  answer_json = jsonb_build_object('type', 'markdown', 'value', answer),
  sort_order = id::int
where answer_json is null;

-- Add new sample FAQs
insert into public.faqs (question, answer, answer_json, status, sort_order) values
  (
    'How do I schedule a consultation?',
    'You can schedule a consultation through our online booking system or by calling our office directly.',
    '{"type":"markdown","value":"You can schedule a consultation through our online booking system or by calling our office directly at **(555) 123-4567**.\n\n## Online Booking\n1. Visit our [consultation page](/contact)\n2. Select your preferred date and time\n3. Provide case details\n4. Receive confirmation within 24 hours\n\n## Phone Booking\nCall us Monday-Friday, 9AM-5PM EST."}'::jsonb,
    'published',
    100
  ),
  (
    'What are your consultation fees?',
    'Initial consultations are complimentary for most practice areas. Complex cases may require a paid consultation.',
    '{"type":"markdown","value":"Initial consultations are **complimentary** for most practice areas.\n\n### Free Consultation Areas\n- Personal injury\n- Employment disputes\n- General corporate matters\n\n### Paid Consultations\nComplex cases in the following areas may require a paid consultation:\n- M&A transactions over $10M\n- Multi-jurisdictional litigation\n- Patent prosecution\n\n*Fees are discussed during scheduling.*"}'::jsonb,
    'published',
    101
  ),
  (
    'Do you offer payment plans?',
    'Yes, we offer flexible payment arrangements for qualifying clients.',
    '{"type":"markdown","value":"Yes, we offer **flexible payment arrangements** for qualifying clients.\n\n## Payment Options\n- Hourly billing\n- Flat fee arrangements\n- Contingency fees (where applicable)\n- Monthly payment plans\n\n## Qualification\nPayment plans are evaluated on a case-by-case basis considering:\n- Case complexity\n- Estimated duration\n- Client financial situation\n\nContact our billing department for details."}'::jsonb,
    'published',
    102
  )
on conflict (id) do nothing;

-- ============================================================
-- 6) SEED ANNOUNCEMENTS
-- ============================================================

insert into public.announcements (
  id,
  title,
  content,
  status,
  priority,
  expires_at
) values
  (
    'a1111111-1111-1111-1111-111111111111',
    'Holiday Office Hours',
    '{"type":"markdown","value":"Our offices will be closed December 24-26 for the holidays. Emergency contact: (555) 123-9999"}'::jsonb,
    'published',
    100,
    '2025-12-27'::timestamptz
  ),
  (
    'a2222222-2222-2222-2222-222222222222',
    'New Partner Announcement',
    '{"type":"markdown","value":"We are pleased to announce that **Jane Smith** has joined our firm as a Partner in the Corporate Law practice group."}'::jsonb,
    'published',
    50,
    null
  )
on conflict (id) do nothing;

-- ============================================================
-- 7) SAMPLE IMAGE METADATA
-- ============================================================

insert into public.images_meta (
  id,
  url,
  storage_path,
  width,
  height,
  bytes,
  mime,
  alt_text
) values
  (
    'i1111111-1111-1111-1111-111111111111',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
    'sample/corporate-meeting.jpg',
    1200,
    800,
    245760,
    'image/jpeg',
    'Corporate governance meeting'
  ),
  (
    'i2222222-2222-2222-2222-222222222222',
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902',
    'sample/remote-work.jpg',
    1200,
    800,
    198340,
    'image/jpeg',
    'Professional working remotely'
  )
on conflict (id) do nothing;

-- ============================================================
-- Seed Complete
-- ============================================================

-- Display summary
do $$
declare
  v_categories int;
  v_posts int;
  v_faqs int;
  v_announcements int;
begin
  select count(*) into v_categories from public.categories;
  select count(*) into v_posts from public.posts;
  select count(*) into v_faqs from public.faqs;
  select count(*) into v_announcements from public.announcements;
  
  raise notice '====================================';
  raise notice 'CMS Seed Data Summary';
  raise notice '====================================';
  raise notice 'Categories:    %', v_categories;
  raise notice 'Posts:         %', v_posts;
  raise notice 'FAQs:          %', v_faqs;
  raise notice 'Announcements: %', v_announcements;
  raise notice '====================================';
  raise notice '⚠️  NEXT STEP: Add admin user to admin_profiles table';
  raise notice '====================================';
end $$;

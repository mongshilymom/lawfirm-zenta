-- ============================================================
-- Supabase Storage 설정 (이미지 업로드)
-- ============================================================

-- 1. page-images 버킷 생성 (CMS 페이지 이미지용)
insert into storage.buckets (id, name, public) 
values ('page-images', 'page-images', true)
on conflict (id) do nothing;

-- 2. 누구나 이미지 업로드 가능 (인증된 사용자)
create policy "Authenticated users can upload page images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'page-images');

-- 3. 누구나 이미지 읽기 가능 (Public)
create policy "Public can view page images"
on storage.objects for select
to public
using (bucket_id = 'page-images');

-- 4. 인증된 사용자만 삭제 가능
create policy "Authenticated users can delete page images"
on storage.objects for delete
to authenticated
using (bucket_id = 'page-images');

-- 5. lawyer-photos 버킷 생성 (변호사 사진용)
insert into storage.buckets (id, name, public) 
values ('lawyer-photos', 'lawyer-photos', true)
on conflict (id) do nothing;

-- 6. 변호사 사진 업로드 정책
create policy "Authenticated users can upload lawyer photos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'lawyer-photos');

create policy "Public can view lawyer photos"
on storage.objects for select
to public
using (bucket_id = 'lawyer-photos');

create policy "Authenticated users can delete lawyer photos"
on storage.objects for delete
to authenticated
using (bucket_id = 'lawyer-photos');

# ZENTA 관리자 계정 생성 가이드

## 1단계: Supabase SQL 스크립트 실행 (5분)

### 1.1 Supabase 대시보드 접속
https://supabase.com/dashboard/project/tadxghkywyhizazevasa

### 1.2 SQL Editor로 이동
왼쪽 메뉴 → SQL Editor

### 1.3 스크립트 순서대로 실행

#### ① 기본 테이블 생성 (schema.sql)
```sql
-- 파일: supabase/schema.sql
-- 실행: SQL Editor에서 전체 복사 → 붙여넣기 → Run
```

#### ② 관리자 인증 테이블 (admin-auth.sql)
```sql
-- 파일: supabase/admin-auth.sql
-- 실행: SQL Editor에서 전체 복사 → 붙여넣기 → Run
```

#### ③ CMS 테이블 (cms-tables.sql)
```sql
-- 파일: supabase/cms-tables.sql
-- 실행: SQL Editor에서 전체 복사 → 붙여넣기 → Run
```

#### ④ 상담 테이블 (consultations.sql)
```sql
-- 파일: supabase/consultations.sql
-- 실행: SQL Editor에서 전체 복사 → 붙여넣기 → Run
```

---

## 2단계: 관리자 계정 생성 (3분)

### 2.1 Supabase Authentication
Supabase Dashboard → Authentication → Users → Add User

**관리자 계정 정보:**
- Email: admin@youalta.net
- Password: Zenta2025!Admin
- Auto Confirm User: ✅ 체크

### 2.2 관리자 프로필 추가
SQL Editor에서 실행:

```sql
-- 방금 생성한 사용자의 ID 확인
SELECT id, email FROM auth.users WHERE email = 'admin@youalta.net';

-- 위에서 확인한 user_id로 admin_profiles에 추가
INSERT INTO public.admin_profiles (user_id, role, full_name)
VALUES (
  '여기에-user-id-입력',  -- 위에서 확인한 ID
  'super_admin',
  'ZENTA 관리자'
);
```

---

## 3단계: Storage 버킷 생성 (2분)

### 3.1 Storage 메뉴
Supabase Dashboard → Storage → Create New Bucket

**버킷 설정:**
- Name: zenta-images
- Public: ✅ 체크 (공개)
- File size limit: 50MB
- Allowed MIME types: image/png, image/jpeg, image/gif, image/webp

---

## 4단계: 로그인 테스트 (1분)

### 4.1 로컬 개발 서버 실행
```bash
npm run dev
```

### 4.2 관리자 로그인
http://localhost:3000/admin/login

- Email: admin@youalta.net
- Password: Zenta2025!Admin

✅ 로그인 성공 → 대시보드로 리디렉션

---

## 🚨 문제 발생 시 체크리스트

### SQL 실행 에러
- ✅ 스크립트를 순서대로 실행했는가?
- ✅ 이전 스크립트가 성공적으로 완료되었는가?
- ✅ 테이블 이름 충돌이 없는가?

### 로그인 실패
- ✅ 관리자 계정이 생성되었는가?
- ✅ admin_profiles 테이블에 레코드가 있는가?
- ✅ .env.local 파일에 Supabase 키가 정확한가?

### 권한 에러
- ✅ RLS 정책이 올바르게 설정되었는가?
- ✅ Storage 버킷이 생성되고 공개로 설정되었는가?

---

## ⏱️ 완료 시간: 총 11분

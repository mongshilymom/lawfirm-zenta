# 🚀 3일 완성 배포 가이드

## ✅ 완료된 작업
- Supabase 인증 + 관리자 권한 시스템
- CMS 페이지 관리 CRUD
- 이미지 업로드 (Supabase Storage)
- 문의폼 + 이메일 알림 시스템

---

## 📋 배포 전 체크리스트 (60분)

### **1단계: Supabase 설정 (20분)**

#### 1.1 Storage 버킷 생성
```bash
# Supabase Dashboard > Storage로 이동
# 아래 SQL을 SQL Editor에서 실행:
```

```sql
-- storage-setup.sql 파일 내용을 복사해서 실행
```

또는:
1. Storage 메뉴에서 "New bucket" 클릭
2. 버킷 이름: `page-images` 입력
3. Public 체크박스 활성화
4. Create 클릭
5. `lawyer-photos` 버킷도 동일하게 생성

#### 1.2 테이블 생성 확인
```bash
# SQL Editor에서 아래 순서로 실행:
1. admin-auth.sql
2. cms-tables.sql
3. consultations.sql
4. storage-setup.sql
```

#### 1.3 관리자 계정 생성
```bash
# setup-admin.md 파일 참조
# Supabase Dashboard > Authentication > Users
# "Add user" 클릭 후 이메일/비밀번호 입력
```

---

### **2단계: Resend 이메일 설정 (10분)**

#### 2.1 Resend 가입
1. https://resend.com 접속
2. 무료 회원가입 (월 3,000통 무료)
3. API Keys 메뉴에서 API Key 생성

#### 2.2 환경 변수 업데이트
`.env.local` 파일에서:
```bash
RESEND_API_KEY=re_YOUR_ACTUAL_API_KEY  # Resend에서 받은 키로 변경
ADMIN_EMAIL=admin@youalta.net          # 실제 관리자 이메일로 변경
```

#### 2.3 도메인 인증 (선택, 프로덕션용)
- Resend Dashboard > Domains
- youalta.net 추가 후 DNS 레코드 설정

---

### **3단계: Vercel 배포 (15분)**

#### 3.1 GitHub 연결
```bash
git add .
git commit -m "feat: 이미지 업로드 + 문의폼 완성"
git push origin main
```

#### 3.2 Vercel 배포
1. https://vercel.com 로그인
2. "New Project" 클릭
3. GitHub 저장소 선택: `template-lawfirm-zenta`
4. Framework Preset: Next.js (자동 감지)
5. **Environment Variables 추가:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://tadxghkywyhizazevasa.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=(Supabase 키)
   SUPABASE_SERVICE_ROLE_KEY=(Service Role 키)
   ANTHROPIC_API_KEY=(Claude AI 키)
   RESEND_API_KEY=(Resend 키)
   ADMIN_EMAIL=admin@youalta.net
   NEXT_PUBLIC_BASE_URL=https://youalta.net
   ```
6. "Deploy" 클릭

#### 3.3 도메인 연결
1. Vercel Dashboard > 프로젝트 > Settings > Domains
2. youalta.net 입력
3. DNS 레코드 설정:
   ```
   A     @    76.76.21.21
   CNAME www  cname.vercel-dns.com
   ```

---

### **4단계: 테스트 (15분)**

#### 4.1 기능 테스트
- [ ] 관리자 로그인: https://youalta.net/admin/login
- [ ] CMS 페이지 생성 + 이미지 업로드
- [ ] 문의폼 제출: https://youalta.net/contact
- [ ] 이메일 수신 확인
- [ ] 관리자 대시보드에서 문의 확인

#### 4.2 모바일 테스트
- [ ] 반응형 레이아웃 확인
- [ ] 문의폼 작동 확인

---

## 🎯 배포 후 즉시 실행

### **5분 체크리스트**
```bash
✅ https://youalta.net 접속 확인
✅ https://youalta.net/admin/login 로그인 테스트
✅ 문의폼 테스트 제출
✅ 이메일 수신 확인
✅ CMS에서 페이지 1개 생성 테스트
```

---

## 💰 예상 비용 (월)

| 서비스 | 플랜 | 비용 |
|--------|------|------|
| Supabase | Free Tier | $0 |
| Vercel | Hobby | $0 |
| Resend | Free Tier | $0 |
| **Total** | | **$0/월** |

*트래픽 증가 시 Supabase Pro ($25/월), Vercel Pro ($20/월) 업그레이드 권장*

---

## 🔥 즉시 해결 - 자주 발생하는 오류

### 오류 1: "Not authenticated" 
```bash
해결: Supabase > Authentication에서 관리자 계정 생성
```

### 오류 2: 이미지 업로드 실패
```bash
해결: storage-setup.sql 실행 확인
```

### 오류 3: 이메일 발송 실패
```bash
해결: RESEND_API_KEY 환경 변수 확인
```

### 오류 4: 빌드 실패
```bash
npm install
npm run build
# 로컬에서 빌드 성공 후 재배포
```

---

## 📞 긴급 지원

빠른 문의: 
- GitHub Issues: https://github.com/mongshilymom/template-lawfirm-zenta/issues
- 이메일: dev@youalta.net

---

## 🎁 완성된 기능 리스트

### ✅ 프론트엔드
- [ ] 메인 페이지 + 변호사 소개
- [ ] 문의폼 (실시간 저장 + 이메일 알림)
- [ ] AI 챗봇 상담
- [ ] 반응형 디자인

### ✅ 관리자 (CMS)
- [ ] 로그인/로그아웃
- [ ] 페이지 CRUD (생성/읽기/수정/삭제)
- [ ] 이미지 업로드
- [ ] 문의 관리 대시보드
- [ ] 변호사 프로필 관리

### ✅ 자동화
- [ ] 문의 접수 시 자동 이메일 발송
- [ ] 변호사 배정 시 알림

---

**예상 배포 시간: 1시간**  
**실제 작업 시간: 3일 → 완료! 🎉**

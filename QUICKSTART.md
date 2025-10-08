# ⚡ 5분 빠른 시작 가이드

## 📦 1단계: 의존성 설치 (1분)
```bash
cd C:\Users\mongshilymom\dev\letyou\templates\template-lawfirm-zenta
npm install
```

## 🔑 2단계: Supabase 설정 (2분)

### A. Supabase 프로젝트 생성
1. https://supabase.com/dashboard 접속
2. "New Project" 클릭
3. 프로젝트 이름: `lawfirm-zenta`
4. 비밀번호 설정 후 생성 대기 (1-2분)

### B. API 키 복사
1. 프로젝트 대시보드 → Settings → API
2. 다음 정보 복사:
   - `Project URL`
   - `anon public` 키
   - `service_role` 키 (secret 영역)

### C. .env 파일 설정
`.env` 파일을 열고 복사한 키 입력:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJI...
```

## 🗄️ 3단계: 데이터베이스 스키마 생성 (1분)

### A. SQL Editor 열기
Supabase Dashboard → SQL Editor

### B. 스키마 실행
1. `supabase/schema.sql` 파일 내용 복사
2. SQL Editor에 붙여넣기
3. "RUN" 버튼 클릭 ✅

## 🌱 4단계: 초기 데이터 생성 (1분)
```bash
npm run seed
```
→ 500명의 변호사 데이터 자동 생성

## 🚀 5단계: 개발 서버 실행
```bash
npm run dev
```
→ http://localhost:3000 접속

---

## ✅ 완료 체크리스트
- [ ] `npm install` 완료
- [ ] Supabase 프로젝트 생성
- [ ] `.env` 파일 설정
- [ ] 데이터베이스 스키마 실행
- [ ] `npm run seed` 완료
- [ ] `npm run dev` 실행
- [ ] localhost:3000 접속 확인

---

## 🆘 문제 해결

### "Missing Supabase environment variable" 오류
→ `.env` 파일에 `NEXT_PUBLIC_SUPABASE_URL`과 `SUPABASE_SERVICE_ROLE_KEY`가 올바르게 설정되었는지 확인

### "relation does not exist" 오류
→ Supabase SQL Editor에서 `supabase/schema.sql`을 실행했는지 확인

### 변호사 데이터가 안 보임
→ `npm run seed`를 실행했는지 확인

### 포트 3000이 이미 사용중
→ `npm run dev -- -p 3001`로 다른 포트 사용

---

## 🎯 다음 단계

### 커스터마이징
1. `tailwind.config.ts`에서 컬러 변경
2. `app/globals.css`에서 폰트 변경
3. `components/` 폴더에서 레이아웃 수정

### 배포
```bash
# Vercel 배포
vercel --prod

# 또는 Cloudflare Pages
npm run build
npx wrangler pages deploy .next
```

### AI 기능 추가
`docs/ai-automation.md` 참고하여 GPT-5 챗봇 연동

---

## 💡 추가 명령어
```bash
# 데이터베이스 연결 테스트
npm run setup

# 전체 데이터 재생성
npm run seed:force

# E2E 테스트 실행
npm run test:e2e

# 프로덕션 빌드
npm run build
```

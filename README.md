# ZENTA Law Firm WebSite

> 🏛️ **Dark Academia AI-First Law Firm Architecture**  
> Professional digital experience platform for modern law firms

## ⚡ 빠른 시작 (5분 설정)

### 1. 의존성 설치
```bash
npm install
# 또는
pnpm install
```

### 2. Supabase 프로젝트 생성
1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. "New Project" 클릭
3. 프로젝트 생성 후 Settings → API에서 키 복사

### 3. 환경변수 설정
`.env` 파일에 Supabase 키 입력:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### 4. 데이터베이스 스키마 생성
Supabase Dashboard → SQL Editor에서 `supabase/schema.sql` 내용 실행

### 5. 초기 데이터 시딩
```bash
npm run seed
```

### 6. 개발 서버 실행
```bash
npm run dev
```

→ http://localhost:3000 접속

---

## 🎯 핵심 기능

### ✨ 구현 완료
- ✅ Dark Academia UI 시스템 (Tailwind + Framer Motion)
- ✅ 변호사 디렉토리 (검색/필터링)
- ✅ 3-Click 네비게이션 보장
- ✅ Supabase 연동 (Postgres + Edge Functions)
- ✅ 반응형 레이아웃 (모바일 최적화)
- ✅ TypeScript + Next.js 14 App Router

### 🚧 구현 예정 (선택 사항)
- GPT-5 상담 에이전트 (AI 챗봇)
- HubSpot + Linear 자동화
- Firecrawl 경쟁사 분석
- Browserbase QA 자동화

---

## 📁 프로젝트 구조

```
zenta-lawfirm/
├── app/                    # Next.js 14 App Router
│   ├── chat/              # AI 상담 페이지
│   ├── layout.tsx         # 글로벌 레이아웃
│   └── page.tsx           # 홈페이지
├── components/
│   ├── layouts/           # 레이아웃 컴포넌트
│   │   └── LawyerDirectory.tsx
│   └── sections/          # 섹션 컴포넌트
│       └── HeroArch.tsx
├── lib/supabase/          # Supabase 클라이언트
│   ├── client.ts          # 브라우저 클라이언트
│   ├── server.ts          # 서버 클라이언트
│   ├── queries.ts         # 데이터 쿼리
│   └── types.ts           # 타입 정의
├── supabase/
│   ├── schema.sql         # DB 스키마
│   └── seed.sql           # 초기 데이터
├── tests/                 # Playwright E2E 테스트
└── docs/                  # 설계 문서
```

---

## 🎨 디자인 시스템

### 컬러 팔레트
```css
--color-ink: #0f1316        /* 배경 */
--color-obsidian: #14181c   /* 서브 배경 */
--color-parchment: #e9e4da  /* 메인 텍스트 */
--color-brass: #d4b07a      /* 액센트 */
--color-pewter: #3a464f     /* 보조 */
```

### 타이포그래피
- **Serif**: EB Garamond (헤드라인, 본문)
- **Sans**: Inter (UI 요소)

---

## 🚀 배포

### Vercel (권장)
```bash
vercel --prod
```

### Cloudflare Pages
```bash
npm run build
npx wrangler pages deploy .next
```

---

## 📊 성능 목표
- ✅ Lighthouse Score: 95+
- ✅ LCP: <1.5s
- ✅ CLS: <0.1
- ✅ 변호사 검색: <1s

---

## 🔒 보안
- Row Level Security (RLS) 활성화
- API 키는 환경변수로 관리
- CORS 정책 설정 완료

---

## 📞 지원

문제 발생 시:
1. [GitHub Issues](https://github.com/mongshilymom/zenta-lawfirm/issues)
2. [Supabase Discord](https://discord.supabase.com)
3. [Next.js Docs](https://nextjs.org/docs)

---

## 📄 라이선스

MIT License - 상업적 사용 가능

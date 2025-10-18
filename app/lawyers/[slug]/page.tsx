import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import lawyers from "@/data/lawyers.json";
import type { Metadata } from "next";

// 정적 페이지 생성
export async function generateStaticParams() {
  return lawyers
    .filter((l) => l.status === "published")
    .map((lawyer) => ({
      slug: lawyer.slug,
    }));
}

// 동적 메타데이터
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const lawyer = lawyers.find((l) => l.slug === params.slug);

  if (!lawyer) {
    return {
      title: "변호사를 찾을 수 없습니다",
    };
  }

  return {
    title: `${lawyer.nameKo} 변호사 | Zenta Law`,
    description: `${lawyer.nameKo} 변호사 - ${lawyer.practice.join(", ")} 전문. 경력 ${lawyer.years}년. ${lawyer.bioKo}`,
    openGraph: {
      title: `${lawyer.nameKo} 변호사 | Zenta Law`,
      description: lawyer.bioKo,
      images: [
        {
          url: lawyer.photo,
          width: 800,
          height: 1067,
          alt: lawyer.photoAlt,
        },
      ],
    },
  };
}

export default function LawyerDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const lawyer = lawyers.find((l) => l.slug === params.slug);

  if (!lawyer || lawyer.status !== "published") {
    notFound();
  }

  // JSON-LD 구조화 데이터
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: lawyer.nameEn,
    alternateName: lawyer.nameKo,
    jobTitle: lawyer.role,
    worksFor: {
      "@type": "LegalService",
      name: "Zenta Law",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: lawyer.location.city,
      addressCountry: lawyer.location.region,
    },
    email: lawyer.email,
    telephone: lawyer.phone,
    knowsLanguage: lawyer.languages.map((lang) => ({
      "@type": "Language",
      name: lang === "KO" ? "Korean" : "English",
    })),
    description: lawyer.bioKo,
    image: lawyer.photo,
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="bg-ink min-h-screen">
        {/* 히어로 섹션 */}
        <section className="relative border-b border-zinc-800 bg-gradient-to-b from-zinc-900 to-ink">
          <div className="mx-auto max-w-7xl px-6 py-12">
            {/* 뒤로가기 */}
            <Link
              href="/lawyers"
              className="mb-8 inline-flex items-center gap-2 text-parchment/70 transition-colors hover:text-brass"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              변호사 목록으로
            </Link>

            <div className="grid gap-12 md:grid-cols-[300px_1fr] lg:grid-cols-[400px_1fr]">
              {/* 프로필 이미지 */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border-2 border-brass/30 shadow-2xl shadow-brass/10">
                <Image
                  src={lawyer.photo}
                  alt={lawyer.photoAlt || `${lawyer.nameKo} 변호사`}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                  priority
                />
              </div>

              {/* 기본 정보 */}
              <div className="flex flex-col justify-center space-y-6">
                <div>
                  <div className="mb-2 inline-block rounded-full bg-brass/20 px-4 py-1 text-sm font-medium text-brass">
                    {lawyer.role}
                  </div>
                  <h1 className="mb-3 font-serif text-4xl font-bold text-parchment md:text-5xl">
                    {lawyer.nameKo}
                  </h1>
                  <p className="text-xl text-parchment/60">{lawyer.nameEn}</p>
                </div>

                <div className="space-y-3 text-parchment/70">
                  {/* 경력 */}
                  <div className="flex items-center gap-3">
                    <svg
                      className="h-5 w-5 text-brass"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>
                      경력 {lawyer.years}년 (변호사 등록 {lawyer.barYear}년)
                    </span>
                  </div>

                  {/* 위치 */}
                  <div className="flex items-center gap-3">
                    <svg
                      className="h-5 w-5 text-brass"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{lawyer.location.city}</span>
                  </div>

                  {/* 언어 */}
                  <div className="flex items-center gap-3">
                    <svg
                      className="h-5 w-5 text-brass"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                      />
                    </svg>
                    <span>
                      {lawyer.languages
                        .map((lang) => (lang === "KO" ? "한국어" : "영어"))
                        .join(", ")}
                    </span>
                  </div>
                </div>

                {/* 연락처 */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <a
                    href={`mailto:${lawyer.email}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-brass px-6 py-3 font-medium text-ink transition-all hover:bg-brass/90 hover:shadow-lg hover:shadow-brass/30"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    이메일 문의
                  </a>
                  <a
                    href={`tel:${lawyer.phone}`}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-brass px-6 py-3 font-medium text-brass transition-all hover:bg-brass hover:text-ink"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    전화 상담
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 메인 콘텐츠 */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
            {/* 왼쪽: 소개 */}
            <div className="space-y-12">
              {/* 소개 */}
              <article>
                <h2 className="mb-6 flex items-center gap-3 font-serif text-2xl font-bold text-parchment">
                  <span className="inline-block h-1 w-12 bg-brass"></span>
                  소개
                </h2>
                <p className="whitespace-pre-wrap text-lg leading-relaxed text-parchment/80">
                  {lawyer.bioKo}
                </p>
              </article>

              {/* 전문 분야 */}
              <article>
                <h2 className="mb-6 flex items-center gap-3 font-serif text-2xl font-bold text-parchment">
                  <span className="inline-block h-1 w-12 bg-brass"></span>
                  전문 분야
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {lawyer.practice.map((area, idx) => (
                    <div
                      key={idx}
                      className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-all hover:border-brass/50 hover:bg-zinc-900"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-brass/20 text-brass">
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium text-parchment">{area}</h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </div>

            {/* 오른쪽: CTA & 정보 */}
            <div className="space-y-8">
              {/* 상담 신청 */}
              <div className="sticky top-20 rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-900/50 p-8 shadow-2xl">
                <h3 className="mb-6 text-center font-serif text-xl font-bold text-parchment">
                  법률 상담 신청
                </h3>
                <div className="space-y-4">
                  <Link
                    href="/chat"
                    className="block w-full rounded-xl bg-brass py-4 text-center font-bold text-ink transition-all hover:bg-brass/90 hover:shadow-lg hover:shadow-brass/30"
                  >
                    AI 챗봇으로 상담
                  </Link>
                  <Link
                    href="/contact"
                    className="block w-full rounded-xl border-2 border-brass py-4 text-center font-bold text-brass transition-all hover:bg-brass hover:text-ink"
                  >
                    변호사 상담 예약
                  </Link>
                </div>
                <p className="mt-6 text-center text-sm text-parchment/60">
                  평일 09:00 - 18:00 운영
                  <br />
                  주말 및 공휴일 휴무
                </p>
              </div>

              {/* 연락처 정보 */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h3 className="mb-4 font-serif text-lg font-bold text-parchment">
                  연락처
                </h3>
                <div className="space-y-3 text-sm text-parchment/70">
                  <div className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-4 w-4 text-brass"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <a
                      href={`mailto:${lawyer.email}`}
                      className="break-all hover:text-brass"
                    >
                      {lawyer.email}
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-4 w-4 text-brass"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <a href={`tel:${lawyer.phone}`} className="hover:text-brass">
                      {lawyer.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

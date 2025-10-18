"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

interface Lawyer {
  slug: string;
  nameKo: string;
  role: string;
  practice: string[];
  years: number;
  photo: string;
  photoAlt?: string;
}

interface Props {
  lawyers: Lawyer[];
}

export default function DirectorySearch({ lawyers }: Props) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [specialty, setSpecialty] = useState("all");
  const [experience, setExperience] = useState("all");

  // 실시간 필터링
  const filteredLawyers = useMemo(() => {
    let result = [...lawyers];

    // 검색어 필터
    if (query.trim()) {
      const searchLower = query.toLowerCase();
      result = result.filter((l) =>
        [l.nameKo, ...(l.practice || [])]
          .join(" ")
          .toLowerCase()
          .includes(searchLower)
      );
    }

    // 직책 필터
    if (role !== "all") {
      result = result.filter((l) => l.role === role);
    }

    // 전문 분야 필터
    if (specialty !== "all") {
      result = result.filter((l) =>
        l.practice.some((p) => p.includes(specialty))
      );
    }

    // 경력 필터
    if (experience !== "all") {
      if (experience === "10+") {
        result = result.filter((l) => l.years >= 10);
      } else if (experience === "15+") {
        result = result.filter((l) => l.years >= 15);
      }
    }

    return result;
  }, [lawyers, query, role, specialty, experience]);

  // 검색 조건이 있는지 확인
  const hasSearchCriteria =
    query.trim() || role !== "all" || specialty !== "all" || experience !== "all";

  return (
    <section className="my-12 px-6">
      <div className="mx-auto rounded-3xl border border-zinc-800 bg-obsidian/80 px-6 py-6 shadow-brass backdrop-blur">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.3em] text-brass/80">
            Lawyer Directory
          </p>
          <h2 className="mt-2 font-serif text-3xl text-parchment">
            로펌 네트워크 전용 매거진 플랫폼
          </h2>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="grid gap-3 md:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]"
        >
          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              이름/전문분야
            </span>
            <input
              type="search"
              name="query"
              placeholder="예: 기업 인수, 공정거래"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="rounded-2xl border border-zinc-700 bg-obsidian px-4 py-3 text-sm text-parchment placeholder:text-zinc-500 focus:border-brass focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              직책
            </span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="rounded-2xl border border-zinc-700 bg-obsidian px-4 py-3 text-sm text-parchment focus:border-brass focus:outline-none"
            >
              <option value="all">전체</option>
              <option value="Partner">Partner</option>
              <option value="Associate">Associate</option>
              <option value="Of Counsel">Of Counsel</option>
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              전문 분야
            </span>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="rounded-2xl border border-zinc-700 bg-obsidian px-4 py-3 text-sm text-parchment focus:border-brass focus:outline-none"
            >
              <option value="all">모든 분야</option>
              <option value="기업법">기업법</option>
              <option value="지식재산권">지식재산권</option>
              <option value="형사소송">형사소송</option>
              <option value="가족법">가족법</option>
              <option value="부동산">부동산</option>
              <option value="노동법">노동법</option>
              <option value="M&A">M&A</option>
              <option value="스타트업">스타트업</option>
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              경력
            </span>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="rounded-2xl border border-zinc-700 bg-obsidian px-4 py-3 text-sm text-parchment focus:border-brass focus:outline-none"
            >
              <option value="all">전체</option>
              <option value="10+">10년 이상</option>
              <option value="15+">15년 이상</option>
            </select>
          </label>
        </form>
      </div>

      {/* 검색 결과 섹션 */}
      {hasSearchCriteria && (
        <div className="mx-auto mt-8">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-serif text-2xl text-parchment">
              검색 결과{" "}
              <span className="text-brass">({filteredLawyers.length})</span>
            </h3>
            <button
              onClick={() => {
                setQuery("");
                setRole("all");
                setSpecialty("all");
                setExperience("all");
              }}
              className="text-sm text-brass hover:text-brass/80 underline"
            >
              필터 초기화
            </button>
          </div>

          {filteredLawyers.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-12 text-center">
              <p className="text-lg text-parchment/70">
                조건에 맞는 변호사가 없습니다.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredLawyers.map((lawyer) => (
                <article
                  key={lawyer.slug}
                  className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 transition-all duration-300 hover:border-brass/50 hover:shadow-lg hover:shadow-brass/10"
                >
                  {/* 이미지 */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-zinc-800">
                    <Image
                      src={lawyer.photo || "/images/profile-placeholder.png"}
                      alt={lawyer.photoAlt || `${lawyer.nameKo} 변호사`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent opacity-60" />
                  </div>

                  {/* 정보 */}
                  <div className="p-5">
                    <div className="mb-3">
                      <h3 className="mb-1 font-serif text-xl font-bold text-parchment">
                        {lawyer.nameKo}
                      </h3>
                      <p className="text-sm font-medium text-brass">
                        {lawyer.role}
                      </p>
                    </div>

                    <div className="mb-4 space-y-1 text-sm text-parchment/70">
                      <p className="flex items-center gap-2">
                        <span className="text-brass">•</span>
                        경력 {lawyer.years}년
                      </p>
                      {lawyer.practice && lawyer.practice.length > 0 && (
                        <p className="flex items-start gap-2">
                          <span className="mt-1 text-brass">•</span>
                          <span>{lawyer.practice.slice(0, 3).join(", ")}</span>
                        </p>
                      )}
                    </div>

                    <Link
                      href={`/lawyers/${lawyer.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-brass transition-all hover:gap-3 hover:text-brass/80"
                    >
                      프로필 보기
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

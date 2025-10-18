'use client';
import Image from 'next/image';
import Link from 'next/link';
import LawyerFilters from './LawyerFilters';
import { useLawyerFilters, type Lawyer } from './useLawyerFilters';

export default function LawyersListClient({ lawyers }: { lawyers: Lawyer[] }) {
  const filterState = useLawyerFilters(lawyers);
  const list = filterState.filtered;

  const handleResetFilters = () => {
    filterState.setActiveTab('전체');
    filterState.setQ('');
    filterState.setSort('이름(ㄱ→ㅎ)');
  };

  return (
    <>
      <LawyerFilters
        activeTab={filterState.activeTab}
        onTab={filterState.setActiveTab}
        q={filterState.q}
        onQ={filterState.setQ}
        sort={filterState.sort}
        onSort={filterState.setSort}
        count={list.length}
      />
      
      <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((lawyer) => (
          <article
            key={lawyer.slug}
            className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 transition-all duration-300 hover:border-brass/50 hover:shadow-lg hover:shadow-brass/10"
          >
            {/* 이미지 */}
            <div className="relative aspect-[3/4] overflow-hidden bg-zinc-800">
              <Image
                src={lawyer.photo || '/images/profile-placeholder.png'}
                alt={lawyer.photoAlt || `${lawyer.nameKo} 변호사`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent opacity-60" />
            </div>

            {/* 정보 */}
            <div className="p-5">
              <div className="mb-3">
                <h3 className="mb-1 font-serif text-xl font-bold text-parchment">
                  {lawyer.nameKo}
                </h3>
                <p className="text-sm font-medium text-brass">{lawyer.role}</p>
              </div>

              <div className="mb-4 space-y-1 text-sm text-parchment/70">
                <p className="flex items-center gap-2">
                  <span className="text-brass">•</span>
                  경력 {lawyer.years}년
                </p>
                {lawyer.practice && lawyer.practice.length > 0 && (
                  <p className="flex items-start gap-2">
                    <span className="mt-1 text-brass">•</span>
                    <span>{lawyer.practice.join(', ')}</span>
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
        
        {!list.length && (
          <div className="col-span-full py-16 text-center">
            <p className="mb-4 text-lg text-parchment/70">
              조건에 맞는 변호사가 없습니다.
            </p>
            <button
              onClick={handleResetFilters}
              className="rounded-lg bg-brass px-6 py-2.5 font-medium text-ink transition-all hover:bg-brass/90"
            >
              필터 초기화
            </button>
          </div>
        )}
      </section>
    </>
  );
}

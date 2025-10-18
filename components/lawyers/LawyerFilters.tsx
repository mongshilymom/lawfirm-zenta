'use client';
import React from 'react';
import type { Practice, SortKey } from './useLawyerFilters';

interface Props {
  activeTab: Practice | '전체';
  onTab: (p: Practice | '전체') => void;
  q: string;
  onQ: (v: string) => void;
  sort: SortKey;
  onSort: (s: SortKey) => void;
  count: number;
}

const TABS: (Practice | '전체')[] = ['전체', '가사', '형사', '민사', '기업'];
const SORTS: SortKey[] = ['이름(ㄱ→ㅎ)', '이름(ㅎ→ㄱ)', '경력(↑→↓)', '경력(↓→↑)'];

export default function LawyerFilters(props: Props) {
  const { activeTab, onTab, q, onQ, sort, onSort, count } = props;
  
  return (
    <div className="mb-8 space-y-6">
      {/* 탭 */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            className={`
              rounded-lg px-5 py-2.5 font-medium transition-all duration-300
              ${
                activeTab === t
                  ? 'bg-brass text-ink shadow-lg shadow-brass/20'
                  : 'border border-zinc-700 bg-zinc-900/50 text-parchment/70 hover:border-brass/50 hover:bg-zinc-800/50 hover:text-parchment'
              }
            `}
            onClick={() => onTab(t)}
            aria-pressed={activeTab === t}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* 검색창 */}
        <div className="flex-1">
          <input
            value={q}
            onChange={(e) => onQ(e.target.value)}
            placeholder="이름, 직함, 키워드로 검색"
            className="
              w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3
              text-parchment placeholder:text-parchment/40
              transition-all duration-300
              focus:border-brass/50 focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-brass/20
            "
            aria-label="변호사 검색"
          />
        </div>

        {/* 정렬 + 결과 수 */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-parchment/70">
            총 <span className="font-semibold text-brass">{count}</span>명
          </span>
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value as SortKey)}
            className="
              rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3
              text-parchment
              transition-all duration-300
              hover:border-brass/50 hover:bg-zinc-800/50
              focus:border-brass/50 focus:outline-none focus:ring-2 focus:ring-brass/20
            "
            aria-label="정렬"
          >
            {SORTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

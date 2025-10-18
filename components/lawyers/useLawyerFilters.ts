'use client';
import { useMemo, useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export type Practice = '가사' | '형사' | '민사' | '기업';
export type SortKey = '경력(↑→↓)' | '경력(↓→↑)' | '이름(ㄱ→ㅎ)' | '이름(ㅎ→ㄱ)';

// Zenta 데이터의 practice를 대분류로 매핑
const PRACTICE_MAPPING: Record<string, Practice> = {
  // 가사
  '가족법': '가사',
  '상속': '가사',
  '이혼': '가사',
  // 형사
  '형사소송': '형사',
  // 민사
  '지식재산권': '민사',
  '계약법': '민사',
  '부동산': '민사',
  '부동산법': '민사',
  '건설법': '민사',
  '임대차': '민사',
  // 기업
  '기업법': '기업',
  'M&A': '기업',
  '규제 대응': '기업',
  '노동법': '기업',
  '인사관리': '기업',
  '스타트업': '기업',
  '벤처투자': '기업',
  '주식매매': '기업',
  '세무법': '기업',
  '조세소송': '기업',
  '국제거래': '기업',
  '금융법': '기업',
  '기술이전': '기업',
  '단체교섭': '기업',
  '컴플라이언스': '기업',
};

// URL 가독성을 위한 영문 슬러그 매핑
const TAB_MAP = { family: '가사', criminal: '형사', civil: '민사', corporate: '기업' } as const;
const REV_TAB_MAP = Object.fromEntries(
  Object.entries(TAB_MAP).map(([k, v]) => [v, k])
) as Record<string, string>;

export interface Lawyer {
  slug: string;
  nameKo: string;
  role?: string;
  years: number;
  practice: string[];
  photo?: string;
  photoAlt?: string;
  status: string;
}

export function useLawyerFilters(all: Lawyer[]) {
  const sp = useSearchParams();
  const router = useRouter();
  const hydrated = useRef(false);

  // ── 헬퍼 함수: URL 슬러그 ↔ 한글 변환
  const decodeTab = (v: string | null): Practice | '전체' => {
    if (!v) return '전체';
    const mapped = TAB_MAP[v as keyof typeof TAB_MAP];
    return mapped || '전체';
  };

  const encodeTabToSlug = (korean: Practice | '전체'): string | null => {
    if (korean === '전체') return null;
    return REV_TAB_MAP[korean] || null;
  };

  // DirectorySearch에서 전달된 specialty를 탭으로 변환
  const mapSpecialtyToTab = (specialty: string | null): Practice | '전체' => {
    if (!specialty || specialty === 'all') return '전체';
    const mapped = PRACTICE_MAPPING[specialty];
    return mapped || '전체';
  };

  // ---- 초기값: URL → 상태
  // DirectorySearch의 query 파라미터도 q로 처리
  const initialQuery = sp.get('q') || sp.get('query') || '';
  
  // specialty 파라미터가 있으면 해당 탭으로 초기화
  const specialtyFromUrl = sp.get('specialty');
  const tabFromSpecialty = specialtyFromUrl ? mapSpecialtyToTab(specialtyFromUrl) : null;
  
  const [activeTab, setActiveTab] = useState<Practice | '전체'>(() => 
    tabFromSpecialty || decodeTab(sp.get('tab'))
  );
  
  const [q, setQ] = useState(() => initialQuery);
  const [dq, setDq] = useState(() => initialQuery);

  // DirectorySearch 필터들
  const [roleFilter, setRoleFilter] = useState<string>(() => sp.get('role') || 'all');
  const [experienceFilter, setExperienceFilter] = useState<string>(() => sp.get('experience') || 'all');

  const [sort, setSort] = useState<SortKey>(() => {
    const s = sp.get('sort');
    if (s === 'exp-asc') return '경력(↑→↓)';
    if (s === 'exp-desc') return '경력(↓→↑)';
    if (s === 'name-desc') return '이름(ㅎ→ㄱ)';
    return '이름(ㄱ→ㅎ)';
  });

  // ---- 검색어 디바운스 (250ms)
  useEffect(() => {
    const t = setTimeout(() => setDq(q), 250);
    return () => clearTimeout(t);
  }, [q]);

  // ---- 상태 → URL 동기화
  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    const params = new URLSearchParams();

    const tabSlug = encodeTabToSlug(activeTab);
    if (tabSlug) params.set('tab', tabSlug);

    if (dq.trim()) params.set('q', dq.trim());
    
    if (roleFilter !== 'all') params.set('role', roleFilter);
    if (experienceFilter !== 'all') params.set('experience', experienceFilter);

    if (sort === '경력(↑→↓)') params.set('sort', 'exp-asc');
    else if (sort === '경력(↓→↑)') params.set('sort', 'exp-desc');
    else if (sort === '이름(ㅎ→ㄱ)') params.set('sort', 'name-desc');

    const qs = params.toString();
    router.push(qs ? `?${qs}` : '?', { scroll: false });
  }, [activeTab, dq, roleFilter, experienceFilter, sort, router]);

  const filtered = useMemo(() => {
    let list = [...all];
    
    // 탭 필터
    if (activeTab !== '전체') {
      list = list.filter((l) => 
        l.practice.some((p) => PRACTICE_MAPPING[p] === activeTab)
      );
    }
    
    // 직책 필터
    if (roleFilter !== 'all') {
      list = list.filter((l) => l.role === roleFilter);
    }
    
    // 경력 필터
    if (experienceFilter === '10+') {
      list = list.filter((l) => l.years >= 10);
    } else if (experienceFilter === '15+') {
      list = list.filter((l) => l.years >= 15);
    }
    
    // 검색어
    const qq = dq.trim();
    if (qq) {
      const k = qq.toLowerCase();
      list = list.filter((l) => {
        const hay = [l.nameKo, l.role ?? '', ...(l.practice ?? [])]
          .join(' ')
          .toLowerCase();
        return hay.includes(k);
      });
    }
    
    // 정렬
    switch (sort) {
      case '경력(↑→↓)':
        list.sort((a, b) => a.years - b.years);
        break;
      case '경력(↓→↑)':
        list.sort((a, b) => b.years - a.years);
        break;
      case '이름(ㅎ→ㄱ)':
        list.sort((a, b) => b.nameKo.localeCompare(a.nameKo, 'ko'));
        break;
      default:
        list.sort((a, b) => a.nameKo.localeCompare(b.nameKo, 'ko'));
    }
    return list;
  }, [all, activeTab, roleFilter, experienceFilter, dq, sort]);

  return {
    activeTab,
    setActiveTab,
    q,
    setQ,
    sort,
    setSort,
    roleFilter,
    setRoleFilter,
    experienceFilter,
    setExperienceFilter,
    filtered,
  };
}

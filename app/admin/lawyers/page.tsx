// app/admin/lawyers/page.tsx
"use client";

import { useEffect, useState } from "react";
import LawyersList from "./LawyersList";
import { supabase } from "@/lib/supabase/client";

type RawLawyer = {
  id: string;
  name: string;
  role: string;
  practice_areas: string[];
  experience_years: number;
  bio: string | null;
  headshot_url: string | null;
  is_active: boolean | null;
  created_at: string;
};

type UiLawyer = {
  id: string;
  name: string;
  role: string;
  practice_areas: string[];
  experience_years: number;
  bio?: string;                 // null -> undefined
  headshot_url?: string;        // null -> undefined
  is_active: boolean;           // null -> false
};

export default function LawyersPage() {
  const [loading, setLoading] = useState(true);
  const [lawyers, setLawyers] = useState<UiLawyer[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data, error } = await supabase
          .from("lawyers")
          .select(
            "id, name, role, practice_areas, experience_years, bio, headshot_url, is_active, created_at"
          )
          .order("created_at", { ascending: false });

        if (error) throw error;

        const rows = (data ?? []) as RawLawyer[];

        // 👇 핵심: null 정규화
        const uiLawyers: UiLawyer[] = rows.map((l) => ({
          ...l,
          bio: l.bio ?? undefined,
          headshot_url: l.headshot_url ?? undefined,
          is_active: l.is_active ?? false,
        }));

        if (mounted) {
          setLawyers(uiLawyers);
          setError(null);
        }
      } catch (e: any) {
        if (mounted) setError(e.message ?? "Failed to load lawyers");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Lawyers</h1>
        <p className="text-gray-600 mt-1">팀원 목록을 관리합니다</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="text-gray-600">Loading…</div>
        ) : error ? (
          <div className="text-red-600">Error: {error}</div>
        ) : lawyers.length === 0 ? (
          <div className="text-gray-600">아직 등록된 변호사가 없습니다.</div>
        ) : (
          // ✅ 여기서 타입이 맞으므로 더 이상 에러 없음
          <LawyersList lawyers={lawyers} />
        )}
      </div>
    </div>
  );
}

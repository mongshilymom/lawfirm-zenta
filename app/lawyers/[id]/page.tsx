"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { LawyerProfile } from "@/components/layouts/LawyerDirectory";

export default function LawyerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lawyer, setLawyer] = useState<LawyerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLawyer();
  }, [params.id]);

  async function loadLawyer() {
    try {
      const { data, error } = await supabase
        .from("lawyers")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) throw error;
      setLawyer(data);
    } catch (error) {
      console.error("변호사 정보 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            변호사를 찾을 수 없습니다
          </h1>
          <button
            onClick={() => router.push("/lawyers")}
            className="text-blue-600 hover:text-blue-800"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => router.push("/lawyers")}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          목록으로
        </button>

        {/* 메인 카드 */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{lawyer.name}</h1>
                {lawyer.specialty && (
                  <p className="text-blue-100 text-lg">{lawyer.specialty}</p>
                )}
                {lawyer.role && (
                  <p className="text-blue-200 text-sm mt-1">{lawyer.role}</p>
                )}
              </div>
              {typeof lawyer.yearsExperience === "number" && (
                <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{lawyer.yearsExperience}</div>
                    <div className="text-sm">년 경력</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 본문 */}
          <div className="p-8 space-y-8">
            {/* 소개 */}
            {lawyer.summary && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">소개</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {lawyer.summary}
                </p>
              </section>
            )}

            {/* 위치 */}
            {lawyer.location && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">위치</h2>
                <div className="flex items-center gap-2 text-gray-700">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {lawyer.location}
                </div>
              </section>
            )}

            {/* 전문 분야 상세 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">전문 분야</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {lawyer.specialty?.split(",").map((spec, idx) => (
                  <div
                    key={idx}
                    className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-center font-medium"
                  >
                    {spec.trim()}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* CTA 버튼 */}
          <div className="bg-gray-50 p-8 border-t">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push("/chat")}
                className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-blue-700 transition"
              >
                상담 신청하기
              </button>
              <button
                onClick={() => window.open(`mailto:${lawyer.email || 'contact@zentalaw.com'}`)}
                className="flex-1 bg-white text-blue-600 py-4 px-6 rounded-xl font-bold text-lg border-2 border-blue-600 hover:bg-blue-50 transition"
              >
                이메일 문의
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface Consultation {
  id: string;
  name: string;
  email: string;
  phone: string;
  case_type: string;
  description: string;
  status: string;
  assigned_lawyer_id: string | null;
  created_at: string;
  assigned_lawyer?: {
    name: string;
  } | null;
}

interface Lawyer {
  id: string;
  name: string;
  specialty: string;
}

export default function AdminConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    loadData();
  }, [filter]);

  async function loadData() {
    setLoading(true);
    try {
      // 상담 내역 로드
      let query = supabase
        .from("consultations")
        .select(`
          *,
          assigned_lawyer:lawyers(name)
        `)
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data: consultationsData } = await query;

      // 변호사 목록 로드
      const { data: lawyersData } = await supabase
        .from("lawyers")
        .select("id, name, specialty")
        .order("name");

      setConsultations(consultationsData || []);
      setLawyers(lawyersData || []);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, newStatus: string) {
    const { error } = await supabase
      .from("consultations")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      loadData();
    }
  }

  async function assignLawyer(consultationId: string, lawyerId: string) {
    // 현재 상담 및 변호사 정보 조회
    const consultation = consultations.find(c => c.id === consultationId);
    const lawyer = lawyers.find(l => l.id === lawyerId);

    const { error } = await supabase
      .from("consultations")
      .update({ 
        assigned_lawyer_id: lawyerId,
        status: "assigned"
      })
      .eq("id", consultationId);

    if (!error) {
      loadData();
      
      // 변호사 배정 이메일 발송
      if (consultation && lawyer) {
        fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "lawyer_assigned",
            data: {
              client_email: consultation.email,
              client_name: consultation.name,
              lawyer_name: lawyer.name,
              lawyer_specialty: lawyer.specialty,
            },
          }),
        }).catch((error) => console.warn("Email notification failed:", error));
      }
    }
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    assigned: "bg-blue-100 text-blue-800",
    in_progress: "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-gray-100 text-gray-800",
  };

  const statusLabels: Record<string, string> = {
    pending: "대기중",
    assigned: "배정완료",
    in_progress: "진행중",
    completed: "완료",
    cancelled: "취소",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            상담 관리 대시보드
          </h1>
          <p className="text-gray-600">
            총 {consultations.length}건의 상담이 등록되어 있습니다
          </p>
        </div>

        {/* 필터 */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {["all", "pending", "assigned", "in_progress", "completed", "cancelled"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === status
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status === "all" ? "전체" : statusLabels[status]}
                </button>
              )
            )}
          </div>
        </div>

        {/* 상담 목록 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">로딩중...</p>
          </div>
        ) : consultations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">상담 내역이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-4">
            {consultations.map((consultation) => (
              <div
                key={consultation.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* 상담자 정보 */}
                  <div>
                    <h3 className="font-bold text-lg mb-2">
                      {consultation.name}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>📧 {consultation.email}</p>
                      <p>📞 {consultation.phone}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(consultation.created_at).toLocaleString("ko-KR")}
                      </p>
                    </div>
                  </div>

                  {/* 상담 내용 */}
                  <div>
                    <div className="mb-2">
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        {consultation.case_type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {consultation.description}
                    </p>
                  </div>

                  {/* 관리 */}
                  <div className="space-y-3">
                    {/* 상태 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        상태
                      </label>
                      <select
                        value={consultation.status}
                        onChange={(e) =>
                          updateStatus(consultation.id, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 변호사 배정 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        담당 변호사
                      </label>
                      <select
                        value={consultation.assigned_lawyer_id || ""}
                        onChange={(e) =>
                          assignLawyer(consultation.id, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">미배정</option>
                        {lawyers.map((lawyer) => (
                          <option key={lawyer.id} value={lawyer.id}>
                            {lawyer.name} ({lawyer.specialty})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 상태 뱃지 */}
                    <div className="pt-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          statusColors[consultation.status]
                        }`}
                      >
                        {statusLabels[consultation.status]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

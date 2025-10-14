"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Clock, User, Mail, Phone, FileText, CheckCircle, XCircle } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Consultation {
  id: string;
  visitor_name: string;
  visitor_email: string;
  visitor_phone: string;
  legal_issue: string;
  status: "active" | "completed" | "assigned";
  assigned_lawyer_id?: string;
  assigned_lawyer?: {
    id: string;
    name: string;
    role: string;
  };
  created_at: string;
}

interface Lawyer {
  id: string;
  name: string;
  role: string;
  practice_areas: string[];
}

interface Props {
  consultations: Consultation[];
  lawyers: Lawyer[];
}

export default function ConsultationsDashboard({ consultations: initialConsultations, lawyers }: Props) {
  const [consultations, setConsultations] = useState(initialConsultations);
  const [filter, setFilter] = useState<"all" | "active" | "assigned" | "completed">("all");

  const filteredConsultations = consultations.filter((c) => {
    if (filter === "all") return true;
    return c.status === filter;
  });

  const handleStatusChange = async (consultationId: string, newStatus: Consultation["status"]) => {
    const { error } = await supabase
      .from("consultations")
      .update({ status: newStatus })
      .eq("id", consultationId);

    if (error) {
      alert("상태 변경 실패: " + error.message);
      return;
    }

    setConsultations((prev) =>
      prev.map((c) => (c.id === consultationId ? { ...c, status: newStatus } : c))
    );
  };

  const handleAssignLawyer = async (consultationId: string, lawyerId: string) => {
    const { error } = await supabase
      .from("consultations")
      .update({ 
        assigned_lawyer_id: lawyerId,
        status: "assigned"
      })
      .eq("id", consultationId);

    if (error) {
      alert("변호사 배정 실패: " + error.message);
      return;
    }

    const lawyer = lawyers.find((l) => l.id === lawyerId);
    setConsultations((prev) =>
      prev.map((c) =>
        c.id === consultationId
          ? { ...c, assigned_lawyer_id: lawyerId, assigned_lawyer: lawyer as any, status: "assigned" }
          : c
      )
    );
  };

  const getStatusBadge = (status: Consultation["status"]) => {
    const styles = {
      active: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      assigned: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      completed: "bg-green-500/10 text-green-400 border-green-500/20",
    };

    const labels = {
      active: "대기중",
      assigned: "배정됨",
      completed: "완료",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const stats = {
    total: consultations.length,
    active: consultations.filter((c) => c.status === "active").length,
    assigned: consultations.filter((c) => c.status === "assigned").length,
    completed: consultations.filter((c) => c.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      {/* 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <div className="text-slate-400 text-sm mb-1">전체 상담</div>
          <div className="text-3xl font-bold text-parchment">{stats.total}</div>
        </div>
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-6">
          <div className="text-blue-400 text-sm mb-1">대기중</div>
          <div className="text-3xl font-bold text-blue-400">{stats.active}</div>
        </div>
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6">
          <div className="text-amber-400 text-sm mb-1">배정됨</div>
          <div className="text-3xl font-bold text-amber-400">{stats.assigned}</div>
        </div>
        <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-6">
          <div className="text-green-400 text-sm mb-1">완료</div>
          <div className="text-3xl font-bold text-green-400">{stats.completed}</div>
        </div>
      </div>

      {/* 필터 */}
      <div className="flex gap-2">
        {(["all", "active", "assigned", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? "bg-amber-600 text-white"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            {f === "all" ? "전체" : f === "active" ? "대기중" : f === "assigned" ? "배정됨" : "완료"}
          </button>
        ))}
      </div>

      {/* 상담 목록 */}
      <div className="space-y-4">
        {filteredConsultations.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            상담 내역이 없습니다
          </div>
        ) : (
          filteredConsultations.map((consultation) => (
            <div
              key={consultation.id}
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusBadge(consultation.status)}
                  <span className="text-xs text-slate-500">
                    {new Date(consultation.created_at).toLocaleString("ko-KR")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-slate-500" />
                  <span className="text-parchment">{consultation.visitor_name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">{consultation.visitor_email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">{consultation.visitor_phone}</span>
                </div>
                {consultation.assigned_lawyer && (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-amber-500" />
                    <span className="text-amber-400">
                      {consultation.assigned_lawyer.name} ({consultation.assigned_lawyer.role})
                    </span>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                  <FileText className="w-4 h-4" />
                  상담 내용
                </div>
                <p className="text-parchment text-sm leading-relaxed bg-slate-800/50 rounded-lg p-3">
                  {consultation.legal_issue}
                </p>
              </div>

              <div className="flex gap-2">
                <select
                  value={consultation.assigned_lawyer_id || ""}
                  onChange={(e) => handleAssignLawyer(consultation.id, e.target.value)}
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-parchment"
                >
                  <option value="">변호사 선택</option>
                  {lawyers.map((lawyer) => (
                    <option key={lawyer.id} value={lawyer.id}>
                      {lawyer.name} ({lawyer.role})
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleStatusChange(consultation.id, "completed")}
                  disabled={consultation.status === "completed"}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  완료 처리
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

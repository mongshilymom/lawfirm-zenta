import { createServerSupabase } from "@/lib/supabase/server";
import Link from "next/link";
import type { Database } from "@/lib/supabase/types";

type Consultation = Database["public"]["Tables"]["consultations"]["Row"];

async function getConsultations(): Promise<Consultation[]> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("consultations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Failed to load consultations:", error);
    return [];
  }
  return (data as unknown as Consultation[]) || [];
}

export default async function AdminConsultationsPage() {
  const consultations = await getConsultations();

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-parchment mb-2">상담 관리</h1>
        <p className="text-slate-400">AI 챗 상담 신청 내역을 확인하고 관리합니다</p>
      </header>

      <div className="rounded-xl border border-slate-800 bg-slate-950/50 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-900 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-parchment">이름</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-parchment">연락처</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-parchment">상담 분야</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-parchment">상태</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-parchment">신청일시</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-parchment">액션</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {consultations.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  아직 상담 신청 내역이 없습니다
                </td>
              </tr>
            ) : (
              consultations.map((consultation) => (
                <tr key={consultation.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-parchment">{consultation.visitor_name || "-"}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {consultation.visitor_email && <div>{consultation.visitor_email}</div>}
                    {consultation.visitor_phone && <div className="text-slate-400">{consultation.visitor_phone}</div>}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">{consultation.legal_issue || "-"}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      consultation.status === "active" ? "bg-green-500/10 text-green-500" :
                      consultation.status === "assigned" ? "bg-blue-500/10 text-blue-500" :
                      "bg-slate-500/10 text-slate-400"
                    }`}>
                      {consultation.status === "active" ? "진행중" : consultation.status === "assigned" ? "배정됨" : "완료"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {new Date(consultation.created_at).toLocaleString("ko-KR")}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/consultations/${consultation.id}` as any}
                      className="text-amber-500 hover:text-amber-400 text-sm font-medium"
                    >
                      상세보기
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className="text-sm text-slate-400">
          총 {consultations.length}건의 상담 신청
        </div>
        <Link 
          href="/"
          className="text-amber-500 hover:text-amber-400 text-sm font-medium"
        >
          ← 홈으로 돌아가기
        </Link>
      </div>
    </main>
  );
}

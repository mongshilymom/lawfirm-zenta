import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createServerSupabase();

    // 현재 날짜 기준 계산
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay()); // 이번 주 일요일

    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(thisWeekStart.getDate() - 7);

    const lastWeekEnd = new Date(thisWeekStart);
    lastWeekEnd.setDate(thisWeekStart.getDate() - 1);

    // 1. 총 상담 건수
    const { count: totalConsultations } = await supabase
      .from("consultations")
      .select("id", { count: "exact", head: true });

    // 2. 이번 주 상담 건수
    const { count: consultationsThisWeek } = await supabase
      .from("consultations")
      .select("id", { count: "exact", head: true })
      .gte("created_at", thisWeekStart.toISOString());

    // 3. 지난 주 상담 건수
    const { count: consultationsLastWeek } = await supabase
      .from("consultations")
      .select("id", { count: "exact", head: true })
      .gte("created_at", lastWeekStart.toISOString())
      .lte("created_at", lastWeekEnd.toISOString());

    // 4. 주간 변화율 계산
    const weeklyChange =
      consultationsLastWeek && consultationsLastWeek > 0
        ? ((consultationsThisWeek! - consultationsLastWeek) / consultationsLastWeek) * 100
        : consultationsThisWeek! > 0
        ? 100
        : 0;

    // 5. 변호사별 상담 건수 (TOP 3)
    const { data: lawyersData } = await supabase.from("lawyers").select("id, name");

    const lawyersWithCounts = await Promise.all(
      (lawyersData || []).map(async (lawyer) => {
        const { count } = await supabase
          .from("consultations")
          .select("id", { count: "exact", head: true })
          .eq("lawyer_id", lawyer.id);

        return {
          name: lawyer.name,
          consultations: count || 0,
        };
      })
    );

    const topLawyers = lawyersWithCounts
      .sort((a, b) => b.consultations - a.consultations)
      .slice(0, 3);

    // 6. 월별 추이 (최근 6개월)
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlyTrend: Array<{ month: string; count: number }> = [];
    for (let i = 0; i < 6; i++) {
      const monthStart = new Date(sixMonthsAgo);
      monthStart.setMonth(sixMonthsAgo.getMonth() + i);
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthStart.getMonth() + 1);

      const { count } = await supabase
        .from("consultations")
        .select("id", { count: "exact", head: true })
        .gte("created_at", monthStart.toISOString())
        .lt("created_at", monthEnd.toISOString());

      monthlyTrend.push({
        month: monthStart.toLocaleDateString("ko-KR", { month: "short" }),
        count: count || 0,
      });
    }

    // 7. 상담 상태별 분포
    const { data: allConsultations } = await supabase
      .from("consultations")
      .select("status");

    const statusCounts: Record<string, number> = {
      대기중: 0,
      진행중: 0,
      완료: 0,
      취소: 0,
    };

    (allConsultations || []).forEach((consultation) => {
      const status = consultation.status || "대기중";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: totalConsultations ? (count / totalConsultations) * 100 : 0,
    }));

    // 응답 반환
    return NextResponse.json({
      totalConsultations: totalConsultations || 0,
      consultationsThisWeek: consultationsThisWeek || 0,
      consultationsLastWeek: consultationsLastWeek || 0,
      weeklyChange,
      topLawyers,
      monthlyTrend,
      statusDistribution,
    });
  } catch (error) {
    console.error("통계 조회 오류:", error);
    return NextResponse.json(
      {
        error: "통계를 불러오는 중 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

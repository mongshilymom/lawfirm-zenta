"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Users, MessageSquare, Calendar } from "lucide-react";

interface DashboardStats {
  totalConsultations: number;
  consultationsThisWeek: number;
  consultationsLastWeek: number;
  weeklyChange: number;
  topLawyers: Array<{
    name: string;
    consultations: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    count: number;
  }>;
  statusDistribution: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
}

export default function StatsDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("통계 로딩 실패:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const isPositiveChange = stats.weeklyChange >= 0;

  return (
    <div className="space-y-6">
      {/* 주요 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 이번 주 상담 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">이번 주 상담</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.consultationsThisWeek}
              </p>
              <div className="flex items-center mt-2">
                {isPositiveChange ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span
                  className={`text-sm font-medium ${
                    isPositiveChange ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isPositiveChange ? "+" : ""}
                  {stats.weeklyChange.toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500 ml-2">vs 지난 주</span>
              </div>
            </div>
            <div className="bg-blue-100 text-blue-600 text-3xl p-3 rounded-full">
              <MessageSquare />
            </div>
          </div>
        </div>

        {/* 총 상담 건수 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">총 상담 건수</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalConsultations}
              </p>
              <p className="text-sm text-gray-500 mt-2">전체 누적</p>
            </div>
            <div className="bg-green-100 text-green-600 text-3xl p-3 rounded-full">
              <Calendar />
            </div>
          </div>
        </div>

        {/* 인기 변호사 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-600">TOP 변호사</p>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {stats.topLawyers.slice(0, 3).map((lawyer, index) => (
              <div key={lawyer.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 ${
                      index === 0
                        ? "bg-yellow-100 text-yellow-700"
                        : index === 1
                        ? "bg-gray-100 text-gray-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-700">{lawyer.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {lawyer.consultations}건
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 월별 추이 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">월별 상담 추이</h3>
        <div className="space-y-3">
          {stats.monthlyTrend.map((month) => {
            const maxCount = Math.max(...stats.monthlyTrend.map((m) => m.count));
            const percentage = (month.count / maxCount) * 100;

            return (
              <div key={month.month} className="flex items-center">
                <span className="text-sm font-medium text-gray-600 w-20">
                  {month.month}
                </span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-8 relative overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                      style={{ width: `${percentage}%` }}
                    >
                      <span className="text-xs font-bold text-white">{month.count}건</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 상담 상태별 분포 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">상담 상태별 분포</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.statusDistribution.map((status) => (
            <div key={status.status} className="border rounded-lg p-4">
              <p className="text-sm font-medium text-gray-600">{status.status}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{status.count}건</p>
              <div className="mt-2">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${status.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{status.percentage.toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

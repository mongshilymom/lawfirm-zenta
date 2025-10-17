import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { getAdminSession } from "@/lib/auth/session";
import StatsDashboard from "@/components/admin/StatsDashboard";

export default async function AdminDashboard() {
  // ✅ 인증 체크 - 로그인 안 되어 있으면 로그인 페이지로
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const supabase = createServerSupabase();

  // Get counts
  const [lawyersRes, casesRes, faqsRes, contactsRes] = await Promise.all([
    supabase.from("lawyers").select("id", { count: "exact", head: true }),
    supabase.from("case_studies").select("id", { count: "exact", head: true }),
    supabase.from("faqs").select("id", { count: "exact", head: true }),
    supabase.from("consultations").select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    {
      name: "Lawyers",
      count: lawyersRes.count || 0,
      href: "/admin/lawyers",
      icon: "👔",
      color: "bg-blue-500",
    },
    {
      name: "Case Studies",
      count: casesRes.count || 0,
      href: "/admin/cases",
      icon: "📋",
      color: "bg-green-500",
    },
    {
      name: "FAQs",
      count: faqsRes.count || 0,
      href: "/admin/faqs",
      icon: "❓",
      color: "bg-yellow-500",
    },
    {
      name: "Consultations",
      count: contactsRes.count || 0,
      href: "/admin/consultations",
      icon: "💬",
      color: "bg-purple-500",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage your law firm website content</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href as any}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.count}</p>
              </div>
              <div className={`${stat.color} text-white text-3xl p-3 rounded-full`}>
                {stat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 📊 통계 대시보드 추가 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 통계 대시보드</h2>
        <StatsDashboard />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/lawyers/new"
            className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <span className="mr-2">➕</span> Add New Lawyer
          </Link>
          <Link
            href="/admin/cases/new"
            className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <span className="mr-2">➕</span> Add Case Study
          </Link>
          <Link
            href="/admin/faqs/new"
            className="flex items-center justify-center px-4 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
          >
            <span className="mr-2">➕</span> Add FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}

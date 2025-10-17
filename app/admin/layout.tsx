import { getAdminSession } from "@/lib/auth/session";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ Middleware에서 이미 체크하지만, 세션 정보는 필요
  const session = await getAdminSession();

  // ✅ 로그인 페이지는 네비게이션 없이 렌더링
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }

  // ✅ 로그인된 경우: 네비게이션 포함
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation */}
      <AdminNav session={session} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}

import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/session";
import AdminLoginForm from "./AdminLoginForm";

export default async function AdminLoginPage() {
  // ✅ 이미 로그인 되어 있으면 대시보드로
  const session = await getAdminSession();
  if (session) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <AdminLoginForm />
    </div>
  );
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ /admin 경로 체크
  if (pathname.startsWith("/admin")) {
    // ✅ 로그인 페이지는 제외
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    // ✅ Supabase 세션 쿠키 체크
    const accessToken = request.cookies.get("sb-access-token");

    // ✅ 세션 없으면 로그인 페이지로
    if (!accessToken) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// ✅ admin 경로에만 적용
export const config = {
  matcher: "/admin/:path*",
};

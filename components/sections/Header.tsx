"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    // 현재 사용자 세션 확인
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-ink/95 backdrop-blur supports-[backdrop-filter]:bg-ink/80">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* 로고 */}
        <Link 
          href="/" 
          className="text-2xl font-bold text-amber-500 hover:text-amber-400 transition-colors"
        >
          Zenta Law
        </Link>
        
        {/* 데스크톱 메뉴 */}
        <ul className="hidden md:flex items-center gap-8">
          <li>
            <Link 
              href="/" 
              className="text-parchment hover:text-amber-500 transition-colors"
            >
              ZENTA
            </Link>
          </li>
          <li>
            <Link 
              href="/lawyers" 
              className="text-parchment hover:text-amber-500 transition-colors"
            >
              변호사
            </Link>
          </li>
          <li>
            <Link 
              href="/chat" 
              className="rounded-full bg-amber-600 px-4 py-2 text-sm font-medium text-ink hover:bg-amber-500 transition-colors"
            >
              Legal Chat
            </Link>
          </li>
          
          {/* 로그인/로그아웃 */}
          {user ? (
            <li className="flex items-center gap-4">
              <span className="text-sm text-parchment/70">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-amber-600 px-4 py-2 text-sm font-medium text-amber-600 hover:bg-amber-600 hover:text-ink transition-colors"
              >
                로그아웃
              </button>
            </li>
          ) : (
            <li>
              <Link
                href="/login"
                className="rounded-full border border-amber-600 px-4 py-2 text-sm font-medium text-amber-600 hover:bg-amber-600 hover:text-ink transition-colors"
              >
                로그인
              </Link>
            </li>
          )}
        </ul>

        {/* 모바일 햄버거 버튼 */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-parchment focus:outline-none"
          aria-label="메뉴 열기"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* 모바일 메뉴 */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-ink/98 backdrop-blur">
          <ul className="container mx-auto space-y-4 px-4 py-6">
            <li>
              <Link 
                href="/" 
                onClick={() => setMenuOpen(false)}
                className="block text-parchment hover:text-amber-500 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/lawyers" 
                onClick={() => setMenuOpen(false)}
                className="block text-parchment hover:text-amber-500 transition-colors"
              >
                변호사
              </Link>
            </li>
            <li>
              <Link 
                href="/chat" 
                onClick={() => setMenuOpen(false)}
                className="block rounded-full bg-amber-600 px-4 py-2 text-center text-sm font-medium text-ink hover:bg-amber-500 transition-colors"
              >
                Legal Chat
              </Link>
            </li>
            
            {/* 모바일 로그인/로그아웃 */}
            {user ? (
              <>
                <li className="text-sm text-parchment/70 pt-4 border-t border-slate-800">
                  {user.email}
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="block w-full rounded-full border border-amber-600 px-4 py-2 text-center text-sm font-medium text-amber-600 hover:bg-amber-600 hover:text-ink transition-colors"
                  >
                    로그아웃
                  </button>
                </li>
              </>
            ) : (
              <li className="pt-4 border-t border-slate-800">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full rounded-full border border-amber-600 px-4 py-2 text-center text-sm font-medium text-amber-600 hover:bg-amber-600 hover:text-ink transition-colors"
                >
                  로그인
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}

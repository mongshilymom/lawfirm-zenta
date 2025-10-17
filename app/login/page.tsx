"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      setMessage("회원가입 이메일을 확인해주세요!");
    } catch (err: any) {
      setError(err.message || "회원가입 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* 헤더 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-brass">
            Zenta Law
          </h1>
          <p className="mt-2 text-parchment/80">
            법률 전문가 계정 로그인
          </p>
        </div>

        {/* 로그인 폼 */}
        <div className="rounded-lg border border-slate-800 bg-obsidian p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* 이메일 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-parchment">
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-slate-700 bg-ink px-3 py-2 text-parchment placeholder-gray-500 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass"
                placeholder="your@email.com"
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-parchment">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-slate-700 bg-ink px-3 py-2 text-parchment placeholder-gray-500 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass"
                placeholder="••••••••"
              />
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="rounded-md bg-red-900/20 border border-red-800 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* 성공 메시지 */}
            {message && (
              <div className="rounded-md bg-green-900/20 border border-green-800 p-3 text-sm text-green-400">
                {message}
              </div>
            )}

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-brass px-4 py-2 text-sm font-semibold text-ink hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-brass focus:ring-offset-2 focus:ring-offset-ink disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>

            {/* 회원가입 버튼 */}
            <button
              type="button"
              onClick={handleSignup}
              disabled={loading}
              className="w-full rounded-md border border-brass px-4 py-2 text-sm font-semibold text-brass hover:bg-brass/10 focus:outline-none focus:ring-2 focus:ring-brass focus:ring-offset-2 focus:ring-offset-ink disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "처리 중..." : "회원가입"}
            </button>
          </form>

          {/* 홈으로 돌아가기 */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-parchment/70 hover:text-brass transition-colors"
            >
              ← 홈으로 돌아가기
            </Link>
          </div>
        </div>

        {/* 안내 */}
        <p className="text-center text-xs text-parchment/60">
          로그인 시 개인정보 처리방침 및 서비스 약관에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}

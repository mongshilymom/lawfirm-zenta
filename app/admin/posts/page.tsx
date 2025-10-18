import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";

// Supabase insights 행 타입(안전하게 선택 필드 포함)
type InsightRow = {
  id: number;
  title: string;
  body: string | null;
  source_url: string | null;
  published_at: string | null;
  status?: "draft" | "published" | "archived" | null;
  excerpt?: string | null;
  created_at?: string | null;
};

// excerpt가 없으면 body에서 100자 요약 생성
const getExcerpt = (p: InsightRow) => {
  const raw =
    (typeof p.excerpt === "string" && p.excerpt) ? p.excerpt :
    (typeof p.body === "string" && p.body) ? p.body : "";
  const plain = raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return plain.length > 100 ? plain.slice(0, 100) + "…" : plain;
};

const fmtDate = (s?: string | null) =>
  s ? new Date(s).toLocaleDateString("ko-KR") : "—";

export default async function PostsPage() {
  const supabase = createServerSupabase();

  // 포스트 목록 가져오기(발행일 최신순)
  const { data, error } = await supabase
    .from("insights")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-md">
        <p className="text-red-600">포스트를 불러오는 중 오류가 발생했습니다.</p>
      </div>
    );
  }

  const posts = (data ?? []) as InsightRow[];

  return (
    <div>
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">블로그 포스트</h1>
          <p className="text-gray-600 mt-1">블로그 콘텐츠를 관리하세요</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          + 새 포스트
        </Link>
      </div>

      {/* 포스트 테이블 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {posts.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">제목</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작성/발행</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">액션</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{post.title}</div>
                    <div className="text-sm text-gray-500">{getExcerpt(post)}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        post.status === "published"
                          ? "bg-green-100 text-green-800"
                          : post.status === "draft"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {post.status ?? "published"}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {fmtDate(post.published_at ?? post.created_at ?? null)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      편집
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg mb-4">아직 포스트가 없습니다</p>
            <Link
              href="/admin/posts/new"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              첫 포스트 작성하기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    status: "draft",
    cover_image: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("포스트 생성 실패");

      router.push("/admin/posts");
      router.refresh();
    } catch (error) {
      alert("오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  // 제목에서 slug 자동 생성
  const handleTitleChange = (value: string) => {
    setFormData({
      ...formData,
      title: value,
      slug: value
        .toLowerCase()
        .replace(/[^a-z0-9가-힣\s-]/g, "")
        .replace(/\s+/g, "-"),
    });
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">새 포스트 작성</h1>
        <p className="text-gray-600 mt-1">블로그 포스트를 작성하세요</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* 제목 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            제목 *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="포스트 제목을 입력하세요"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL Slug *
          </label>
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="url-friendly-slug"
          />
          <p className="text-xs text-gray-500 mt-1">
            URL: /blog/{formData.slug || "slug"}
          </p>
        </div>

        {/* 요약 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            요약
          </label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="포스트 요약 (150자 이내)"
          />
        </div>

        {/* 내용 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            내용 *
          </label>
          <textarea
            required
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={15}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="마크다운 또는 일반 텍스트로 작성하세요"
          />
        </div>

        {/* 커버 이미지 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            커버 이미지
          </label>
          
          <ImageUpload
            onImageUploaded={(url) => setFormData({ ...formData, cover_image: url })}
            bucket="page-images"
          />
          
          {formData.cover_image && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2">현재 이미지:</p>
              <img 
                src={formData.cover_image} 
                alt="Cover" 
                className="w-full max-w-md h-auto rounded border"
              />
            </div>
          )}
          
          <input
            type="url"
            value={formData.cover_image}
            onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 mt-3"
            placeholder="또는 URL을 직접 입력: https://example.com/image.jpg"
          />
        </div>

        {/* 상태 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            상태 *
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="draft">초안</option>
            <option value="published">게시됨</option>
            <option value="archived">보관됨</option>
          </select>
        </div>

        {/* 버튼 */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "저장 중..." : "포스트 생성"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

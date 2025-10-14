"use client";

import { useState } from "react";
import { Phone, Mail, MessageSquare, X } from "lucide-react";

interface QuickContactFormProps {
  onClose: () => void;
}

export default function QuickContactForm({ onClose }: QuickContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    consultationType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const consultationTypes = [
    "형사",
    "민사",
    "가족/이혼",
    "부동산",
    "기업/상사",
    "지적재산권",
    "노동",
    "세금/조세",
    "행정",
    "기타",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Supabase에 저장
      const response = await fetch("/api/quick-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to submit");

      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("문의 신청 실패:", error);
      alert("문의 신청에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
        <div className="relative w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-2xl border border-amber-600/20 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600/10 border border-green-600/20">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-serif text-2xl text-parchment mb-2">
            문의가 접수되었습니다
          </h3>
          <p className="text-sm text-slate-400">
            담당 변호사가 24시간 내에 연락드리겠습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 p-8 shadow-2xl border border-slate-700">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-parchment transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* 헤더 */}
        <header className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-600/10 border border-amber-600/20">
            <MessageSquare className="h-7 w-7 text-amber-500" />
          </div>
          <h2 className="font-serif text-3xl text-parchment mb-2">
            빠른 상담 신청
          </h2>
          <p className="text-sm text-slate-400">
            간단한 정보만 남겨주시면<br />
            전문 변호사가 직접 연락드립니다
          </p>
        </header>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-parchment mb-2">
              <Phone className="w-4 h-4 text-amber-500" />
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-parchment placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              placeholder="홍길동"
            />
          </div>

          <div>
            <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-parchment mb-2">
              <Phone className="w-4 h-4 text-amber-500" />
              연락처 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-parchment placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              placeholder="010-1234-5678"
            />
          </div>

          <div>
            <label htmlFor="consultationType" className="flex items-center gap-2 text-sm font-medium text-parchment mb-2">
              <Mail className="w-4 h-4 text-amber-500" />
              상담 분야 <span className="text-red-500">*</span>
            </label>
            <select
              id="consultationType"
              name="consultationType"
              required
              value={formData.consultationType}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-parchment focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
            >
              <option value="">선택해주세요</option>
              {consultationTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="message" className="flex items-center gap-2 text-sm font-medium text-parchment mb-2">
              <MessageSquare className="w-4 h-4 text-amber-500" />
              간단한 문의 내용
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              value={formData.message}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-parchment placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none transition-all"
              placeholder="예: 계약서 검토가 필요합니다"
            />
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-4 text-base font-semibold text-white hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-600/20 hover:shadow-amber-500/30"
          >
            {isSubmitting ? "전송 중..." : "무료 상담 신청"}
          </button>
        </form>

        {/* 안내 문구 */}
        <footer className="mt-4 text-center">
          <p className="text-xs text-slate-500">
            ⚡ 평균 2시간 내 연락 • 상담료 무료
          </p>
        </footer>
      </div>
    </div>
  );
}

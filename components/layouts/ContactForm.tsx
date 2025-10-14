"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => void;
  onClose: () => void;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  legalIssue: string;
}

export default function ContactForm({ onSubmit, onClose }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    legalIssue: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 헤더 */}
        <header className="mb-6">
          <h2 className="font-serif text-2xl text-parchment mb-2">
            상담 신청
          </h2>
          <p className="text-sm text-slate-400">
            전문 변호사가 빠르게 연락드리겠습니다
          </p>
        </header>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-parchment mb-1">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-parchment placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              placeholder="홍길동"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-parchment mb-1">
              이메일 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-parchment placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-parchment mb-1">
              연락처 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-parchment placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              placeholder="010-1234-5678"
            />
          </div>

          <div>
            <label htmlFor="legalIssue" className="block text-sm font-medium text-parchment mb-1">
              상담 내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="legalIssue"
              name="legalIssue"
              required
              rows={4}
              value={formData.legalIssue}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-parchment placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"
              placeholder="상담하고 싶은 법률 문제를 간단히 설명해주세요"
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-slate-700 px-4 py-3 text-sm font-medium text-parchment hover:bg-slate-800 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-full bg-amber-600 px-4 py-3 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "제출 중..." : "상담 신청"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

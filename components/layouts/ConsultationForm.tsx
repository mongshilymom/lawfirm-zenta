"use client";

import { useState } from "react";
import { X, UserCircle, Mail, Phone, FileText } from "lucide-react";

interface ConsultationFormProps {
  onSubmit: (data: ConsultationFormData) => void;
  onClose: () => void;
}

export interface ConsultationFormData {
  name: string;
  email: string;
  phone: string;
  legalIssue: string;
}

export default function ConsultationForm({ onSubmit, onClose }: ConsultationFormProps) {
  const [formData, setFormData] = useState<ConsultationFormData>({
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
    <div className="flex h-[calc(100vh-12rem)] items-center justify-center">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900/95 backdrop-blur p-8 shadow-2xl">
        {/* 헤더 */}
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-600/10 border border-amber-600/20">
            <FileText className="h-8 w-8 text-amber-500" />
          </div>
          <h2 className="font-serif text-3xl text-parchment mb-3">
            AI 법률 상담 시작
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            간단한 정보를 입력하시면 24시간 AI 상담사가<br />
            즉시 법률 상담을 시작합니다
          </p>
        </header>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-parchment mb-2">
              <UserCircle className="w-4 h-4 text-amber-500" />
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
            <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-parchment mb-2">
              <Mail className="w-4 h-4 text-amber-500" />
              이메일 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-parchment placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              placeholder="example@email.com"
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
            <label htmlFor="legalIssue" className="flex items-center gap-2 text-sm font-medium text-parchment mb-2">
              <FileText className="w-4 h-4 text-amber-500" />
              상담 내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="legalIssue"
              name="legalIssue"
              required
              rows={4}
              value={formData.legalIssue}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-parchment placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none transition-all"
              placeholder="예: 계약서 검토가 필요합니다. 부동산 계약 관련 문의사항이 있습니다."
            />
          </div>

          {/* 버튼 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-4 text-base font-semibold text-white hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-600/20 hover:shadow-amber-500/30"
          >
            {isSubmitting ? "상담 시작 중..." : "AI 상담 시작하기"}
          </button>
        </form>

        {/* 안내 문구 */}
        <footer className="mt-6 text-center">
          <p className="text-xs text-slate-500 leading-relaxed">
            입력하신 정보는 안전하게 보호되며<br />
            상담 목적으로만 사용됩니다
          </p>
        </footer>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 상담 신청 API 호출
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitor_name: formData.name,
          visitor_email: formData.email,
          visitor_phone: formData.phone,
          legal_issue: `${formData.subject}\n\n${formData.message}`,
        }),
      });

      if (!res.ok) throw new Error("문의 접수 실패");

      // 이메일 알림 발송
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "consultation_created",
          data: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            case_type: formData.subject,
            description: formData.message,
            created_at: new Date().toISOString(),
          },
        }),
      });

      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      alert("문의 접수 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          <h1 className="mb-4 font-serif text-4xl text-parchment">
            Contact Us
          </h1>
          <p className="text-lg text-zinc-400">
            Have a question or need legal assistance? Fill out the form below and we&apos;ll get back to you within 24 hours.
          </p>
        </header>

        {success && (
          <div className="mb-6 rounded-lg bg-green-900/20 border border-green-700 p-4">
            <p className="text-green-400">
              ✅ 문의가 성공적으로 접수되었습니다! 24시간 내에 연락드리겠습니다.
            </p>
          </div>
        )}

        <form 
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-zinc-800 bg-obsidian/80 p-8"
        >
          {/* Name */}
          <div>
            <label 
              htmlFor="name" 
              className="mb-2 block text-sm font-medium text-parchment"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-parchment placeholder:text-zinc-500 focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/20"
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label 
              htmlFor="email" 
              className="mb-2 block text-sm font-medium text-parchment"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-parchment placeholder:text-zinc-500 focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/20"
              placeholder="john@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label 
              htmlFor="phone" 
              className="mb-2 block text-sm font-medium text-parchment"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-parchment placeholder:text-zinc-500 focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/20"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          {/* Subject */}
          <div>
            <label 
              htmlFor="subject" 
              className="mb-2 block text-sm font-medium text-parchment"
            >
              Subject <span className="text-red-500">*</span>
            </label>
            <select
              id="subject"
              name="subject"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-parchment focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/20"
            >
              <option value="">상담 분야 선택</option>
              <option value="민사소송">민사소송</option>
              <option value="형사변호">형사변호</option>
              <option value="가족법">가족법</option>
              <option value="부동산">부동산</option>
              <option value="기업법무">기업법무</option>
              <option value="기타">기타</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label 
              htmlFor="message" 
              className="mb-2 block text-sm font-medium text-parchment"
            >
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-parchment placeholder:text-zinc-500 focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/20"
              placeholder="Please describe your legal matter..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brass px-8 py-4 font-semibold text-obsidian transition-colors hover:bg-brass/90 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {loading ? "전송 중..." : "Send Message"}
          </button>
        </form>

        {/* Contact Info */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-obsidian/60 p-6">
            <h3 className="mb-2 font-semibold text-brass">Email</h3>
            <p className="text-zinc-400">admin@youalta.net</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-obsidian/60 p-6">
            <h3 className="mb-2 font-semibold text-brass">Phone</h3>
            <p className="text-zinc-400">+1 (555) 123-4567</p>
          </div>
        </div>
      </div>
    </main>
  );
}

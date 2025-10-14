"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import ConsultationForm from "./ConsultationForm";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export default function ChatInterface() {
  const [showForm, setShowForm] = useState(true);
  const [consultationId, setConsultationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFormSubmit = async (data: { name: string; email: string; phone: string; legalIssue: string }) => {
    try {
      const { data: consultation, error } = await supabase
        .from("consultations")
        .insert({
          visitor_name: data.name,
          visitor_email: data.email,
          visitor_phone: data.phone,
          legal_issue: data.legalIssue,
          status: "active",
        })
        .select()
        .single();

      if (error) throw error;

      setConsultationId(consultation.id);
      setShowForm(false);
      
      const welcomeMessage: Message = {
        id: "welcome",
        role: "assistant",
        content: `${data.name}님, 안녕하세요! ${data.legalIssue} 관련 상담을 도와드리겠습니다. 어떤 문제로 도움이 필요하신가요?`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);

      await supabase.from("chat_messages").insert({
        consultation_id: consultation.id,
        role: "assistant",
        content: welcomeMessage.content,
      });

      // 이메일 알림 발송 (실패해도 상담은 계속 진행)
      fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "consultation_created",
          data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            case_type: data.legalIssue,
            description: data.legalIssue,
            created_at: consultation.created_at,
          },
        }),
      }).catch((error) => console.warn("Email notification failed:", error));
    } catch (error) {
      console.error("Failed to create consultation:", error);
      alert("상담 신청에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !consultationId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      await supabase.from("chat_messages").insert({
        consultation_id: consultationId,
        role: "user",
        content: userMessage.content,
      });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          consultationId,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      await supabase.from("chat_messages").insert({
        consultation_id: consultationId,
        role: "assistant",
        content: assistantMessage.content,
      });
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  if (showForm) {
    return <ConsultationForm onSubmit={handleFormSubmit} onClose={() => {}} />;
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col rounded-2xl border border-slate-800 bg-slate-950/50 backdrop-blur">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === "user" ? "bg-amber-600 text-white" : "bg-slate-800/50 text-parchment border border-slate-700"}`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              <span className="text-xs opacity-60 mt-2 block">{message.timestamp.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl px-4 py-3">
              <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="border-t border-slate-800 p-4">
        <div className="flex gap-2">
          <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="법률 상담 내용을 입력하세요..." disabled={isLoading} className="flex-1 rounded-full border border-slate-700 bg-slate-900/50 px-6 py-3 text-parchment placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
          <button type="submit" disabled={isLoading || !input.trim()} className="rounded-full bg-amber-600 p-3 text-white hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}

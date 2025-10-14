import ChatInterface from "@/components/layouts/ChatInterface";
import Link from "next/link";
import { ArrowLeft, Sparkles, MessageCircle, Target } from "lucide-react";

export default function ChatPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* 뒤로가기 */}
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-parchment transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        홈으로 돌아가기
      </Link>

      {/* 헤더 */}
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-amber-500" />
          <p className="text-xs uppercase tracking-[0.3em] text-amber-600/80">
            AI Detailed Consultation
          </p>
        </div>
        <h1 className="font-serif text-4xl text-parchment mb-4">
          AI 상세 법률 상담
        </h1>
        <p className="max-w-2xl mx-auto text-sm text-slate-400 leading-relaxed mb-6">
          복잡한 법률 문제를 AI와 충분히 상담한 후,<br />
          가장 적합한 전문 변호사를 추천받으세요.
        </p>

        {/* 특징 */}
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <MessageCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
            <div className="text-left">
              <h3 className="text-sm font-semibold text-parchment mb-1">심층 상담</h3>
              <p className="text-xs text-slate-400">
                24시간 AI가 충분한 시간을 들여 문제를 파악합니다
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <Target className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
            <div className="text-left">
              <h3 className="text-sm font-semibold text-parchment mb-1">정확한 매칭</h3>
              <p className="text-xs text-slate-400">
                상담 내용을 분석해 최적의 전문 변호사를 추천
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
            <div className="text-left">
              <h3 className="text-sm font-semibold text-parchment mb-1">사전 정리</h3>
              <p className="text-xs text-slate-400">
                변호사 상담 전 핵심 쟁점이 정리됩니다
              </p>
            </div>
          </div>
        </div>

        {/* 안내 */}
        <div className="max-w-2xl mx-auto p-4 rounded-xl bg-amber-950/20 border border-amber-900/30">
          <p className="text-xs text-amber-200/70 leading-relaxed">
            💡 <strong>간단한 문의는?</strong> 홈페이지의 "빠른 상담 신청"을 이용하시면 더 빠르게 전문 변호사와 연결됩니다.
          </p>
        </div>
      </header>

      {/* AI 챗 인터페이스 */}
      <div className="max-w-4xl mx-auto">
        <ChatInterface />
      </div>

      {/* 하단 안내 */}
      <footer className="mt-8 text-center">
        <p className="text-xs text-slate-500 mb-4">
          ⚠️ 본 AI 상담은 일반적인 법률 정보 제공을 목적으로 하며, 
          개별 사안에 대한 법률 자문이 아닙니다.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm text-amber-500 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          빠른 상담 신청하러 가기
        </Link>
      </footer>
    </main>
  );
}

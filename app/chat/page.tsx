export default function ChatPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-brass/80">AI Consultation</p>
      <h1 className="font-serif text-4xl text-parchment">AI 챗 상담 신청</h1>
      <p className="max-w-xl text-sm text-zinc-400">
        곧 GPT-5 기반 상담 에이전트가 연결되어 리스크 등급과 준비 서류 목록을 제공합니다. 현재는 예약 양식을 구축 중입니다.
      </p>
    </main>
  );
}
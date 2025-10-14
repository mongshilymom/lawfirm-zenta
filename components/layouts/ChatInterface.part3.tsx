
  return (
    <>
      <div className="flex h-[calc(100vh-12rem)] flex-col rounded-2xl border border-slate-800 bg-slate-950/50 backdrop-blur">
        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-amber-600 text-white"
                    : "bg-slate-800/50 text-parchment border border-slate-700"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                <span className="text-xs opacity-60 mt-2 block">
                  {message.timestamp.toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}

          {/* 상담 신청 제안 */}
          {showFormPrompt && !consultationId && (
            <div className="flex justify-center">
              <div className="bg-amber-900/20 border border-amber-600/30 rounded-2xl px-6 py-4 max-w-md">
                <p className="text-sm text-amber-200 mb-3">
                  💡 전문 변호사 상담을 신청하시겠어요?
                  <br />
                  정보를 남겨주시면 빠르게 연락드립니다.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  상담 신청하기
                </button>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl px-4 py-3">
                <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 입력 영역 */}
        <form onSubmit={handleSubmit} className="border-t border-slate-800 p-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="법률 상담 내용을 입력하세요..."
              disabled={isLoading}
              className="flex-1 rounded-full border border-slate-700 bg-slate-900/50 px-6 py-3 text-parchment placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded-full bg-amber-600 p-3 text-white hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* 상담 신청 폼 모달 */}
      <ConsultationForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
      />
    </>
  );
}

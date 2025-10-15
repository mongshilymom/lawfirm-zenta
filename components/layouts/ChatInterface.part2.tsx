import React, { useState, useRef } from "react";

// ---------------------------------------------------
// 💡 타입 정의 (첨부 파일의 로직에 따라 유추하여 추가)
// ---------------------------------------------------
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  legalIssue: string;
}
// ---------------------------------------------------

const ChatInterface = () => {
  // ---------------------------------------------------
  // 💡 상태 변수 (첨부 파일의 로직에 따라 유추하여 추가)
  // ---------------------------------------------------
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]); // 메시지 목록
  const [consultationId, setConsultationId] = useState<string | null>(null); // 상담 ID
  const [showForm, setShowForm] = useState(false); // 폼 표시 여부
  const [showFormPrompt, setShowFormPrompt] = useState(false); // 폼 프롬프트 표시 여부
  const inputRef = useRef<HTMLInputElement>(null);
  // ---------------------------------------------------

  /**
   * 챗봇 메시지 전송 처리
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

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

      // 응답에서 consultationId 업데이트
      if (data.consultationId) {
        setConsultationId(data.consultationId);
      }
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

  /**
   * 상담 신청 폼 제출 처리
   */
  const handleFormSubmit = async (formData: FormData) => {
    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error("Failed to create consultation");

      const data = await response.json();
      setConsultationId(data.consultationId);
      setShowForm(false);
      setShowFormPrompt(false);

      // 성공 메시지 추가
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `${formData.name}님, 상담 신청이 완료되었습니다! 담당 변호사가 곧 연락드릴 예정입니다. 계속해서 궁금한 점을 질문해주세요.`,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Form submission error:", error);
      alert("상담 신청 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };
  
  // ---------------------------------------------------
  // 💡 렌더링 부분 (예시 구조에 맞게 수정)
  // ---------------------------------------------------

  return (
    <div className="chat-interface-container">
      {/* ⚠️ 참고: 메시지 표시와 폼 컴포넌트는 이 예시에서는 생략되었습니다. 
         실제 사용 시에는 messages 상태를 이용해 UI를 구성하고, 
         showForm 상태에 따라 상담 폼을 렌더링해야 합니다. 
         (예: <MessageList messages={messages} />) 
         (예: {showForm && <ConsultationForm onSubmit={handleFormSubmit} />})
      */}
      <div className="message-list-placeholder">
        {messages.map((m) => (
          <div key={m.id} className={`message ${m.role}`}>
            <strong>{m.role}:</strong> {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isLoading ? "응답 대기 중..." : "변호사에게 궁금한 점을 입력하세요..."}
          disabled={isLoading}
        />
        <button type="submit" disabled={!input.trim() || isLoading}>
          {isLoading ? "전송 중..." : "전송"}
        </button>
      </form>

      {/* 테스트를 위한 폼 호출 버튼 (실제 앱에서는 챗봇 응답에 따라 표시될 것입니다) */}
      <div style={{ marginTop: '10px' }}>
        <button onClick={() => handleFormSubmit({
            name: "테스트 사용자",
            email: "test@example.com",
            phone: "010-1234-5678",
            legalIssue: "테스트 법률 문제",
        })} disabled={isLoading}>
            상담 신청 테스트
        </button>
      </div>

    </div>
  );
};

export default ChatInterface;

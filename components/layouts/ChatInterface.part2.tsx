
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

  const handleFormSubmit = async (formData: {
    name: string;
    email: string;
    phone: string;
    legalIssue: string;
  }) => {
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

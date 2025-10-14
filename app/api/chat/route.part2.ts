
    // Claude API 호출
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: LEGAL_SYSTEM_PROMPT,
      messages: messages
        .filter((m) => m.role !== "system")
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
    });

    const assistantMessage =
      response.content[0].type === "text" ? response.content[0].text : "";

    // TODO: Supabase에 메시지 저장 (consultationId가 있을 경우)
    if (consultationId) {
      // await saveMessageToSupabase(consultationId, messages, assistantMessage);
    }

    return NextResponse.json({
      message: assistantMessage,
      consultationId,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}

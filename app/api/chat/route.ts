import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServerSupabase } from "@/lib/supabase/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

const LEGAL_SYSTEM_PROMPT = `당신은 한국 법률 전문 AI 상담사입니다. 
다음 역할을 수행하세요:

1. 친절하고 전문적인 톤으로 응답
2. 법률 용어를 쉽게 설명
3. 상담자의 상황을 구체적으로 파악
4. 필요한 증거나 서류 안내
5. 추가 질문을 통해 맥락 파악
6. 법률 사무소 상담 예약 권유 (복잡한 경우)

중요: 확정적인 법률 조언은 피하고, 일반적인 정보만 제공하세요.
"전문 변호사 상담이 필요합니다"라는 문구를 적절히 사용하세요.`;

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

async function saveMessageToSupabase(
  consultationId: string,
  userMessage: Message,
  assistantMessage: string
) {
  const supabase = createServerSupabase();

  const messages = [
    {
      consultation_id: consultationId,
      role: userMessage.role,
      content: userMessage.content,
    },
    {
      consultation_id: consultationId,
      role: "assistant" as const,
      content: assistantMessage,
    },
  ];

  const { error } = await supabase.from("chat_messages").insert(messages);

  if (error) {
    console.error("Failed to save messages to DB:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, consultationId } = body as {
      messages: Message[];
      consultationId?: string;
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

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

    // DB에 메시지 저장 (consultationId가 있을 경우)
    if (consultationId) {
      const lastUserMessage = messages[messages.length - 1];
      if (lastUserMessage && lastUserMessage.role === "user") {
        await saveMessageToSupabase(
          consultationId,
          lastUserMessage,
          assistantMessage
        );
      }
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

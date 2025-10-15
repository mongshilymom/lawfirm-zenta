import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, legalIssue, messages } = body as {
      name: string;
      email: string;
      phone: string;
      legalIssue: string;
      messages: Message[];
    };

    if (!name || !email || !phone || !legalIssue) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabase();

    // 1. 상담 세션 생성
    const { data: consultation, error: consultationError } = await supabase
      .from("consultations")
      .insert({
        name: name,
        email: email,
        phone: phone,
        case_type: legalIssue,
        description: legalIssue,
        visitor_name: name,
        visitor_email: email,
        visitor_phone: phone,
        legal_issue: legalIssue,
        status: "active",
      } as any)
      .select()
      .single();

    if (consultationError) {
      console.error("Failed to create consultation:", consultationError);
      return NextResponse.json(
        { error: "Failed to create consultation" },
        { status: 500 }
      );
    }

    // 2. 대화 메시지 저장 (있는 경우)
    if (messages && messages.length > 0 && consultation) {
      const messageRecords = messages.map((msg) => ({
        consultation_id: (consultation as any).id,
        role: msg.role,
        content: msg.content,
      }));

      const { error: messagesError } = await supabase
        .from("chat_messages")
        .insert(messageRecords as any);

      if (messagesError) {
        console.error("Failed to save messages:", messagesError);
        // 메시지 저장 실패해도 상담 세션은 유지
      }
    }

    // 3. lead_intake 테이블에도 저장 (기존 시스템 호환)
    await supabase.from("lead_intake").insert({
      email,
      company: name,
      phone,
      message: legalIssue,
      source: "ai_chat",
    } as any);

    return NextResponse.json({
      consultationId: (consultation as any)?.id,
      message: "Consultation created successfully",
    });
  } catch (error) {
    console.error("Consultation API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

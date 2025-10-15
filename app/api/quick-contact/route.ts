import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { name, phone, consultationType, message } = await request.json();

    if (!name || !phone || !consultationType) {
      return NextResponse.json(
        { error: "필수 항목을 입력해주세요" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabase();

    // quick_contacts 테이블에 저장
    const { data: contact, error: contactError } = await supabase
      .from("quick_contacts")
      .insert({
        name,
        phone,
        consultation_type: consultationType,
        message: message || "",
        status: "pending",
      } as any)
      .select()
      .single();

    if (contactError) {
      console.error("Failed to create quick contact:", contactError);
      return NextResponse.json(
        { error: "문의 접수에 실패했습니다" },
        { status: 500 }
      );
    }

    // 이메일 알림 발송 (실패해도 문의는 접수됨)
    fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "quick_contact_created",
        data: {
          name,
          phone,
          consultation_type: consultationType,
          message: message || "내용 없음",
          created_at: (contact as any)?.created_at,
        },
      }),
    }).catch((error) => console.warn("Email notification failed:", error));

    return NextResponse.json({
      success: true,
      message: "문의가 접수되었습니다",
    });
  } catch (error) {
    console.error("Quick contact API error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

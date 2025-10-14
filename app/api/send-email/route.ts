import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json();

    if (type === "consultation_created") {
      // 고객에게 접수 확인 메일
      await resend.emails.send({
        from: "Zenta Law <noreply@zentalaw.com>",
        to: data.email,
        subject: "상담 신청이 접수되었습니다",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1d4ed8;">상담 신청 접수 완료</h2>
            <p>${data.name}님, 안녕하세요!</p>
            <p>귀하의 상담 신청이 정상적으로 접수되었습니다.</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">신청 내용</h3>
              <p><strong>상담 유형:</strong> ${data.case_type}</p>
              <p><strong>연락처:</strong> ${data.phone}</p>
              <p><strong>내용:</strong></p>
              <p style="white-space: pre-wrap;">${data.description}</p>
            </div>
            
            <p>담당 변호사 배정 후 24시간 내에 연락드리겠습니다.</p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              문의사항이 있으시면 이 메일에 답장해 주세요.
            </p>
          </div>
        `,
      });

      // 관리자에게 알림 메일
      await resend.emails.send({
        from: "Zenta Law System <system@zentalaw.com>",
        to: process.env.ADMIN_EMAIL || "admin@zentalaw.com",
        subject: `🔔 새로운 상담 신청 - ${data.case_type}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">새로운 상담 신청</h2>
            
            <div style="background: #fef2f2; padding: 20px; border-left: 4px solid #dc2626; margin: 20px 0;">
              <h3 style="margin-top: 0;">신청자 정보</h3>
              <p><strong>이름:</strong> ${data.name}</p>
              <p><strong>이메일:</strong> ${data.email}</p>
              <p><strong>전화:</strong> ${data.phone}</p>
            </div>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">상담 내용</h3>
              <p><strong>유형:</strong> ${data.case_type}</p>
              <p><strong>내용:</strong></p>
              <p style="white-space: pre-wrap;">${data.description}</p>
            </div>
            
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/consultations" 
               style="display: inline-block; background: #1d4ed8; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; margin-top: 20px;">
              관리자 대시보드 열기
            </a>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              신청 시간: ${new Date(data.created_at).toLocaleString("ko-KR")}
            </p>
          </div>
        `,
      });

      return NextResponse.json({ success: true });
    }

    if (type === "quick_contact_created") {
      // 관리자에게 빠른 문의 알림
      await resend.emails.send({
        from: "Zenta Law System <system@zentalaw.com>",
        to: process.env.ADMIN_EMAIL || "admin@zentalaw.com",
        subject: `⚡ 빠른 상담 신청 - ${data.consultation_type}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #f59e0b;">⚡ 빠른 상담 신청</h2>
            
            <div style="background: #fffbeb; padding: 20px; border-left: 4px solid #f59e0b; margin: 20px 0;">
              <h3 style="margin-top: 0;">신청자 정보</h3>
              <p><strong>이름:</strong> ${data.name}</p>
              <p><strong>전화:</strong> ${data.phone}</p>
              <p><strong>상담 분야:</strong> ${data.consultation_type}</p>
            </div>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">문의 내용</h3>
              <p style="white-space: pre-wrap;">${data.message || '내용 없음'}</p>
            </div>
            
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/consultations" 
               style="display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; margin-top: 20px;">
              즉시 연락하기
            </a>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              신청 시간: ${new Date(data.created_at).toLocaleString("ko-KR")}<br>
              ⚡ 평균 2시간 내 응답 목표
            </p>
          </div>
        `,
      });

      return NextResponse.json({ success: true });
    }

    if (type === "lawyer_assigned") {
      // 고객에게 변호사 배정 알림
      await resend.emails.send({
        from: "Zenta Law <noreply@zentalaw.com>",
        to: data.client_email,
        subject: "담당 변호사가 배정되었습니다",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1d4ed8;">담당 변호사 배정 완료</h2>
            <p>${data.client_name}님, 안녕하세요!</p>
            <p>귀하의 상담에 담당 변호사가 배정되었습니다.</p>
            
            <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">담당 변호사 정보</h3>
              <p><strong>이름:</strong> ${data.lawyer_name}</p>
              <p><strong>전문분야:</strong> ${data.lawyer_specialty}</p>
            </div>
            
            <p>곧 담당 변호사가 직접 연락드릴 예정입니다.</p>
          </div>
        `,
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown email type" }, { status: 400 });
  } catch (error) {
    console.error("이메일 발송 실패:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}

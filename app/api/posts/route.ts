import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/session";

// 포스트 목록 조회
export async function GET() {
  try {
    await requireAdmin();
    const supabase = createAdminSupabase();

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "서버 오류" },
      { status: 500 }
    );
  }
}

// 새 포스트 생성
export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await request.json();

    const { title, slug, excerpt, content, status, cover_image } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: "제목과 Slug는 필수입니다" },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabase();

    // 컨텐츠를 JSON 형식으로 저장
    const contentJson = {
      type: "markdown",
      value: content || "",
    };

    const { data, error } = await supabase
      .from("posts")
      .insert({
        title,
        slug,
        excerpt,
        content: contentJson,
        status: status || "draft",
        cover_image,
        author_id: session.userId,
        published_at: status === "published" ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "이미 존재하는 Slug입니다" },
          { status: 400 }
        );
      }
      throw error;
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "서버 오류" },
      { status: 500 }
    );
  }
}

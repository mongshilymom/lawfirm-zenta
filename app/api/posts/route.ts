import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/session";

// 뉴스 기사 목록 조회 (news_articles 테이블 사용)
export async function GET() {
  try {
    await requireAdmin();
    const supabase = createAdminSupabase();

    const { data, error } = await supabase
      .from("news_articles")
      .select("*")
      .order("published_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "서버 오류" },
      { status: 500 }
    );
  }
}

// 새 뉴스 기사 생성 (news_articles 테이블에 맞게 수정)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();

    const { headline, slug, body: articleBody, author, source_url } = body;

    if (!headline) {
      return NextResponse.json(
        { error: "제목(headline)은 필수입니다" },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabase();

    const { data, error } = await supabase
      .from("news_articles")
      .insert({
        headline,
        slug: slug || null,
        body: articleBody || null,
        author: author || null,
        source_url: source_url || null,
        published_at: new Date().toISOString(),
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

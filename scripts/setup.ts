#!/usr/bin/env node

/**
 * 🚀 Template Law Firm Zenta 빠른 설치 스크립트
 * 
 * 이 스크립트는 다음을 자동화합니다:
 * 1. 환경변수 검증
 * 2. Supabase 연결 테스트
 * 3. 데이터베이스 스키마 확인
 * 4. 초기 데이터 시딩
 */

console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🏛️  Template Law Firm Zenta - 빠른 설치                    ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`);

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// 환경변수 로드
const envPath = path.join(process.cwd(), ".env");
if (!fs.existsSync(envPath)) {
  console.error("❌ .env 파일이 없습니다!");
  console.log("\n📝 다음 단계를 따라주세요:");
  console.log("1. .env.example을 복사하여 .env 파일을 만드세요");
  console.log("   cp .env.example .env");
  console.log("2. Supabase Dashboard에서 프로젝트 키를 복사하세요");
  console.log("3. .env 파일에 키를 입력하세요\n");
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Supabase 환경변수가 설정되지 않았습니다!");
  console.log("\n.env 파일을 확인하고 다음 변수를 설정하세요:");
  console.log("- NEXT_PUBLIC_SUPABASE_URL");
  console.log("- SUPABASE_SERVICE_ROLE_KEY\n");
  process.exit(1);
}

console.log("✅ 환경변수 확인 완료\n");

// Supabase 클라이언트 생성
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSupabaseConnection() {
  console.log("🔌 Supabase 연결 테스트 중...");
  
  try {
    const { data, error } = await supabase.from("lawyers").select("count", { count: "exact", head: true });
    
    if (error) {
      if (error.message.includes("relation") && error.message.includes("does not exist")) {
        console.log("⚠️  데이터베이스 테이블이 아직 생성되지 않았습니다.");
        console.log("\n📝 다음 단계를 따라주세요:");
        console.log("1. Supabase Dashboard → SQL Editor 열기");
        console.log("2. supabase/schema.sql 파일 내용 복사");
        console.log("3. SQL Editor에 붙여넣고 실행");
        console.log("4. 이 스크립트를 다시 실행하세요\n");
        return false;
      }
      
      throw error;
    }
    
    console.log("✅ Supabase 연결 성공!\n");
    return true;
  } catch (error: any) {
    console.error("❌ Supabase 연결 실패:", error.message);
    return false;
  }
}

async function checkSchema() {
  console.log("📋 데이터베이스 스키마 확인 중...");
  
  try {
    // 필수 테이블 확인
    const tables = ["lawyers", "faqs", "insights", "case_studies"];
    
    for (const table of tables) {
      const { error } = await supabase.from(table).select("*", { count: "exact", head: true });
      
      if (error) {
        console.error(`❌ 테이블 '${table}'이(가) 없습니다.`);
        return false;
      }
    }
    
    console.log("✅ 모든 필수 테이블 존재 확인\n");
    return true;
  } catch (error: any) {
    console.error("❌ 스키마 확인 실패:", error.message);
    return false;
  }
}

async function seedData() {
  console.log("🌱 초기 데이터 시딩 시작...\n");
  
  const { count } = await supabase
    .from("lawyers")
    .select("*", { count: "exact", head: true });
  
  if (count && count > 0) {
    console.log(`ℹ️  이미 ${count}명의 변호사 데이터가 있습니다.`);
    console.log("   추가 데이터가 필요하면 'npm run seed'를 실행하세요.\n");
    return;
  }
  
  console.log("📝 npm run seed를 실행하여 500명의 변호사 데이터를 생성하세요.\n");
}

async function setup() {
  console.log("🚀 설치를 시작합니다...\n");
  
  // 1. Supabase 연결 확인
  const connected = await checkSupabaseConnection();
  if (!connected) {
    process.exit(1);
  }
  
  // 2. 스키마 확인
  const schemaOk = await checkSchema();
  if (!schemaOk) {
    process.exit(1);
  }
  
  // 3. 데이터 시딩
  await seedData();
  
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ✅ 설치 완료!                                               ║
║                                                              ║
║   다음 명령어로 개발 서버를 시작하세요:                         ║
║   npm run dev                                                ║
║                                                              ║
║   그리고 http://localhost:3000 에 접속하세요                   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`);
}

setup().catch((error) => {
  console.error("\n❌ 설치 중 오류 발생:", error);
  process.exit(1);
});

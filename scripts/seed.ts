import { createClient } from "@supabase/supabase-js";
import type { Database } from "../lib/supabase/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Supabase 환경변수가 설정되지 않았습니다.");
  console.error("   .env 파일에 NEXT_PUBLIC_SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY를 설정하세요.");
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// 한국 성씨 풀
const lastNames = [
  "김", "이", "박", "최", "정", "강", "조", "윤", "장", "임", "한", "오", "서", "신", "권", "황", "안", "송", "류", "전"
];

// 한국 이름 풀
const firstNames = [
  "민준", "서연", "하준", "지우", "도윤", "서현", "예준", "지유", "시우", "수아",
  "주원", "하윤", "지호", "채원", "준서", "다은", "건우", "민서", "현우", "예린",
  "우진", "소율", "선우", "예나", "지훈", "가은", "도현", "시은", "윤호", "유진",
  "태양", "서윤", "은우", "지안", "지환", "세아", "승현", "윤서", "민재", "아인"
];

// 전문 분야 풀
const practiceAreas = [
  ["M&A", "기업법무", "분쟁해결"],
  ["지적재산권", "AI 규제", "특허소송"],
  ["노동법", "인사관리", "규제준수"],
  ["금융규제", "핀테크", "증권법"],
  ["형사법", "화이트칼라 범죄", "내부조사"],
  ["부동산", "건설분쟁", "프로젝트파이낸싱"],
  ["조세법", "국제조세", "이전가격"],
  ["환경법", "ESG", "지속가능경영"],
  ["의료법", "제약규제", "바이오"],
  ["국제거래", "통상법", "WTO"],
  ["개인정보보호", "사이버보안", "데이터 거버넌스"],
  ["경쟁법", "공정거래", "카르텔"],
  ["파산", "회생", "기업구조조정"],
  ["가족법", "상속", "이혼"],
  ["엔터테인먼트", "미디어", "방송통신"]
];

// Bio 템플릿
const bioTemplates = [
  "국내외 대기업 법률자문 경험 보유. 삼성, LG, SK 등 주요 그룹사 자문.",
  "정부 부처 출신 변호사. 규제 이해도가 높아 실무적 솔루션 제공 가능.",
  "대형 로펌 출신으로 복잡한 국제 거래 및 분쟁 해결 전문.",
  "스타트업 및 중견기업 대상 실용적이고 경제적인 법률 서비스 제공.",
  "학계 출신으로 이론과 실무를 겸비한 심도있는 법률 자문 제공.",
  "In-house counsel 경력 보유로 기업 입장을 이해하는 맞춤형 자문.",
  "글로벌 로펌 근무 경험. 영어, 일본어, 중국어 가능.",
  "주요 업종별 전문성 보유. 제조, IT, 금융, 바이오 등 산업 이해도 높음."
];

function generateLawyers(count: number) {
  const lawyers = [];
  
  for (let i = 0; i < count; i++) {
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const name = lastName + firstName;
    
    const role = Math.random() > 0.3 ? "Associate" : "Partner";
    const experienceYears = role === "Partner" 
      ? Math.floor(Math.random() * 13) + 12  // 12-25년
      : Math.floor(Math.random() * 10) + 5;   // 5-15년
    
    const practices = practiceAreas[Math.floor(Math.random() * practiceAreas.length)];
    const bio = bioTemplates[Math.floor(Math.random() * bioTemplates.length)];
    
    lawyers.push({
      name,
      role,
      practice_areas: practices,
      experience_years: experienceYears,
      bio,
      headshot_url: null,
      is_active: Math.random() > 0.05  // 95% 활성
    });
  }
  
  return lawyers;
}

async function seedDatabase() {
  console.log("🌱 변호사 데이터 시딩 시작...\n");
  
  // 1. 기존 데이터 확인
  const { count: existingCount } = await supabase
    .from("lawyers")
    .select("*", { count: "exact", head: true });
  
  if (existingCount && existingCount > 0) {
    console.log(`⚠️  이미 ${existingCount}명의 변호사 데이터가 존재합니다.`);
    console.log("   기존 데이터를 삭제하고 새로 생성하려면 'npm run seed:force'를 실행하세요.\n");
    
    // 추가 생성
    const remaining = 500 - existingCount;
    if (remaining > 0) {
      console.log(`📝 ${remaining}명의 변호사 데이터를 추가 생성합니다...\n`);
      const lawyers = generateLawyers(remaining);
      
      const { error } = await supabase.from("lawyers").insert(lawyers);
      
      if (error) {
        console.error("❌ 데이터 삽입 실패:", error.message);
        process.exit(1);
      }
      
      console.log(`✅ ${remaining}명의 변호사 데이터 추가 완료!`);
    } else {
      console.log("✅ 이미 500명 이상의 데이터가 있습니다.");
    }
  } else {
    // 새로 생성
    console.log("📝 500명의 변호사 데이터를 생성합니다...\n");
    const lawyers = generateLawyers(500);
    
    // Supabase는 한 번에 많은 데이터 삽입 가능하지만, 안전하게 100개씩 배치 처리
    const batchSize = 100;
    for (let i = 0; i < lawyers.length; i += batchSize) {
      const batch = lawyers.slice(i, i + batchSize);
      const { error } = await supabase.from("lawyers").insert(batch);
      
      if (error) {
        console.error(`❌ 배치 ${i / batchSize + 1} 삽입 실패:`, error.message);
        process.exit(1);
      }
      
      console.log(`   ✓ ${i + batch.length} / ${lawyers.length} 완료`);
    }
    
    console.log("\n✅ 500명의 변호사 데이터 생성 완료!");
  }
  
  // 2. 최종 데이터 확인
  const { count: finalCount } = await supabase
    .from("lawyers")
    .select("*", { count: "exact", head: true });
  
  console.log(`\n📊 현재 총 ${finalCount}명의 변호사 데이터가 있습니다.\n`);
}

seedDatabase().catch((error) => {
  console.error("❌ 시드 실행 중 오류:", error);
  process.exit(1);
});

import { createClient } from "@supabase/supabase-js";
// next/headers의 cookies는 더 이상 createClient의 옵션으로 필요하지 않으므로 제거합니다.
import type { Database } from "./types";
import { getSupabaseEnv } from "./env";

// 서버 Supabase 인스턴스 생성 (Next.js Server Component/Route 용)
// v2 이상에서는 인증 세션 주입을 위한 'cookies' 옵션이 createClient에서 지원되지 않습니다.
export const createServerSupabase = () => {
  // const cookieStore = cookies(); // v2 대응을 위해 제거
  const { url, anonKey } = getSupabaseEnv();
  
  // 단순 서버 작업(익명 조회)을 위해 URL과 anonKey만 사용하여 인스턴스를 생성합니다.
  return createClient<Database>(url, anonKey);
  
  /* ⚠️ 참고: 
  사용자 인증이 필요한 경우, 별도로 쿠키에서 access_token을 추출하여
  다음과 같이 세션을 수동으로 주입해야 합니다.
  
  const supabase = createClient<Database>(url, anonKey);
  const { value: accessToken } = cookieStore.get('sb-access-token') || {};
  if (accessToken) {
      await supabase.auth.setSession({ access_token: accessToken, refresh_token: '...' });
  }
  return supabase;
  */
};
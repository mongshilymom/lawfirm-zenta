import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "./types";
import { getSupabaseEnv } from "./env";

// 서버 환경에서 Supabase 인스턴스 생성 함수
export const createServerSupabase = () => {
  const cookieStore = cookies();
  const { url, anonKey } = getSupabaseEnv();
  return createClient<Database>(url, anonKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value;
      }
    }
  });
};

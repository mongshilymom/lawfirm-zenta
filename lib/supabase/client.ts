"use client";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { getSupabaseEnv } from "./env";

// Supabase 브라우저 클라이언트 캐싱
let browserClient: ReturnType<typeof createClient<Database>> | null = null;

export const getSupabaseBrowserClient = () => {
  if (!browserClient) {
    const { url, anonKey } = getSupabaseEnv();
    browserClient = createClient<Database>(url, anonKey);
  }
  return browserClient;
};

// 구버전 코드 호환을 위해 기본 supabase export
export const supabase = getSupabaseBrowserClient();

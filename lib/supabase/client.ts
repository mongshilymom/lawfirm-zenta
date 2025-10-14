"use client";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { getSupabaseEnv } from "./env";

let browserClient: ReturnType<typeof createClient<Database>> | null = null;

export const getSupabaseBrowserClient = () => {
  if (!browserClient) {
    const { url, anonKey } = getSupabaseEnv();
    browserClient = createClient<Database>(url, anonKey);
  }
  return browserClient;
};

// Export as supabase for backward compatibility
export const supabase = getSupabaseBrowserClient();
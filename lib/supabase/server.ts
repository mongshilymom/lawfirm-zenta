import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "./types";
import { getSupabaseEnv } from "./env";

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
const ensure = (value: string | undefined, key: string) => {
  if (!value) {
    throw new Error(`Missing Supabase environment variable: ${key}`);
  }
  return value;
};

export const getSupabaseEnv = () => ({
  url: ensure(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
  anonKey: ensure(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, "NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
});
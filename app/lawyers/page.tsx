import { Suspense } from "react";
import LawyerDirectoryClient from "./LawyerDirectoryClient";
import { createServerSupabase } from "@/lib/supabase/server";

// ✅ 변호사 목록 페이지의 탭 제목 명시
export const metadata = {
  title: "Lawyers",
};

async function getLawyersData() {
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from("lawyers")
    .select("id, name, role, practice_areas, experience_years, bio, headshot_url")
    .eq("is_active", true)
    .order("experience_years", { ascending: false });

  if (error) {
    console.error("Failed to load lawyers:", error.message);
    return [];
  }

  return data || [];
}

function extractUniqueValues<T extends Record<string, any>>(items: T[], key: keyof T): string[] {
  const values = new Set<string>();
  items.forEach((item) => {
    const value = item[key];
    if (Array.isArray(value)) {
      value.forEach((v: any) => values.add(String(v)));
    } else if (value) {
      values.add(String(value));
    }
  });
  return Array.from(values).sort();
}

export default async function LawyersPage() {
  const lawyers = await getLawyersData();

  const availableSpecialties = extractUniqueValues(lawyers as any, "practice_areas");
  const availableRoles = extractUniqueValues(lawyers as any, "role");

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-slate-100">Our Legal Team</h1>
        <p className="text-lg text-slate-400">Find the right attorney for your legal needs</p>
      </header>

      <Suspense fallback={<div className="py-12 text-center">Loading lawyers...</div>}>
        <LawyerDirectoryClient
          initialLawyers={lawyers as any}
          availableSpecialties={availableSpecialties}
          availableRoles={availableRoles}
        />
      </Suspense>
    </main>
  );
}

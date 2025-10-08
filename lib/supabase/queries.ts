import "server-only";

import { cache } from "react";
import { createServerSupabase } from "./server";

export const getFeaturedLawyers = cache(async () => {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("lawyers")
    .select("id, name, role, practice_areas, experience_years, bio, headshot_url")
    .eq("is_active", true)
    .order("experience_years", { ascending: false })
    .limit(8);

  if (error) {
    console.error("Failed to load lawyers", error.message);
    return [];
  }

  return data;
});

export const searchLawyers = cache(
  async ({
    query,
    role,
    experienceYears
  }: {
    query?: string;
    role?: "Partner" | "Associate";
    experienceYears?: number;
  }) => {    const supabase = createServerSupabase();
    let request = supabase.from("lawyers").select("id, name, role, practice_areas, experience_years, bio, headshot_url");

    if (query) {
      request = request.textSearch("name", query, {
        type: "websearch"
      });
    }
    if (role && role !== "Partner" && role !== "Associate") {
      // ignore invalid
    } else if (role) {
      request = request.eq("role", role);
    }
    if (experienceYears) {
      request = request.gte("experience_years", experienceYears);
    }

    const { data, error } = await request.limit(60);
    if (error) {
      console.error("Failed to search lawyers", error.message);
      return [];
    }
    return data;
  }
);
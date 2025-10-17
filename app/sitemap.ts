import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://youalta.net";
  
  // Static routes
  const routes = [
    "",
    "/lawyers",
    "/chat",
    "/contact",
    "/privacy",
    "/terms"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8
  }));

  // Dynamic routes (lawyers) - only if not in demo mode
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  
  if (!isDemoMode) {
    try {
      const { createServerSupabase } = await import("@/lib/supabase/server");
      const supabase = createServerSupabase();
      
      const { data: lawyers } = await supabase
        .from("lawyers")
        .select("id")
        .eq("is_active", true);
      
      if (lawyers) {
        const lawyerRoutes = lawyers.map((lawyer) => ({
          url: `${baseUrl}/lawyers/${lawyer.id}`,
          lastModified: new Date(),
          changeFrequency: "monthly" as const,
          priority: 0.6
        }));
        
        routes.push(...lawyerRoutes);
      }
    } catch (error) {
      console.log("Skipping dynamic routes in sitemap (demo mode or Supabase unavailable)");
    }
  }

  return routes;
}

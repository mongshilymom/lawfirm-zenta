import { MetadataRoute } from "next";
import lawyers from "@/data/lawyers.json";

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

  // Dynamic routes (lawyers from JSON)
  const publishedLawyers = lawyers.filter((l) => l.status === "published");
  
  const lawyerRoutes = publishedLawyers.map((lawyer) => ({
    url: `${baseUrl}/lawyers/${lawyer.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7
  }));
  
  routes.push(...lawyerRoutes);

  return routes;
}

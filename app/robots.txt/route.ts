import { NextResponse } from "next/server";

export function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://youalta.net";
  const isProduction = process.env.NODE_ENV === "production";
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  
  // Block indexing for preview/demo deployments
  if (!isProduction || isDemoMode) {
    const robotsTxt = `User-agent: *
Disallow: /`;
    
    return new NextResponse(robotsTxt, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, max-age=3600"
      }
    });
  }
  
  // Allow indexing for production
  const robotsTxt = `User-agent: *
Allow: /

# Disallow admin routes
User-agent: *
Disallow: /admin/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml`;
  
  return new NextResponse(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=3600"
    }
  });
}

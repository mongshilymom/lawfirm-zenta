/** @type {import('next').NextConfig} */
const isDemo = process.env.DEMO_STATIC === "true";

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**"
      }
    ],
    unoptimized: isDemo // Disable image optimization for static export
  }
};

// Static export for demo distribution
if (isDemo) {
  nextConfig.output = "export";
}

module.exports = nextConfig;

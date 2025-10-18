/** @type {import('next').NextConfig} */
const isDemo = process.env.DEMO_STATIC === "true";

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: false
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
  },
  async redirects() {
    return [
      { source: '/our-team', destination: '/lawyers', permanent: true },
      { source: '/team', destination: '/lawyers', permanent: true },
      { source: '/attorneys', destination: '/lawyers', permanent: true }
    ];
  }
};

// Static export for demo distribution
if (isDemo) {
  nextConfig.output = "export";
}

module.exports = nextConfig;

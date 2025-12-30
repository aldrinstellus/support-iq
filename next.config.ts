import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Force cache busting on each build to prevent stale JavaScript
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  // TypeScript errors will fail the build (ESLint config moved to separate file in Next.js 16)
  typescript: {
    ignoreBuildErrors: false,
  },
  // Output configuration for Vercel deployment
  output: 'standalone',
  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
        ],
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

/**
 * Baseline response headers. A Content-Security-Policy is not set yet: the app
 * loads Google Fonts, images from lh3.googleusercontent.com and the API origin,
 * so a policy needs those origins agreed first (see the review notes).
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(self)",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Keep in sync with OPTIMIZED_REMOTE_HOSTS in src/lib/utils/image.ts.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;

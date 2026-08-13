import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/r2-media/:path*",
        destination: "https://pub-ee00f3f7e024452badbbefab620e13ba.r2.dev/:path*",
      },
    ];
  },
  images: {
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "grupalestravel.com.ar",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "osbogszltteyokksbshk.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "pub-ee00f3f7e024452badbbefab620e13ba.r2.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

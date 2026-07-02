import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ponytail: required for lvh.me subdomain dev; without this Next.js blocks client JS chunks
  allowedDevOrigins: ["lvh.me", "*.lvh.me"],
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;

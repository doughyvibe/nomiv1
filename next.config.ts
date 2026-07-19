import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // ponytail: required for lvh.me subdomain dev; without this Next.js blocks client JS chunks
  allowedDevOrigins: ["lvh.me", "*.lvh.me"],
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    qualities: [75, 90],
  },
};

export default nextConfig;

initOpenNextCloudflareForDev();

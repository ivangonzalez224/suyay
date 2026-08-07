import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["unpdf", "canvas"],
  devIndicators: false,
};

export default nextConfig;

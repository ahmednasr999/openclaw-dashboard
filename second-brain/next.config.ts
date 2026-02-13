import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  distDir: 'dist',
  experimental: {
    dynamicIO: true,
  },
};

export default nextConfig;

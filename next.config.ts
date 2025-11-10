import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Allow build to succeed even with type errors (warnings only)
    ignoreBuildErrors: false,
  },
  eslint: {
    // Allow build to succeed even with ESLint warnings
    ignoreDuringBuilds: false,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;

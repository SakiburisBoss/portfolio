import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  webpack: (config) => {
    config.cache = false;
    config.optimization.splitChunks = {
      cacheGroups: {
        default: false,
      },
    };
    return config;
  },
};

export default nextConfig;

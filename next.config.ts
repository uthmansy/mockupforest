import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignore TypeScript build errors
  typescript: {
    ignoreBuildErrors: true,
  },

  // Ignore ESLint build errors
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Add other config options below as needed

  images: {
    domains: [
      "source.unsplash.com",
      "cdn.pixabay.com",
      "plus.unsplash.com",
      "mzjwyiqfusnwbzhtelvh.supabase.co",
      "files.mockupforest.com",
    ],
  },
};

export default nextConfig;

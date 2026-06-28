import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  // Allow server-side rendering of all pages by default
  // Individual pages/routes can opt into caching via `export const revalidate`
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb", // Allow larger file uploads via Server Actions
    },
  },
};

export default nextConfig;

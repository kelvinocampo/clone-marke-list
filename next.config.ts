import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["lh3.googleusercontent.com", 'cdn-icons-png.flaticon.com'],
  },

  async rewrites() {
    return [
      {
        source: '/products/update',
        destination: '/products/create',
      },
    ];
  },
};

export default nextConfig;

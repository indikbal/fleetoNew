import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fleetowebapi.codingcloud.in",
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["gtsoe.infura-ipfs.io", "gtsoe.infura-ipfs.io"],
    formats: ["image/webp"],
  },
};

export default nextConfig;

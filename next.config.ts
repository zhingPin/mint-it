import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gtsoe.infura-ipfs.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "gsoe.infura-ipfs.io",
        pathname: "/**",
      },
    ],
    // domains: ["gtsoe.infura-ipfs.io", "gsoe.infura-ipfs.io"],
    formats: ["image/webp"],
  },

};

export default nextConfig;

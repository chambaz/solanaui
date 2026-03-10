import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "ybqkchja2noth7nabnjwtcd5wpepkmirgqqptgfupzqk32uwygpa.arweave.net",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/solana-labs/token-list/**",
      },
      {
        protocol: "https",
        hostname: "arweave.net",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/token-metadata/**",
      },
    ],
  },
};

export default withMDX(config);

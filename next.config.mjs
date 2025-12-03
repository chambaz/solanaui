import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "madlads.s3.us-west-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "xcdlwgvabmruuularsvn.supabase.co",
        pathname: "/storage/v1/object/public/p0-tokens/**",
      },
    ],
  },
};

export default withMDX(config);

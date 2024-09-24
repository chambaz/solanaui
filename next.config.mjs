/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.ipfs.nftstorage.link",
      },
    ],
  },
};

export default nextConfig;

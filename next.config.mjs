/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.ipfs.nftstorage.link",
      },
      {
        protocol: "https",
        hostname: "arweave.net",
        pathname: "/*",
      },
      {
        protocol: "https",
        hostname: "shdw-drive.genesysgo.net",
        pathname: "/**/*",
      },
      {
        protocol: "https",
        hostname: "ipfs.io",
        pathname: "/ipfs/*",
      },
    ],
  },
};

export default nextConfig;

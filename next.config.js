/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    domains: ['avatars.githubusercontent.com', 'avatar.vercel.sh']
  },
  experimental: {
    serverComponentsExternalPackages: ['@tremor/react']
  },
  env:{
    IPFS_SECRET: process.env.IPFS_SECRET,
    INFURA_PROJECT_ID: process.env.INFURA_PROJECT_ID
  }
};

module.exports = nextConfig;

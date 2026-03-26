/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@clinhelp/types'],
  experimental: {
    // enable server actions if needed in future
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;

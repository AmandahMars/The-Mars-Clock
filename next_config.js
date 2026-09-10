/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Optimize for performance
  images: {
    unoptimized: true,
  },
  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: 'The Mars Clock',
    NEXT_PUBLIC_APP_URL: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // three.js uses ES modules; Next.js needs to transpile it
  transpilePackages: ['three'],
};

module.exports = nextConfig;

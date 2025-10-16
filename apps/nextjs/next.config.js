/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  transpilePackages: ['@saasfly/ui', '@saasfly/auth', '@saasfly/common'],
}

module.exports = nextConfig
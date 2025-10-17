/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force server/SSR output to avoid accidental static export
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    // 允许在生产环境从以下域名加载图片
    domains: [
      'localhost',
      'sassfly-nextjs.vercel.app',
    ],
    // 可选：更精细的远程图片匹配（协议/主机名/路径）
    remotePatterns: [
      { protocol: 'https', hostname: 'sassfly-nextjs.vercel.app', pathname: '/**' },
    ],
  },
  transpilePackages: ['@saasfly/ui', '@saasfly/auth', '@saasfly/common'],
}

module.exports = nextConfig
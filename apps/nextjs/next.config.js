const path = require('path')
const fs = require('fs')
// 轻量加载根 .env.local（无第三方依赖）
try {
  const envPath = path.resolve(__dirname, '../../.env.local')
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8')
    content.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) return
      const eq = trimmed.indexOf('=')
      if (eq === -1) return
      const key = trimmed.slice(0, eq).trim()
      const val = trimmed.slice(eq + 1).trim()
      if (!process.env[key]) process.env[key] = val
    })
  }
} catch (e) {
  console.warn('Warn: failed to load root .env.local:', e?.message)
}
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force server/SSR output to avoid accidental static export
  output: 'standalone',
  reactStrictMode: true,
  images: {
    // 允许在生产环境从以下域名加载图片
    remotePatterns: [
      { protocol: 'https', hostname: 'sassfly-nextjs.vercel.app', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', pathname: '/**' },
    ],
  },
  // 注释掉 workspace，暂时不依赖项目
  // transpilePackages: ['@saasfly/ui', '@saasfly/auth', '@saasfly/common'],
}

module.exports = nextConfig
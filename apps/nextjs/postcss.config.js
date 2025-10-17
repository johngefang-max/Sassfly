module.exports = {
  plugins: {
    // 显式指定使用 monorepo 根目录的 Tailwind 配置，避免 apps/nextjs 下缺少 tailwind.config.js 时无法生成样式
    tailwindcss: { config: '../../tailwind.config.js' },
    autoprefixer: {},
  },
}
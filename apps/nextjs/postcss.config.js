const path = require('path')

module.exports = {
  // 使用对象形式声明插件，符合 Next.js 对 PostCSS 配置的期望，避免 Malformed PostCSS Configuration 错误
  plugins: {
    tailwindcss: {
      // 指向仓库根目录的 tailwind.config.js，确保在 apps/nextjs 为工作目录时也能正确生成样式
      config: path.join(__dirname, '../../tailwind.config.js'),
      // 显式开启 JIT（Tailwind v3 默认开启，但在少数 CI 场景下声明可以避免不必要的警告）
      // 并确保内容扫描在 Windows/Vercel 等环境下路径解析一致
    },
    autoprefixer: {},
  },
}
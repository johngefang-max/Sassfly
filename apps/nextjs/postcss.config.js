const path = require('path')

module.exports = {
  // 使用对象形式声明插件，符合 Next.js 对 PostCSS 配置的期望，避免 Malformed PostCSS Configuration 错误
  plugins: {
    tailwindcss: {
      // 指向当前 nextjs 应用的 tailwind.config.js，优先使用本地配置
      config: path.join(__dirname, './tailwind.config.js'),
    },
    autoprefixer: {},
  },
}

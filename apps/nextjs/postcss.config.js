const path = require('path')

module.exports = {
  // 使用数组形式显式加载插件并传递配置，避免某些环境下对象形式的 options 未被识别
  plugins: [
    require('tailwindcss')({
      // 指向仓库根目录的 tailwind.config.js，确保在 apps/nextjs 为工作目录时也能正确生成样式
      config: path.join(__dirname, '../../tailwind.config.js'),
    }),
    require('autoprefixer'),
  ],
}
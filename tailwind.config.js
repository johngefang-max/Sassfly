/** @type {import('tailwindcss').Config} */
module.exports = {
  // 作为兜底配置：当子项目未能正确加载自身 Tailwind 配置时，使用根配置也能生成样式
  content: [
    "./apps/nextjs/src/**/*.{js,ts,jsx,tsx,mdx}",
    "./packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
    "./packages/auth/src/**/*.{js,ts,jsx,tsx,mdx}",
    "./packages/common/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  // 作为兜底配置：当子项目未能正确加载自身 Tailwind 配置时，使用根配置也能生成样式
  content: [
    "./apps/nextjs/src/**/*.{js,ts,jsx,tsx,mdx}",
    "./packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
    "./packages/auth/src/**/*.{js,ts,jsx,tsx,mdx}",
    "./packages/common/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // 兜底 safelist，确保首页和登录页的关键样式在内容扫描失败时也能被生成
  safelist: [
    // 布局与容器
    "min-h-screen", "container", "mx-auto", "px-4", "pt-24", "pb-16", "text-center",
    // 渐变与背景
    "bg-gradient-to-br", "from-purple-50", "via-white", "to-pink-50",
    "bg-gradient-to-r", "from-purple-600", "to-pink-600",
    // 文本与标题
    "text-4xl", "text-5xl", "md:text-6xl", "font-bold", "text-gray-900", "text-gray-600", "mb-6", "mb-8",
    // 栅格
    "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-4", "gap-8", "mt-20",
    // 按钮
    "rounded-lg", "rounded-full", "border", "border-purple-600", "text-purple-600",
    "text-white", "px-8", "py-3", "transition-colors", "hover:bg-purple-700", "hover:bg-purple-50",
    // 其他
    "w-8", "h-8", "hover:shadow-lg", "transition-all", "duration-300", "transform", "hover:scale-105",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
}

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
    // ===== 布局与容器 =====
    "min-h-screen", "container", "mx-auto", "text-center",
    "flex", "items-center", "justify-between", "justify-center", "flex-col",
    "relative", "absolute", "group",
    // 间距
    "px-4", "px-6", "px-8", "py-3", "py-4", "py-6", "py-8", "pt-4", "pt-24", "pb-16", "mt-2", "mt-4", "mt-8", "mt-20", "mb-2", "mb-4", "mb-6", "mb-8",
    // 尺寸
    "w-4", "h-4", "w-5", "h-5", "w-6", "h-6", "w-8", "h-8", "w-12", "h-12", "w-32", "w-56", "max-w-3xl", "max-w-7xl", "max-w-md",

    // ===== 渐变与背景 =====
    "bg-white", "bg-white/80", "bg-gray-50", "bg-purple-100",
    "bg-gradient-to-br", "from-purple-50", "via-white", "to-pink-50",
    "bg-gradient-to-r", "from-purple-600", "to-pink-600", "hover:from-purple-700", "hover:to-pink-700",
    "backdrop-blur-md",

    // ===== 边框与圆角 =====
    "border", "border-2", "border-b", "border-t", "border-dashed",
    "border-gray-200", "border-gray-100", "border-purple-600",
    "rounded-lg", "rounded-xl", "rounded-full",

    // ===== 阴影 =====
    "shadow-sm", "shadow-lg", "hover:shadow-xl",

    // ===== 文本与标题 =====
    "text-white", "text-purple-600", "text-purple-700", "text-red-500", "text-green-600",
    "text-gray-900", "text-gray-700", "text-gray-600", "text-gray-500", "text-gray-400",
    "text-sm", "text-lg", "text-xl", "text-2xl", "text-3xl", "text-4xl", "text-5xl", "md:text-4xl", "md:text-6xl",
    "font-bold", "font-semibold",

    // ===== 栅格系统 =====
    "grid", "grid-cols-1", "sm:grid-cols-2", "md:grid-cols-2", "md:grid-cols-4", "gap-3", "gap-4", "gap-8",
    "col-span-1", "md:col-span-2",

    // ===== 间距工具 =====
    "space-x-2", "space-x-4", "space-x-8", "space-y-2", "space-y-3", "space-y-4",
    "mr-1",

    // ===== 过渡与透明度/可见性 =====
    "transition-colors", "transition-all", "duration-200", "duration-300",
    "opacity-0", "opacity-100", "invisible", "visible",
    "group-hover:opacity-100", "group-hover:visible",
    "hover:bg-purple-50", "hover:bg-purple-700", "hover:text-purple-600", "hover:text-purple-800",

    // ===== 响应式显示 =====
    "hidden", "md:hidden", "md:flex", "sm:flex-row",

    // ===== 其他 =====
    "z-50", "top-0", "left-0", "right-0",
    "cursor-pointer", "transform", "hover:scale-105",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
}

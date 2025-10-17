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
    "px-4", "px-6", "px-8", "py-3", "py-4", "py-6", "py-8", "py-16", "pt-4", "pt-24", "pb-16",
    "p-1", "p-2", "p-3", "p-4", "p-6", "p-8",
    "mt-2", "mt-4", "mt-6", "mt-8", "mt-20", "mb-2", "mb-4", "mb-6", "mb-8", "mb-12",
    "ml-1", "ml-4", "mr-1",
    // 尺寸
    "w-4", "h-4", "w-5", "h-5", "w-6", "h-6", "w-8", "h-8", "w-12", "h-12", "w-16", "h-16", "w-32", "w-56", "w-full",
    "max-w-3xl", "max-w-7xl", "max-w-md", "max-w-2xl", "max-w-full", "max-h-full", "max-h-64",
    // 自定义值（任意值类）
    "min-h-[200px]", "min-h-[160px]", "min-h-[120px]", "max-h-[500px]",

    // ===== 渐变与背景 =====
    "bg-white", "bg-white/80", "bg-gray-50", "bg-gray-100", "bg-purple-100",
    "bg-gradient-to-br", "from-purple-50", "via-white", "to-pink-50",
    "bg-gradient-to-r", "from-purple-600", "to-pink-600", "hover:from-purple-700", "hover:to-pink-700",
    "bg-clip-text", "text-transparent",
    "backdrop-blur-md",

    // ===== 边框与圆角 =====
    "border", "border-2", "border-b", "border-t", "border-dashed",
    "border-gray-300", "border-gray-200", "border-gray-100", "border-purple-600", "border-purple-200", "border-white",
    "border-t-transparent", "border-t-purple-600",
    "hover:border-purple-400",
    "rounded-lg", "rounded-xl", "rounded-full",
    "rounded-md",

    // ===== 阴影 =====
    "shadow-sm", "shadow-lg", "hover:shadow-xl",

    // ===== 文本与标题 =====
    "text-white", "text-purple-600", "text-purple-700", "text-red-500", "text-green-600",
    "text-gray-900", "text-gray-700", "text-gray-600", "text-gray-500", "text-gray-400",
    "text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl", "text-3xl", "text-4xl", "text-5xl",
    "md:text-4xl", "md:text-6xl",
    "font-bold", "font-semibold", "font-medium", "font-normal", "font-mono",
    "leading-relaxed",

    // ===== 栅格系统 =====
    "grid", "grid-cols-1", "sm:grid-cols-2", "md:grid-cols-2", "md:grid-cols-4", "lg:grid-cols-2", "lg:grid-cols-4",
    "gap-2", "gap-3", "gap-4", "gap-8",
    "col-span-1", "md:col-span-2",

    // ===== 间距工具 =====
    "space-x-1", "space-x-2", "space-x-4", "space-x-8", "space-y-2", "space-y-3", "space-y-4",
    "mr-1",

    // ===== 过渡与透明度/可见性 =====
    "transition-colors", "transition-all", "duration-200", "duration-300",
    "opacity-0", "opacity-100", "invisible", "visible",
    "group-hover:opacity-100", "group-hover:visible",
    "hover:bg-purple-50", "hover:bg-purple-700", "hover:text-purple-600", "hover:text-purple-800",
    // 交互态
    "focus:ring-2", "focus:ring-purple-500", "focus:border-transparent",
    "disabled:opacity-50", "disabled:cursor-not-allowed",
    // 动画
    "animate-spin",

    // ===== 响应式显示 =====
    "hidden", "block", "inline-block",
    "md:hidden", "md:flex", "sm:flex-row",
    // 响应式间距
    "sm:px-6", "lg:px-8",
    // 其它布局
    "items-baseline", "flex-wrap",

    // ===== 其他 =====
    "z-50", "top-0", "left-0", "right-0", "top-full", "right-0",
    "cursor-pointer", "transform", "hover:scale-105",
    "underline", "overflow-x-auto", "overflow-y-auto",
    // 响应式辅助
    "md:mt-0",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
}

# Image Prompt Landing Page

这是一个复刻的Image Prompt落地页面，使用Next.js 14、TypeScript、Tailwind CSS和Framer Motion构建。

## 功能特性

- 🎨 **现代化设计**: 紫色渐变背景，精美的卡片布局
- 📱 **响应式设计**: 完美适配移动端、平板和桌面
- ⚡ **流畅动画**: 使用Framer Motion实现滚动触发动画
- 🛠️ **TypeScript**: 完整的类型安全
- 🎭 **交互效果**: 悬停效果、按钮动画等

## 页面结构

- **Header**: 导航栏，包含logo、菜单、语言切换
- **Hero Section**: 主标题、描述文字、CTA按钮
- **Features**: 四个功能卡片展示
- **CTA Section**: 行动号召区域
- **Footer**: 页脚信息

## 技术栈

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React Icons

## 本地开发

1. 安装依赖:
```bash
bun install
```

2. 启动开发服务器:
```bash
bun run dev
```

3. 打开浏览器访问: http://localhost:3000

## 构建部署

```bash
bun run build
bun run start
```

## 项目结构

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AnimatedSection.tsx
│   ├── CTASection.tsx
│   ├── ErrorBoundary.tsx
│   ├── FeatureCard.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   └── LoadingSpinner.tsx
└── hooks/
    └── useResponsive.ts
```
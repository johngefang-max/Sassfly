import type { Metadata } from 'next'
import { ErrorBoundary } from '../../components'
import { locales, type Locale } from '../../lib/i18n'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: Locale }
}): Promise<Metadata> {
  const isZh = locale === 'zh'
  
  return {
    title: isZh ? 'Image Prompt - 创造更好的AI艺术' : 'Image Prompt - Create Better AI Art',
    description: isZh ? '激发灵感，增强图像提示，创造杰作' : 'Inspire ideas, Enhance image prompt, Create masterpieces',
    keywords: isZh 
      ? ['AI艺术', '图像提示', 'AI生成器', '创意工具']
      : ['AI art', 'image prompt', 'AI generator', 'creative tools'],
    authors: [{ name: 'ImagePrompt.org' }],
    openGraph: {
      title: isZh ? 'Image Prompt - 创造更好的AI艺术' : 'Image Prompt - Create Better AI Art',
      description: isZh ? '激发灵感，增强图像提示，创造杰作' : 'Inspire ideas, Enhance image prompt, Create masterpieces',
      type: 'website',
      locale: isZh ? 'zh_CN' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: isZh ? 'Image Prompt - 创造更好的AI艺术' : 'Image Prompt - Create Better AI Art',
      description: isZh ? '激发灵感，增强图像提示，创造杰作' : 'Inspire ideas, Enhance image prompt, Create masterpieces',
    },
  }
}

export default function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: Locale }
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) {
    notFound()
  }

  // In nested layouts, do NOT render <html> or <body> tags.
  // Those should only exist in the root layout (app/layout.tsx).
  // Rendering them here can cause build/export errors.
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  )
}
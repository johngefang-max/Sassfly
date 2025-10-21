import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
// 预编译的 Tailwind CSS（通过 build:css 生成），确保在 CI/Vercel 环境样式稳定
import './tw.css'
import { ErrorBoundary } from '../components'
import { AuthProvider } from '../components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Image Prompt - Create Better AI Art',
  description: 'Inspire ideas, Enhance image prompt, Create masterpieces',
  keywords: ['AI art', 'image prompt', 'AI generator', 'creative tools'],
  authors: [{ name: 'ImagePrompt.org' }],
  openGraph: {
    title: 'Image Prompt - Create Better AI Art',
    description: 'Inspire ideas, Enhance image prompt, Create masterpieces',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Prompt - Create Better AI Art',
    description: 'Inspire ideas, Enhance image prompt, Create masterpieces',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  )
}

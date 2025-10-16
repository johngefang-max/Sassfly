import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ErrorBoundary from '../components/ErrorBoundary'

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
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
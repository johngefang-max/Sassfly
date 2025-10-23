import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '../components/AuthProvider'

export const metadata: Metadata = {
  title: 'Sassfly - Member System',
  description: 'Complete member login and management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
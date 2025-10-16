'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import Link from 'next/link'

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  href?: string
  locale?: string
}

export default function FeatureCard({ icon, title, description, href, locale }: FeatureCardProps) {
  const content = (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 p-3 bg-purple-100 rounded-full">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  )

  const card = (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={`feature-card bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl ${
        href ? 'cursor-pointer' : ''
      }`}
    >
      {content}
    </motion.div>
  )

  if (href && locale) {
    return (
      <Link href={`/${locale}${href}`}>
        {card}
      </Link>
    )
  }

  return card
}
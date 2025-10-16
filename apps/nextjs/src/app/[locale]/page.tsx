'use client'

import { motion } from 'framer-motion'
import { Sparkles, Wand2, Eye, Palette } from 'lucide-react'
import Header from '@/components/Header'
import FeatureCard from '@/components/FeatureCard'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'
import AnimatedSection from '@/components/AnimatedSection'
import { useResponsive } from '@/hooks/useResponsive'
import { getTranslations, type Locale } from '@/lib/i18n'

export default function LocalePage({
  params: { locale }
}: {
  params: { locale: Locale }
}) {
  const { isMobile } = useResponsive()
  const t = getTranslations(locale)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Header locale={locale} />
      
      <main className="pt-24">
        {/* Hero Section */}
        <AnimatedSection className="container mx-auto px-4 py-20 text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t.title.split('Image Prompt').map((part, index) => (
              index === 0 ? (
                <span key={index}>{part}</span>
              ) : (
                <span key={index}>
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Image Prompt
                  </span>
                  {part}
                </span>
              )
            ))}
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t.subtitle}
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              {t.tryNow}
            </button>
            <button className="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-600 hover:text-white transition-all duration-300">
              {t.tutorials}
            </button>
          </motion.div>
        </AnimatedSection>

        {/* Features Section */}
        <AnimatedSection className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Sparkles className="w-8 h-8" />}
              title={t.imageToPrompt}
              description={t.imageToPromptDesc}
              href="/image-to-prompt"
              locale={locale}
            />
            <FeatureCard
              icon={<Wand2 className="w-8 h-8" />}
              title={t.magicEnhance}
              description={t.magicEnhanceDesc}
            />
            <FeatureCard
              icon={<Eye className="w-8 h-8" />}
              title={t.aiDescribe}
              description={t.aiDescribeDesc}
            />
            <FeatureCard
              icon={<Palette className="w-8 h-8" />}
              title={t.aiGenerator}
              description={t.aiGeneratorDesc}
            />
          </div>
        </AnimatedSection>

        <CTASection locale={locale} />
      </main>

      <Footer locale={locale} />
    </div>
  )
}
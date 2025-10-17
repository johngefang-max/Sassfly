'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Image, 
  Wand2, 
  Eye, 
  Sparkles, 
  Menu, 
  X,
  Search,
  User,
  ChevronDown
} from 'lucide-react'
import { Header, FeatureCard, CTASection, Footer, AnimatedSection } from '../components'
import Link from 'next/link'
import { useResponsive } from '../hooks'

export default function Home() {
  const { isMobile, isTablet, isDesktop } = useResponsive()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-24 pb-16">
        <AnimatedSection className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Create Better AI Art
            <br />
            with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Image Prompt</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Inspire ideas, Enhance image prompt, Create masterpieces
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/en/image-to-prompt" className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                Try it now!
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/en" className="inline-block border border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                Tutorials
              </Link>
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Features Section */}
        <AnimatedSection 
          delay={0.2}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20"
        >
          <FeatureCard
            icon={<Image className="w-8 h-8 text-purple-600" />}
            title="Image to Prompt"
            description="Convert image to Prompt to generate your own image"
            href="/image-to-prompt"
            locale="en"
          />
          <FeatureCard
            icon={<Wand2 className="w-8 h-8 text-purple-600" />}
            title="Magic Enhance"
            description="Transform simple text into detailed descriptive image prompt"
            href="/magic-enhance"
            locale="en"
          />
          <FeatureCard
            icon={<Eye className="w-8 h-8 text-purple-600" />}
            title="AI Describe Image"
            description="Let AI help you understand and analyze any image in detail"
            href="/ai-describe"
            locale="en"
          />
          <FeatureCard
            icon={<Sparkles className="w-8 h-8 text-purple-600" />}
            title="AI Image Generator"
            description="Transform your image prompt into stunning visuals with AI-powered generation"
            href="/ai-image-generator"
            locale="en"
          />
        </AnimatedSection>

        {/* CTA Section */}
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
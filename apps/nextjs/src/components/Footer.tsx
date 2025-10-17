'use client'

import { motion } from 'framer-motion'
import { Github, Twitter, Mail, Heart } from 'lucide-react'
import Link from 'next/link'
import { type Locale } from '../lib/i18n'

interface FooterProps {
  locale?: Locale
}

export default function Footer({ locale }: FooterProps) {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">IP</span>
              </div>
              <span className="text-xl font-bold text-gray-900">ImagePrompt.org</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              The ultimate platform for creating better AI art with enhanced image prompts. 
              Transform your creative ideas into stunning visual masterpieces.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                whileHover={{ scale: 1.1 }}
                href="#" 
                className="text-gray-400 hover:text-purple-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1 }}
                href="#" 
                className="text-gray-400 hover:text-purple-600 transition-colors"
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1 }}
                href="#" 
                className="text-gray-400 hover:text-purple-600 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href={`/${locale ?? 'en'}`} className="text-gray-600 hover:text-purple-600 transition-colors">Home</Link></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">About</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Features</a></li>
              <li><Link href={`/${locale ?? 'en'}/pricing`} className="text-gray-600 hover:text-purple-600 transition-colors">Pricing</Link></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Tools</h3>
            <ul className="space-y-2">
              <li><Link href={`/${locale ?? 'en'}/image-to-prompt`} className="text-gray-600 hover:text-purple-600 transition-colors">Image to Prompt</Link></li>
              <li><Link href={`/${locale ?? 'en'}/magic-enhance`} className="text-gray-600 hover:text-purple-600 transition-colors">Magic Enhance</Link></li>
              <li><Link href={`/${locale ?? 'en'}/ai-describe`} className="text-gray-600 hover:text-purple-600 transition-colors">AI Describe</Link></li>
              <li><Link href={`/${locale ?? 'en'}/ai-image-generator`} className="text-gray-600 hover:text-purple-600 transition-colors">AI Generator</Link></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Tutorials</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © 2024 ImagePrompt.org. All rights reserved.
          </p>
          <div className="flex items-center space-x-1 text-gray-600 text-sm mt-4 md:mt-0">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>for creators worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
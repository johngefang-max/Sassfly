'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Search, User, ChevronDown, Globe } from 'lucide-react'
import { getTranslations, type Locale } from '../lib/i18n'
import Link from 'next/link'

interface HeaderProps {
  locale?: Locale
}

// 明确声明组件类型
const Header = ({ locale = 'en' }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showLanguageSwitch, setShowLanguageSwitch] = useState(false)
  const t = getTranslations(locale)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      {/* Language Switch Banner */}
      {showLanguageSwitch && (
        <div className="bg-purple-100 text-purple-800 text-sm py-2 px-4 text-center">
          <span>Would you like to switch to 简体中文? </span>
          <button className="underline font-semibold">YES</button>
          <button 
            onClick={() => setShowLanguageSwitch(false)}
            className="ml-4 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      )}
      
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IP</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ImagePrompt.org</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href={`/${locale}`} className="text-gray-700 hover:text-purple-600 transition-colors">{t.home}</Link>
            <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors">{t.inspiration}</a>
            <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors">{t.tutorials}</a>
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-purple-600 transition-colors">
                {t.tools} <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600">{t.imageToPrompt}</a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600">{t.magicEnhance}</a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600">{t.aiDescribe}</a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600">{t.aiGenerator}</a>
              </div>
            </div>
            <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors">{t.pricing}</a>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setShowLanguageSwitch(!showLanguageSwitch)}
                className="p-2 text-gray-600 hover:text-purple-600 transition-colors flex items-center"
              >
                <Globe className="w-5 h-5 mr-1" />
                <span className="text-sm">{locale === 'zh' ? '中' : 'EN'}</span>
              </button>
              {showLanguageSwitch && (
                <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border">
                  <Link 
                    href="/en" 
                    className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                    onClick={() => setShowLanguageSwitch(false)}
                  >
                    English
                  </Link>
                  <Link 
                    href="/zh" 
                    className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                    onClick={() => setShowLanguageSwitch(false)}
                  >
                    中文
                  </Link>
                </div>
              )}
            </div>
            <button className="p-2 text-gray-600 hover:text-purple-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-purple-600 transition-colors">
              <User className="w-5 h-5" />
            </button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              {t.login}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-purple-600 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 py-4 border-t border-gray-200"
          >
            <div className="flex flex-col space-y-4">
              <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors">Home</a>
              <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors">Inspiration</a>
              <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors">Tutorials</a>
              <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors">Tools</a>
              <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors">Pricing</a>
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                <button className="p-2 text-gray-600 hover:text-purple-600 transition-colors">
                  <Search className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-purple-600 transition-colors">
                  <User className="w-5 h-5" />
                </button>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Login
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  )
}

export default Header;
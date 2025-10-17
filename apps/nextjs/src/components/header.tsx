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
  // 新增：工具菜单的显隐状态，支持点击与悬浮两种触发方式
  const [isToolsOpen, setIsToolsOpen] = useState(false)
  const t = getTranslations(locale)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      {/* Language Switch Banner */}
      {showLanguageSwitch && (
        <div className="bg-purple-100 text-purple-800 text-sm py-2 px-4 text-center">
          <span>Would you like to switch to 简体中文? </span>
          {/* 将 YES 改为可点击跳转的 Link */}
          <Link href="/zh" className="underline font-semibold">YES</Link>
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
            {/* 改为支持点击与悬浮的下拉菜单 */}
            <div 
              className="relative"
              onMouseEnter={() => setIsToolsOpen(true)}
              onMouseLeave={() => setIsToolsOpen(false)}
            >
              <button 
                type="button"
                aria-haspopup="menu"
                aria-expanded={isToolsOpen}
                onClick={() => setIsToolsOpen(v => !v)}
                className="flex items-center text-gray-700 hover:text-purple-600 transition-colors"
              >
                {t.tools} <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              <div 
                role="menu"
                className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-20 transition-all duration-200 ${isToolsOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
              >
                <Link href={`/${locale}/image-to-prompt`} className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600">{t.imageToPrompt}</Link>
                <Link href={`/${locale}/magic-enhance`} className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600">{t.magicEnhance}</Link>
                <Link href={`/${locale}/ai-describe`} className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600">{t.aiDescribe}</Link>
                <Link href={`/${locale}/ai-image-generator`} className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600">{t.aiGenerator}</Link>
              </div>
            </div>
            <Link href={`/${locale}/pricing`} className="text-gray-700 hover:text-purple-600 transition-colors">{t.pricing}</Link>
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
            <Link href="/login" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              {t.login}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => {
              // 关闭工具菜单，避免移动端展开后影响遮罩
              setIsToolsOpen(false)
              setIsMenuOpen(!isMenuOpen)
            }}
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
              <Link href={`/${locale}`} className="text-gray-700 hover:text-purple-600 transition-colors">{t.home}</Link>
              <Link href={`/${locale}/image-to-prompt`} className="text-gray-700 hover:text-purple-600 transition-colors">{t.imageToPrompt}</Link>
              <Link href={`/${locale}/magic-enhance`} className="text-gray-700 hover:text-purple-600 transition-colors">{t.magicEnhance}</Link>
              <Link href={`/${locale}/ai-describe`} className="text-gray-700 hover:text-purple-600 transition-colors">{t.aiDescribe}</Link>
              <Link href={`/${locale}/ai-image-generator`} className="text-gray-700 hover:text-purple-600 transition-colors">{t.aiGenerator}</Link>
              <Link href={`/${locale}/pricing`} className="text-gray-700 hover:text-purple-600 transition-colors">{t.pricing}</Link>
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                <button className="p-2 text-gray-600 hover:text-purple-600 transition-colors">
                  <Search className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-purple-600 transition-colors">
                  <User className="w-5 h-5" />
                </button>
                <Link href="/login" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  )
}

export default Header;
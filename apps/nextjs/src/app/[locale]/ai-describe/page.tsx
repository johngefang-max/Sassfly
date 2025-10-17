'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, Image as ImageIcon, Copy, Sparkles, Languages } from 'lucide-react'
import { getTranslations, type Locale } from '../../../lib/i18n'

interface AiDescribePageProps {
  params: {
    locale: Locale
  }
}

const languages = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' }
]

export default function AiDescribePage({ params }: AiDescribePageProps) {
  const t = getTranslations(params.locale)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [selectedLanguage, setSelectedLanguage] = useState<string>(params.locale || 'en')
  const [description, setDescription] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateDescription = async () => {
    if (!selectedImage) return
    setIsGenerating(true)
    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64Image = e.target?.result as string

        // 针对不同语言的默认查询
        const queries: Record<string, string> = {
          zh: '请详细描述这个图片的内容、构图、色彩、材质、光线和氛围。',
          en: 'Please describe in detail the content, composition, colors, materials, lighting and atmosphere of this image.',
          ja: 'この画像の内容、構図、色彩、質感、光、雰囲気を詳しく説明してください。',
          es: 'Describe en detalle el contenido, la composición, los colores, los materiales, la iluminación y la atmósfera de esta imagen.',
          fr: 'Décrivez en détail le contenu, la composition, les couleurs, les matériaux, l’éclairage et l’atmosphère de cette image.',
          de: 'Beschreiben Sie detailliert den Inhalt, die Komposition, die Farben, die Materialien, die Beleuchtung und die Atmosphäre dieses Bildes.'
        }

        const userQuery = queries[selectedLanguage] || queries['en']

        try {
          const response = await fetch('/api/image-to-prompt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image: base64Image,
              promptType: 'normal',
              userQuery,
              language: selectedLanguage,
            }),
          })

          const data = await response.json()
          if (data.success) {
            setDescription(data.prompt)
          } else {
            setDescription(`生成描述时出现错误: ${data.error || '未知错误'}`)
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : '网络错误，请稍后重试'
          setDescription(`网络错误: ${message}`)
        }

        setIsGenerating(false)
      }
      reader.readAsDataURL(selectedImage)
    } catch (error) {
      setDescription('图片处理失败，请重试。')
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    if (!description) return
    navigator.clipboard.writeText(description)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.aiDescribe}</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t.aiDescribeDesc}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：上传图片 */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-4">
                <Upload className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-purple-700">{t.uploadImage}</span>
              </div>

              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="max-w-full max-h-64 mx-auto rounded-lg" />
                ) : (
                  <div>
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">{t.uploadPhotoOrDrag}</p>
                    <p className="text-sm text-gray-400">{t.pngJpgWebp}</p>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
            </div>

            {/* 语言选择 */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Languages className="w-4 h-4 text-purple-600" />
                <h3 className="text-lg font-semibold">{t.promptLanguage}</h3>
              </div>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>

            {/* 生成按钮 */}
            <button
              onClick={generateDescription}
              disabled={!selectedImage || isGenerating}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  {t.generating}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {t.generatePrompt}
                </>
              )}
            </button>
          </div>

          {/* 右侧：预览与描述 */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">{t.imagePreview}</h3>
              <div className="bg-gray-50 rounded-lg p-8 text-center min-h-[200px] flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="max-w-full max-h-full rounded-lg" />
                ) : (
                  <div className="text-gray-400">
                    <ImageIcon className="w-16 h-16 mx-auto mb-2" />
                    <p>{t.yourImageWillShowHere}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{t.generatedPrompt}</h3>
                {description && (
                  <button onClick={copyToClipboard} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                    <Copy className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-4 min-h-[120px] max-h-[500px] overflow-y-auto">
                {description ? (
                  <div className="text-gray-900 whitespace-pre-wrap">{description}</div>
                ) : (
                  <p className="text-gray-400">{t.generatedPromptWillAppear}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 底部说明 */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.highlyAccurateGeneration}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t.convertOriginalImages}</p>
        </div>
      </div>
    </div>
  )
}
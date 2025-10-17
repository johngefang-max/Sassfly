'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Image as ImageIcon, Sparkles, Copy } from 'lucide-react'
import { getTranslations, type Locale } from '../../../lib/i18n'

interface AiImageGeneratorPageProps {
  params: {
    locale: Locale
  }
}

type Model = 'midjourney' | 'flux' | 'stableDiffusion'

function buildPrompt(input: string, model: Model, locale: Locale) {
  const isZh = locale === 'zh'
  const base = input.trim()
  if (!base) return isZh ? '请输入提示词。' : 'Please enter a prompt.'

  const common = isZh
    ? '超写实, 电影级光影, 高细节, 8k, 超清'
    : 'hyper-realistic, cinematic lighting, high detail, 8k, ultra-sharp'

  const mj = isZh
    ? `--v 6 --style raw --ar 3:2 --chaos 8 --s 750 --quality 2`
    : `--v 6 --style raw --ar 3:2 --chaos 8 --s 750 --quality 2`

  const sd = isZh
    ? `Steps: 30, CFG: 7, Sampler: DPM++ 2M Karras, Hires Fix: yes`
    : `Steps: 30, CFG: 7, Sampler: DPM++ 2M Karras, Hires Fix: yes`

  const flux = isZh
    ? `Flux 推荐：更强的细节表达与自然风格，适合写实摄影场景`
    : `Flux recommended: stronger detail rendering and natural aesthetics; great for realistic photography`

  const lines: string[] = []
  lines.push(`### ${isZh ? '最终生成提示词' : 'Final Generation Prompt'}`)
  lines.push(`\n${isZh ? '主题' : 'Subject'}: ${base}`)
  lines.push(`\n${isZh ? '通用风格' : 'Common Style'}: ${common}`)

  if (model === 'midjourney') {
    lines.push(`\n${isZh ? 'Midjourney 参数' : 'Midjourney Parameters'}: ${mj}`)
  } else if (model === 'stableDiffusion') {
    lines.push(`\n${isZh ? 'Stable Diffusion 参数' : 'Stable Diffusion Parameters'}: ${sd}`)
  } else {
    lines.push(`\nFlux: ${flux}`)
  }

  return lines.join('\n')
}

export default function AiImageGeneratorPage({ params }: AiImageGeneratorPageProps) {
  const t = getTranslations(params.locale)
  const [model, setModel] = useState<Model>('midjourney')
  const [prompt, setPrompt] = useState('')
  const [finalPrompt, setFinalPrompt] = useState('')
  const [images, setImages] = useState<string[]>([])

  const generateDemo = () => {
    const p = buildPrompt(prompt, model, params.locale)
    setFinalPrompt(p)
    // 生成占位图（演示用），使用随机图片源
    const list = Array.from({ length: 6 }, (_, i) => `https://picsum.photos/seed/${model}-${i}/600/400`)
    setImages(list)
  }

  const copyToClipboard = () => {
    if (!finalPrompt) return
    navigator.clipboard.writeText(finalPrompt)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{t.aiGenerator}</h1>
            <p className="text-lg text-gray-600">{t.aiGeneratorDesc}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左侧：提示词与模型选择 */}
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <label className="block text-sm font-medium text-gray-700">{params.locale === 'zh' ? '选择模型' : 'Select Model'}</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value as Model)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="midjourney">Midjourney</option>
            <option value="flux">Flux</option>
            <option value="stableDiffusion">Stable Diffusion</option>
          </select>

          <label className="block text-sm font-medium text-gray-700">{params.locale === 'zh' ? '输入提示词' : 'Enter Prompt'}</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={10}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder={params.locale === 'zh' ? '例如：清晨的山谷，薄雾，暖阳，野花盛开' : 'e.g., a valley at dawn, mist, warm sunlight, wildflowers blooming'}
          />

          <button
            onClick={generateDemo}
            className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {params.locale === 'zh' ? '生成演示' : 'Generate Demo'}
          </button>

          {/* 生成的最终提示词 */}
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{params.locale === 'zh' ? '最终提示词' : 'Final Prompt'}</h3>
              {finalPrompt && (
                <button onClick={copyToClipboard} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="bg-gray-50 rounded-lg p-4 min-h-[160px] whitespace-pre-wrap">
              {finalPrompt ? (
                <div className="text-gray-900">{finalPrompt}</div>
              ) : (
                <p className="text-gray-400">{params.locale === 'zh' ? '最终提示词会显示在此处' : 'Final prompt will appear here'}</p>
              )}
            </div>
          </div>
        </div>

        {/* 右侧：占位图网格 */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <ImageIcon className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-700">{params.locale === 'zh' ? '演示图像（占位图）' : 'Demo Images (Placeholders)'}</span>
          </div>
          {images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {images.map((src, i) => (
                <img key={i} src={src} alt={`Demo ${i + 1}`} className="w-full h-auto rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-400">{params.locale === 'zh' ? '点击“生成演示”后将在这里展示占位图' : 'Click "Generate Demo" to show placeholder images here'}</p>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-4">
            {params.locale === 'zh'
              ? '说明：为避免接入外部付费图片生成服务，此处展示占位图以复刻页面体验。可按需接入 Replicate/SD/Flux 等服务实现真实生成。'
              : 'Note: To avoid integrating paid external image generation services, placeholder images are shown to replicate page experience. You can integrate Replicate/SD/Flux for real generation.'}
          </p>
        </div>
      </div>
    </div>
  )
}
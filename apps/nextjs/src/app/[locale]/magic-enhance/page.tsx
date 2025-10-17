'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wand2, Copy, Sparkles } from 'lucide-react'
import { getTranslations, type Locale } from '../../../lib/i18n'

interface MagicEnhancePageProps {
  params: {
    locale: Locale
  }
}

function enhancePrompt(original: string, locale: Locale) {
  const isZh = locale === 'zh'
  const trim = (s: string) => s.trim()
  const base = trim(original)
  if (!base) return isZh ? '请输入需要增强的提示词。' : 'Please enter a prompt to enhance.'

  const sectionsZh = {
    title: '增强后的提示词',
    subject: '主题',
    scene: '场景与构图',
    style: '风格与质感',
    lighting: '光线与氛围',
    camera: '镜头与参数',
    details: '细节优化',
    paramsMj: 'Midjourney 参数建议',
    paramsSd: 'Stable Diffusion 参数建议',
  }

  const sectionsEn = {
    title: 'Enhanced Prompt',
    subject: 'Subject',
    scene: 'Scene & Composition',
    style: 'Style & Texture',
    lighting: 'Lighting & Mood',
    camera: 'Lens & Parameters',
    details: 'Detail Optimization',
    paramsMj: 'Midjourney Parameter Suggestions',
    paramsSd: 'Stable Diffusion Parameter Suggestions',
  }

  const S = isZh ? sectionsZh : sectionsEn

  const mjParams = isZh
    ? '--v 6 --style raw --ar 3:2 --chaos 10 --s 700 --quality 2'
    : '--v 6 --style raw --ar 3:2 --chaos 10 --s 700 --quality 2'

  const sdParams = isZh
    ? 'Steps: 30, CFG: 7, Sampler: DPM++ 2M Karras, Hires fix: yes'
    : 'Steps: 30, CFG: 7, Sampler: DPM++ 2M Karras, Hires fix: yes'

  const styleKeywords = isZh
    ? '超写实, 电影级, 高动态范围, 体积光, 细腻质感, 高细节, 8k, 超清'
    : 'hyper-realistic, cinematic, HDR, volumetric light, delicate texture, high detail, 8k, ultra-sharp'

  const composition = isZh
    ? '三分法构图, 背景虚化, 主体清晰, 层次分明'
    : 'rule of thirds, bokeh background, sharp subject, layered depth'

  const camera = isZh
    ? '35mm 定焦镜头, f/1.8, ISO 200, 1/160s'
    : '35mm prime lens, f/1.8, ISO 200, 1/160s'

  const lines = [
    `### ${S.title}`,
    `\n${S.subject}: ${base}`,
    `\n${S.scene}: ${composition}`,
    `\n${S.style}: ${styleKeywords}`,
    `\n${S.lighting}: soft rim light, global illumination, ${isZh ? '自然光与补光平衡' : 'balanced natural and fill light'}`,
    `\n${S.camera}: ${camera}`,
    `\n${S.details}: realistic skin/texture, crisp edges, subtle film grain`,
    `\n${S.paramsMj}: ${mjParams}`,
    `\n${S.paramsSd}: ${sdParams}`,
  ]

  return lines.join('\n')
}

export default function MagicEnhancePage({ params }: MagicEnhancePageProps) {
  const t = getTranslations(params.locale)
  const [input, setInput] = useState('')
  const [enhanced, setEnhanced] = useState('')

  const onEnhance = () => {
    const result = enhancePrompt(input, params.locale)
    setEnhanced(result)
  }

  const copyToClipboard = () => {
    if (!enhanced) return
    navigator.clipboard.writeText(enhanced)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{t.magicEnhance}</h1>
            <p className="text-lg text-gray-600">{t.magicEnhanceDesc}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左侧：输入 */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Wand2 className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-700">{params.locale === 'zh' ? '输入原始提示词' : 'Input Original Prompt'}</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={10}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder={params.locale === 'zh' ? '例如：一只在森林里的狐狸，阳光穿过树叶' : 'e.g., a fox in the forest with sunlight through leaves'}
          />

          <button
            onClick={onEnhance}
            className="mt-4 w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {params.locale === 'zh' ? '增强提示词' : 'Enhance Prompt'}
          </button>
        </div>

        {/* 右侧：输出 */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{params.locale === 'zh' ? '增强结果' : 'Enhanced Result'}</h3>
            {enhanced && (
              <button onClick={copyToClipboard} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Copy className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="bg-gray-50 rounded-lg p-4 min-h-[200px] whitespace-pre-wrap">
            {enhanced ? (
              <div className="text-gray-900">{enhanced}</div>
            ) : (
              <p className="text-gray-400">{params.locale === 'zh' ? '增强后的提示词将显示在这里' : 'Enhanced prompt will appear here'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
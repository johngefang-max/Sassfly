'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, Image as ImageIcon, Download, Copy, Sparkles } from 'lucide-react'
import { getTranslations, type Locale } from '../../../lib/i18n'

interface ImageToPromptPageProps {
  params: {
    locale: Locale
  }
}

const getAiModels = (t: any) => [
  {
    id: 'normal',
    name: t.generalImagePrompt,
    description: t.generalImagePromptDesc,
    icon: '🎨'
  },
  {
    id: 'flux',
    name: 'Flux',
    description: t.fluxDesc,
    icon: '⚡'
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    description: t.midjourneyDesc,
    icon: '🎭'
  },
  {
    id: 'stableDiffusion',
    name: 'Stable Diffusion',
    description: t.stableDiffusionDesc,
    icon: '🔮'
  }
]

const languages = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' }
]

export default function ImageToPromptPage({ params }: ImageToPromptPageProps) {
  const t = getTranslations(params.locale)
  const aiModels = getAiModels(t)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [selectedModel, setSelectedModel] = useState('general')
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
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

  const generatePrompt = async () => {
    if (!selectedImage) return
    
    setIsGenerating(true)
    
    try {
      // 将图片转换为 base64
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64Image = e.target?.result as string
        
        // 根据选择的模型和语言设置不同的用户查询
        const getModelQueries = (lang: string) => {
          const queries: Record<string, Record<string, string>> = {
            'zh': {
              normal: '请详细描述这个图片的内容、构图、色彩和氛围',
              flux: '请为这个图片生成适合 Flux 模型的提示词，包含技术参数和风格描述',
              midjourney: '请为这个图片生成 Midjourney 风格的提示词，包含参数设置',
              stableDiffusion: '请为这个图片生成 Stable Diffusion 格式的提示词，包含权重和质量标签'
            },
            'en': {
              normal: 'Please describe the content, composition, colors and atmosphere of this image in detail',
              flux: 'Please generate prompts suitable for Flux model for this image, including technical parameters and style descriptions',
              midjourney: 'Please generate Midjourney-style prompts for this image, including parameter settings',
              stableDiffusion: 'Please generate Stable Diffusion format prompts for this image, including weights and quality tags'
            },
            'ja': {
              normal: 'この画像の内容、構図、色彩、雰囲気を詳しく説明してください',
              flux: 'この画像に対してFluxモデルに適したプロンプトを生成してください。技術パラメータとスタイル説明を含めてください',
              midjourney: 'この画像に対してMidjourneyスタイルのプロンプトを生成してください。パラメータ設定を含めてください',
              stableDiffusion: 'この画像に対してStable Diffusion形式のプロンプトを生成してください。重みと品質タグを含めてください'
            },
            'es': {
              normal: 'Por favor describe detalladamente el contenido, composición, colores y atmósfera de esta imagen',
              flux: 'Por favor genera prompts adecuados para el modelo Flux para esta imagen, incluyendo parámetros técnicos y descripciones de estilo',
              midjourney: 'Por favor genera prompts estilo Midjourney para esta imagen, incluyendo configuraciones de parámetros',
              stableDiffusion: 'Por favor genera prompts formato Stable Diffusion para esta imagen, incluyendo pesos y etiquetas de calidad'
            },
            'fr': {
              normal: 'Veuillez décrire en détail le contenu, la composition, les couleurs et l\'atmosphère de cette image',
              flux: 'Veuillez générer des prompts adaptés au modèle Flux pour cette image, incluant les paramètres techniques et les descriptions de style',
              midjourney: 'Veuillez générer des prompts style Midjourney pour cette image, incluant les paramètres de configuration',
              stableDiffusion: 'Veuillez générer des prompts format Stable Diffusion pour cette image, incluant les poids et les balises de qualité'
            },
            'de': {
              normal: 'Bitte beschreiben Sie detailliert den Inhalt, die Komposition, die Farben und die Atmosphäre dieses Bildes',
              flux: 'Bitte generieren Sie für dieses Bild geeignete Prompts für das Flux-Modell, einschließlich technischer Parameter und Stilbeschreibungen',
              midjourney: 'Bitte generieren Sie Midjourney-Stil-Prompts für dieses Bild, einschließlich Parametereinstellungen',
              stableDiffusion: 'Bitte generieren Sie Stable Diffusion-Format-Prompts für dieses Bild, einschließlich Gewichtungen und Qualitäts-Tags'
            }
          };
          
          return queries[lang] || queries['en'];
        }
        
        const modelQueries = getModelQueries(selectedLanguage)
        
        // 获取默认描述文本
        const getDefaultQuery = (lang: string) => {
          const defaults: Record<string, string> = {
            'zh': '请描述一下这个图片',
            'en': 'Please describe this image',
            'ja': 'この画像を説明してください',
            'es': 'Por favor describe esta imagen',
            'fr': 'Veuillez décrire cette image',
            'de': 'Bitte beschreiben Sie dieses Bild'
          };
          return defaults[lang] || defaults['en'];
        }
        
        const userQuery = modelQueries[selectedModel as keyof typeof modelQueries] || getDefaultQuery(selectedLanguage)
        
        try {
          console.log('=== 前端开始调用 API ===');
          console.log('请求参数:', {
            promptType: selectedModel,
            userQuery: userQuery,
            imageSize: base64Image.length
          });

          const response = await fetch('/api/image-to-prompt', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              image: base64Image,
              promptType: selectedModel,
              userQuery: userQuery,
              language: selectedLanguage,
            }),
          })
          
          console.log('API 响应状态:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok
          });

          const data = await response.json()
          console.log('API 响应数据:', data);
          
          if (data.success) {
            console.log('成功获取提示词，长度:', data.prompt.length);
            setGeneratedPrompt(data.prompt)
          } else {
            console.error('API 返回错误:', data);
            setGeneratedPrompt(`生成提示词时出现错误: ${data.error || '未知错误'}`)
          }
        } catch (error) {
          console.error('=== 前端 API 调用失败 ===');
          console.error('错误类型:', error?.constructor?.name);
          console.error('错误消息:', error?.message);
          console.error('完整错误:', error);
          setGeneratedPrompt(`网络错误: ${error?.message || '请检查连接后重试'}`)
        }
        
        setIsGenerating(false)
      }
      
      reader.readAsDataURL(selectedImage)
    } catch (error) {
      console.error('图片处理失败:', error)
      setGeneratedPrompt('图片处理失败，请重试。')
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt)
  }

  // 格式化显示提示词内容
  const formatPromptContent = (content: string) => {
    if (!content) return null

    // 分割内容为不同部分
    const sections = content.split(/###\s+/)
    
    return sections.map((section, index) => {
      if (!section.trim()) return null
      
      const lines = section.trim().split('\n')
      const title = lines[0]
      const body = lines.slice(1).join('\n')
      
      if (index === 0 && !title.includes('图片描述') && !title.includes('Midjourney')) {
        // 如果第一部分不是标题，直接显示
        return (
          <div key={index} className="mb-4">
            <pre className="whitespace-pre-wrap text-gray-900 font-mono text-sm">{section}</pre>
          </div>
        )
      }
      
      return (
        <div key={index} className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-2 text-lg">{title}</h4>
          <div className="text-gray-700">
            {body.includes('```') ? (
              // 处理代码块
              body.split('```').map((part, partIndex) => {
                if (partIndex % 2 === 1) {
                  // 代码块内容
                  return (
                    <div key={partIndex} className="bg-gray-100 rounded-lg p-3 my-2 font-mono text-sm overflow-x-auto">
                      <pre className="whitespace-pre-wrap">{part.trim()}</pre>
                    </div>
                  )
                } else {
                  // 普通文本
                  return part.trim() ? (
                    <p key={partIndex} className="whitespace-pre-wrap mb-2">{part.trim()}</p>
                  ) : null
                }
              })
            ) : (
              <p className="whitespace-pre-wrap">{body}</p>
            )}
          </div>
        </div>
      )
    }).filter(Boolean)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t.freeImageToPromptGenerator}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t.convertImageToPrompt}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <button className="px-6 py-2 bg-purple-600 text-white rounded-md flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              {t.imageToPrompt}
            </button>
            <button className="px-6 py-2 text-gray-600 hover:text-gray-900">
              {t.textToPrompt}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload */}
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex gap-4 mb-4">
                <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium">
                  {t.uploadImage}
                </button>
                <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
                  {t.inputImageUrl}
                </button>
              </div>

              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full max-h-64 mx-auto rounded-lg"
                  />
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">{t.uploadPhotoOrDrag}</p>
                    <p className="text-sm text-gray-400">{t.pngJpgWebp}</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* AI Model Selection */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">{t.selectAiModel}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {aiModels.map((model) => (
                  <div
                    key={model.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedModel === model.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedModel(model.id)}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{model.icon}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">{model.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{model.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Language Selection */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">{t.promptLanguage}</h3>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Generate Button */}
            <button
              onClick={generatePrompt}
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

          {/* Right Column - Preview and Results */}
          <div className="space-y-6">
            {/* Image Preview */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">{t.imagePreview}</h3>
              <div className="bg-gray-50 rounded-lg p-8 text-center min-h-[200px] flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full max-h-full rounded-lg"
                  />
                ) : (
                  <div className="text-gray-400">
                    <ImageIcon className="w-16 h-16 mx-auto mb-2" />
                    <p>{t.yourImageWillShowHere}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Generated Prompt */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{t.generatedPrompt}</h3>
                {generatedPrompt && (
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-4 min-h-[120px] max-h-[500px] overflow-y-auto">
                {generatedPrompt ? (
                  <div className="text-gray-900">
                    {formatPromptContent(generatedPrompt)}
                  </div>
                ) : (
                  <p className="text-gray-400">{t.generatedPromptWillAppear}</p>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>{t.analyzeSpecificAspects}</strong> {t.detailedAnalysis}{' '}
                <a href="#" className="text-blue-600 underline">{t.tryAiDescribeImage}</a> {t.detailedAnalysis}.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t.highlyAccurateGeneration}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t.convertOriginalImages}
          </p>
        </div>
      </div>
    </div>
  )
}
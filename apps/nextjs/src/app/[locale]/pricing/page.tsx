'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { getTranslations, type Locale } from '../../../lib/i18n'

interface PricingPageProps {
  params: {
    locale: Locale
  }
}

export default function PricingPage({ params }: PricingPageProps) {
  const t = getTranslations(params.locale)
  const isZh = params.locale === 'zh'

  const plans = [
    {
      name: isZh ? '免费版' : 'Free',
      price: isZh ? '¥0' : '$0',
      period: isZh ? '/ 永久' : '/ forever',
      features: [
        isZh ? '图像转提示词（每日限额）' : 'Image to Prompt (daily quota)',
        isZh ? 'AI图像描述（每日限额）' : 'AI Describe (daily quota)',
        isZh ? '本地提示词增强' : 'Local Prompt Enhance',
      ],
      cta: isZh ? '立即开始' : 'Get Started',
    },
    {
      name: isZh ? '专业版（即将上线）' : 'Pro (Coming Soon)',
      price: isZh ? '¥待定' : '$TBD',
      period: isZh ? '/ 月' : '/ month',
      features: [
        isZh ? '更高调用额度与更快响应' : 'Higher quota & faster responses',
        isZh ? '更多模型支持（Flux/MJ/SD）' : 'More model support (Flux/MJ/SD)',
        isZh ? '优先队列与支持服务' : 'Priority queue & support',
      ],
      cta: isZh ? '敬请期待' : 'Stay Tuned',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t.pricing}</h1>
          <p className="text-lg text-gray-600">{isZh ? '透明定价，满足不同创作需求' : 'Transparent pricing for different creative needs'}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div key={plan.name} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <div className="text-3xl font-bold text-gray-900">{plan.price}<span className="text-base font-normal text-gray-500">{plan.period}</span></div>
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-gray-700">
                    <Check className="w-5 h-5 text-green-600" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-6 w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700">
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
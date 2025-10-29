"use client";

import { Header } from "../../../components";
import { Gem, Image as ImageIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "../../../lib/i18n";

interface MySubscriptionProps { params: { locale: Locale } }

export default function MySubscriptionLocalized({ params }: MySubscriptionProps) {
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  const isZh = params.locale === 'zh';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Header locale={params.locale} />
      {/* Sub Navigation */}
      <div className="bg-white/60 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-8 py-4">
            <a href={`/${params.locale}/my-subscription`} className="flex items-center text-purple-700 font-medium">
              <Gem className="w-5 h-5 mr-2" />
              {isZh ? '我的订阅' : 'My Subscription'}
            </a>
            <a href={`/${params.locale}/my-arts`} className="flex items-center text-gray-600 hover:text-purple-700">
              <ImageIcon className="w-5 h-5 mr-2" />
              {isZh ? '我的作品' : 'My Arts'}
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{isZh ? '我的订阅' : 'My Subscription'}</h1>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Subscription Status */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{isZh ? '订阅状态' : 'Subscription Status'}</h3>
            </div>
            <div className="mt-6">
              <p className="text-2xl font-bold text-purple-700">{isZh ? '免费版' : 'Free Plan'}</p>
              <button className="mt-4 inline-flex items-center bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 text-sm">
                {isZh ? '立即升级' : 'Upgrade Now'}
              </button>
            </div>
          </div>

          {/* Credit Overview */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{isZh ? '积分概览' : 'Credit Overview'}</h3>
            </div>
            <div className="mt-6">
              <p className="text-xl font-medium text-gray-900">
                {isZh ? '总积分：' : 'Total Credits:'} <span className="font-bold text-blue-700">2</span>
              </p>
              <button className="mt-4 inline-flex items-center bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200 text-sm">
                {isZh ? '获取更多' : 'Get More'}
              </button>
            </div>
          </div>
        </div>

        {/* Credit History */}
        <div className="mt-10 bg-white rounded-xl shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">{isZh ? '积分历史' : 'Credit History'}</h2>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-4 text-sm font-medium text-gray-500 pb-2">
              <div>{isZh ? '日期' : 'DATE'}</div>
              <div>{isZh ? '数量' : 'AMOUNT'}</div>
              <div>{isZh ? '类型' : 'TYPE'}</div>
              <div>{isZh ? '详情' : 'DETAIL'}</div>
            </div>
            <div className="grid grid-cols-4 text-sm text-gray-800 py-3 border-t">
              <div>2025/10/28 12:19:09</div>
              <div>2</div>
              <div>{isZh ? '注册' : 'REGISTRATION'}</div>
              <div></div>
            </div>
          </div>
          <div className="px-6 py-6 text-sm text-gray-600 border-t">
            {isZh ? '如需帮助，请联系' : 'For any inquiries or assistance, feel free to contact'}{' '}
            <a href="mailto:eric@imageprompt.org" className="text-blue-600 hover:underline">eric@imageprompt.org</a>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "../../../components";
import type { Locale } from "../../../lib/i18n";

interface DashboardProps {
  params: { locale: Locale };
}

export default function DashboardLocalized({ params }: DashboardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLogins: 0,
    lastLogin: "",
    accountLevel: "Free",
    usedFeatures: 0,
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }
    setStats({
      totalLogins: 5,
      lastLogin: new Date().toLocaleDateString(),
      accountLevel: session?.user?.email ? (params.locale === 'zh' ? "标准版" : "Standard") : (params.locale === 'zh' ? "免费版" : "Free"),
      usedFeatures: 3,
    });
    setIsLoading(false);
  }, [session, status, router, params.locale]);

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const isZh = params.locale === "zh";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Global Header */}
      <Header locale={params.locale} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {isZh ? "会员仪表盘" : "Dashboard"}
        </h1>

        {/* Top Grid Cards aligned with site style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{isZh ? "用户信息" : "User Info"}</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><span className="font-medium">{isZh ? "姓名：" : "Name:"}</span> {session?.user?.name ?? (isZh ? "未设置" : "Not set")}</p>
              <p><span className="font-medium">Email:</span> {session?.user?.email ?? ""}</p>
              <p>
                <span className="font-medium">{isZh ? "账号等级：" : "Account Level:"}</span>
                <span className={`${stats.accountLevel === (isZh ? "标准版" : "Standard") ? "text-blue-600" : "text-gray-600"}`}>{stats.accountLevel}</span>
              </p>
            </div>
          </div>

          {/* Account Stats */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{isZh ? "账户统计" : "Account Stats"}</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between"><span>{isZh ? "总登录次数" : "Total Logins"}</span><span className="font-semibold text-gray-900">{stats.totalLogins}</span></div>
              <div className="flex justify-between"><span>{isZh ? "上次登录" : "Last Login"}</span><span className="font-medium text-gray-900">{stats.lastLogin}</span></div>
              <div className="flex justify-between"><span>{isZh ? "已使用功能" : "Used Features"}</span><span className="font-semibold text-blue-600">{stats.usedFeatures}</span></div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{isZh ? "快速操作" : "Quick Actions"}</h3>
            <div className="space-y-3">
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md text-sm font-medium">{isZh ? "查看使用教程" : "View Tutorials"}</button>
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md text-sm font-medium" onClick={() => router.push(`/${params.locale}/my-subscription`)}>{isZh ? "订阅管理" : "Manage Subscription"}</button>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-medium" onClick={() => signOut({ callbackUrl: "/login" })}>{isZh ? "退出登录" : "Logout"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
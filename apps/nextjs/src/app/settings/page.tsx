"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

export default function Settings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    notifications: true,
    darkMode: false,
    language: "zh-CN"
  });

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    // 初始化表单数据
    setFormData({
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      notifications: true,
      darkMode: false,
      language: "zh-CN"
    });
    setIsLoading(false);
  }, [session, status, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    // 模拟保存设置
    setTimeout(() => {
      setIsSaving(false);
      setMessage("设置已成功保存！");
      setTimeout(() => setMessage(""), 3000);
    }, 1000);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-3xl font-bold text-gray-900">账户设置</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{session?.user?.email ?? ""}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Success Message */}
          {message && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Settings Navigation */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow p-4">
                <nav className="space-y-2">
                  <button className="w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-md font-medium">
                    个人信息
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 rounded-md">
                    安全设置
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 rounded-md">
                    通知设置
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 rounded-md">
                    偏好设置
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 rounded-md">
                    订阅管理
                  </button>
                </nav>
              </div>
            </div>

            {/* Settings Form */}
            <div className="md:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">基本信息</h2>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="px-6 py-4 space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        姓名
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 border"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        邮箱地址
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 border"
                      />
                      <p className="mt-1 text-sm text-gray-500">邮箱地址将用作登录账号</p>
                    </div>

                    <div>
                      <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                        语言偏好
                      </label>
                      <select
                        id="language"
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 border"
                      >
                        <option value="zh-CN">简体中文</option>
                        <option value="zh-TW">繁體中文</option>
                        <option value="en-US">English</option>
                      </select>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div className="px-6 py-4 border-t border-gray-200 space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">通知设置</h3>

                    <div className="flex items-center">
                      <input
                        id="notifications"
                        name="notifications"
                        type="checkbox"
                        checked={formData.notifications}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700">
                        接收重要更新通知
                      </label>
                    </div>
                  </div>

                  {/* Appearance Settings */}
                  <div className="px-6 py-4 border-t border-gray-200 space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">界面设置</h3>

                    <div className="flex items-center">
                      <input
                        id="darkMode"
                        name="darkMode"
                        type="checkbox"
                        checked={formData.darkMode}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="darkMode" className="ml-2 block text-sm text-gray-700">
                        深色模式（即将推出）
                      </label>
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? "保存中..." : "保存设置"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-red-200 bg-red-50">
                  <h2 className="text-lg font-medium text-red-900">危险区域</h2>
                </div>
                <div className="px-6 py-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">删除账户</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      删除账户将永久清除所有数据，此操作不可恢复。
                    </p>
                    <button className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      删除账户
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
"use client";

import React, { useEffect, useState } from "react";

type ProviderInfo = { id: string; name: string };

export default function LoginPage() {
  const [providers, setProviders] = useState<Record<string, ProviderInfo> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await fetch("/api/auth/providers");
        const data = await res.json();
        setProviders(data);
      } catch (e) {
        // 网络或 API 出错时，保持为 null，UI 会显示可点击的占位按钮
        setProviders(null);
      }
    };
    fetchProviders();
  }, []);

  const signInHref = (provider: string) => `/api/auth/signin?provider=${provider}&callbackUrl=/`;

  const ProviderButton = ({ provider }: { provider: "google" | "github" }) => {
    const isConfigured = !!providers?.[provider];
    const baseClass =
      "w-full inline-flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors";
    const activeClass = provider === "google"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "bg-gray-900 text-white hover:bg-black";
    const disabledClass = "bg-gray-200 text-gray-500 cursor-not-allowed";

    if (isConfigured || providers === null) {
      // providers === null 时，允许用户点击占位按钮尝试登录
      return (
        <a href={signInHref(provider)} className={`${baseClass} ${activeClass}`}>
          {provider === "github" ? "GitHub" : "Google"}
        </a>
      );
    }
    return (
      <button className={`${baseClass} ${disabledClass}`} disabled>
        {provider === "github" ? "GitHub" : "Google"}
      </button>
    );
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-white to-violet-50">
      {/* 左侧登录卡片 */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-violet-600 text-white flex items-center justify-center">🔒</div>
            <h1 className="text-2xl font-semibold">Login</h1>
          </div>

          <div>
            <h2 className="text-xl font-bold">欢迎回来</h2>
            <p className="mt-1 text-sm text-gray-600">输入您的电子邮箱以登录您的账户</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              className="w-full rounded-md bg-violet-600 text-white py-2 hover:bg-violet-700 transition-colors"
              type="button"
              onClick={() => alert("仅为展示用途：当前未启用邮箱登录")}
            >
              用电子邮件登录
            </button>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-sm text-gray-500">或者快捷使用</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ProviderButton provider="github" />
            <ProviderButton provider="google" />
          </div>

          {/* 提示：当某个 Provider 未配置时显示文案 */}
          {providers && !providers.google && (
            <p className="text-xs text-gray-500">暂未配置 Google 登录，请联系管理员。</p>
          )}
          {providers && !providers.github && (
            <p className="text-xs text-gray-500">暂未配置 GitHub 登录（可选）。</p>
          )}

          <div className="text-sm text-gray-600">
            Don't have an account? <a href="#" className="underline">Sign up</a>
          </div>
          <p className="text-xs text-gray-400">
            By continuing, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>
          </p>
        </div>
      </div>

      {/* 右侧欢迎与特性展示 */}
      <div className="hidden md:flex items-center justify-center p-8 bg-gradient-to-br from-violet-600 to-fuchsia-600">
        <div className="max-w-lg text-white space-y-6">
          <div>
            <h2 className="text-3xl font-bold">Welcome to</h2>
            <h3 className="text-3xl font-extrabold">Your Platform</h3>
            <p className="mt-2 text-sm opacity-90">Sign in to access your dashboard and manage your applications</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="text-xl">⚡</div>
              <div className="text-sm font-semibold mt-1">Fast & Reliable</div>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="text-xl">🛡️</div>
              <div className="text-sm font-semibold mt-1">Secure</div>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="text-xl">💻</div>
              <div className="text-sm font-semibold mt-1">Developer Friendly</div>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="text-xl">🌍</div>
              <div className="text-sm font-semibold mt-1">Global Scale</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
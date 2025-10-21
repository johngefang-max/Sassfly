"use client";

import React, { useEffect, useState } from "react";
<<<<<<< HEAD
=======
import { signIn } from "next-auth/react";
>>>>>>> 9c2a12c (feat: 完善登录页面并配置 NextAuth 认证系统)

type ProviderInfo = { id: string; name: string };

export default function LoginPage() {
  const [providers, setProviders] = useState<Record<string, ProviderInfo> | null>(null);
<<<<<<< HEAD
  const [loading, setLoading] = useState(false);
=======
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
>>>>>>> 9c2a12c (feat: 完善登录页面并配置 NextAuth 认证系统)

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await fetch("/api/auth/providers");
        const data = await res.json();
        setProviders(data);
      } catch (e) {
<<<<<<< HEAD
        // 网络或 API 出错时，保持为 null，UI 会显示可点击的占位按钮
=======
>>>>>>> 9c2a12c (feat: 完善登录页面并配置 NextAuth 认证系统)
        setProviders(null);
      }
    };
    fetchProviders();
  }, []);

<<<<<<< HEAD
  const signInHref = (provider: string) => `/api/auth/signin?provider=${provider}&callbackUrl=/`;
=======
  const handleOAuthSignIn = async (provider: string) => {
    setLoading(true);
    try {
      await signIn(provider, { callbackUrl: "/" });
    } catch (error) {
      console.error("登录失败:", error);
      alert("登录失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert("请输入邮箱地址");
      return;
    }
    setEmailLoading(true);
    try {
      const result = await signIn("email", {
        email,
        callbackUrl: "/",
        redirect: false,
      });
      if (result?.error) {
        alert("邮箱登录失败: " + result.error);
      } else {
        alert("已发送登录链接到您的邮箱，请查收");
      }
    } catch (error) {
      console.error("邮箱登录失败:", error);
      alert("邮箱登录功能暂未配置");
    } finally {
      setEmailLoading(false);
    }
  };
>>>>>>> 9c2a12c (feat: 完善登录页面并配置 NextAuth 认证系统)

  const ProviderButton = ({ provider }: { provider: "google" | "github" }) => {
    const isConfigured = !!providers?.[provider];
    const baseClass =
<<<<<<< HEAD
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
=======
      "w-full inline-flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-all duration-200 shadow-sm";
    const activeClass = provider === "google"
      ? "bg-white text-gray-900 border-2 border-gray-200 hover:border-blue-500 hover:shadow-md"
      : "bg-gray-900 text-white hover:bg-black hover:shadow-lg";
    const disabledClass = "bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200";

    const icon = provider === "github" ? (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    );

    if (isConfigured || providers === null) {
      return (
        <button
          onClick={() => handleOAuthSignIn(provider)}
          disabled={loading}
          className={`${baseClass} ${activeClass} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {icon}
          {provider === "github" ? "使用 GitHub 登录" : "使用 Google 登录"}
        </button>
>>>>>>> 9c2a12c (feat: 完善登录页面并配置 NextAuth 认证系统)
      );
    }
    return (
      <button className={`${baseClass} ${disabledClass}`} disabled>
<<<<<<< HEAD
        {provider === "github" ? "GitHub" : "Google"}
=======
        {icon}
        {provider === "github" ? "GitHub (未配置)" : "Google (未配置)"}
>>>>>>> 9c2a12c (feat: 完善登录页面并配置 NextAuth 认证系统)
      </button>
    );
  };

  return (
<<<<<<< HEAD
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
=======
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-slate-50 via-white to-violet-50">
      {/* 左侧登录卡片 */}
      <div className="flex items-center justify-center p-6 md:p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo 和标题 */}
          <div className="text-center space-y-2">
            <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white items-center justify-center text-2xl shadow-lg">
              🚀
            </div>
            <h1 className="text-3xl font-bold text-gray-900">欢迎回来</h1>
            <p className="text-sm text-gray-600">登录您的账户以继续使用</p>
          </div>

          {/* 邮箱登录表单 */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                邮箱地址
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={emailLoading}
              className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-3 font-semibold hover:from-violet-700 hover:to-fuchsia-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {emailLoading ? "发送中..." : "使用邮箱登录"}
            </button>
          </form>

          {/* 分隔线 */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-gray-500 font-medium">或使用第三方登录</span>
            </div>
          </div>

          {/* OAuth 登录按钮 */}
          <div className="space-y-3">
            <ProviderButton provider="google" />
            <ProviderButton provider="github" />
          </div>

          {/* 提示信息 */}
          {providers && (!providers.google || !providers.github) && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-800">
                {!providers.google && "Google 登录暂未配置。"}
                {!providers.github && "GitHub 登录暂未配置。"}
              </p>
            </div>
          )}

          {/* 底部链接 */}
          <div className="text-center space-y-3 pt-4">
            <p className="text-sm text-gray-600">
              还没有账户？{" "}
              <a href="/signup" className="text-violet-600 font-semibold hover:text-violet-700 underline">
                立即注册
              </a>
            </p>
            <p className="text-xs text-gray-500">
              继续使用即表示您同意我们的{" "}
              <a href="/terms" className="underline hover:text-gray-700">
                服务条款
              </a>{" "}
              和{" "}
              <a href="/privacy" className="underline hover:text-gray-700">
                隐私政策
              </a>
            </p>
          </div>
>>>>>>> 9c2a12c (feat: 完善登录页面并配置 NextAuth 认证系统)
        </div>
      </div>

      {/* 右侧欢迎与特性展示 */}
<<<<<<< HEAD
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
=======
      <div className="hidden md:flex items-center justify-center p-8 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl" />

        <div className="max-w-lg text-white space-y-8 relative z-10">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold leading-tight">
              开启您的
              <br />
              创新之旅
            </h2>
            <p className="text-lg text-white/90">
              登录以访问您的仪表板，管理您的应用程序和服务
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-sm font-semibold">快速可靠</div>
              <div className="text-xs text-white/70 mt-1">毫秒级响应速度</div>
            </div>
            <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all">
              <div className="text-3xl mb-2">🛡️</div>
              <div className="text-sm font-semibold">安全可靠</div>
              <div className="text-xs text-white/70 mt-1">企业级安全保障</div>
            </div>
            <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all">
              <div className="text-3xl mb-2">💻</div>
              <div className="text-sm font-semibold">开发者友好</div>
              <div className="text-xs text-white/70 mt-1">完善的 API 文档</div>
            </div>
            <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all">
              <div className="text-3xl mb-2">🌍</div>
              <div className="text-sm font-semibold">全球部署</div>
              <div className="text-xs text-white/70 mt-1">覆盖全球节点</div>
            </div>
          </div>

          <div className="pt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm text-white/90">
              <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>99.9% 服务可用性保证</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/90">
              <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>24/7 技术支持服务</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/90">
              <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>数据加密传输与存储</span>
>>>>>>> 9c2a12c (feat: 完善登录页面并配置 NextAuth 认证系统)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
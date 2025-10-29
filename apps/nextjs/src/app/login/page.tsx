"use client";

import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type ProviderInfo = { id: string; name: string };

export default function LoginPage() {
  const [providers, setProviders] = useState<Record<string, ProviderInfo> | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const router = useRouter();

  // 读取客户端可选环境变量（未配置则默认使用 johnfang@gmail.com）
  const devEmail = process.env.NEXT_PUBLIC_DEV_LOGIN_EMAIL || "johnfang@gmail.com";

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await fetch("/api/auth/providers");
        const data = await res.json();
        setProviders(data);
      } catch (e) {
        setProviders(null);
      }
    };
    fetchProviders();
  }, []);

  // 已登录自动跳转到主页，避免已登录用户停留在登录页
  useEffect(() => {
    let cancelled = false;
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        if (!cancelled && res.ok) {
          const data = await res.json();
          if (data?.user) {
            // 跳转到根路径，由服务端根据语言偏好重定向到对应主页
            router.replace("/");
          }
        }
      } catch {
        // ignore
      }
    };
    checkSession();
    return () => { cancelled = true; };
  }, [router]);

  const handleOAuthSignIn = async (providerId: string) => {
    try {
      setLoading(true);
      // 登录完成回到主页（根路径会根据语言重定向到 /zh 或 /en）
      await signIn(providerId, { callbackUrl: "/" });
    } catch (error) {
      console.error("OAuth sign-in failed:", error);
      alert("第三方登录失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  // 开发快速登录（仅当后端暴露 credentials provider 时显示按钮）
  const handleDevSignIn = async () => {
    try {
      setLoading(true);
      const result = await signIn("credentials", {
        email: devEmail,
        callbackUrl: "/",
        redirect: false,
      });
      if (result?.ok) {
        router.replace("/");
      } else {
        console.error("开发快速登录失败:", result);
        alert("开发快速登录失败，请检查配置");
      }
    } catch (error) {
      console.error("开发快速登录异常:", error);
      alert("开发快速登录异常，请检查配置");
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

  const ProviderButton = ({ provider }: { provider: "google" | "github" }) => {
    const isConfigured = !!providers?.[provider];
    const baseClass = "w-full inline-flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-all duration-200 shadow-sm";
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
      );
    }
    return (
      <button className={`${baseClass} ${disabledClass}`} disabled>
        {icon}
        {provider === "github" ? "GitHub (未配置)" : "Google (未配置)"}
      </button>
    );
  };

  return (
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

          {/* 开发快速登录按钮：当 providers 中存在 credentials 时显示 */}
          {providers?.credentials && (
            <button
              onClick={handleDevSignIn}
              disabled={loading}
              className={`w-full rounded-lg bg-yellow-500 text-white py-3 font-semibold transition-all duration-200 shadow-md hover:shadow-lg ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              title={`以 ${devEmail} 免验证登录（开发专用）`}
            >
              使用管理员邮箱快速登录（开发）
            </button>
          )}

          {/* OAuth 登录按钮 */}
          <div className="space-y-3">
            <ProviderButton provider="google" />
            <ProviderButton provider="github" />
          </div>

          {/* 提示信息 */}
          {providers && !providers.google && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-800">Google 登录暂未配置。</p>
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
        </div>
      </div>

      {/* 右侧欢迎与特性展示 */}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
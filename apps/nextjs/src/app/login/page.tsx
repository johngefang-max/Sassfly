"use client";

import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await fetch("/api/auth/providers");
        const data = await res.json();
        setProviders(data);
      } catch (e) {
        // 忽略错误，默认显示按钮
      }
    };
    fetchProviders();
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } finally {
      setLoading(false);
    }
  };

  // 已移除 GitHub 登录，仅保留 Google 登录

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold">登录到您的帐号</h1>
        {providers?.google && (
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full rounded-md bg-blue-600 text-white py-2 disabled:opacity-50 hover:bg-blue-700"
          >
            使用 Google 登录
          </button>
        )}

        {/* 若 providers 未加载，仍显示一个可点击的 Google 登录按钮 */}
        {!providers && (
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full rounded-md bg-blue-600 text-white py-2 disabled:opacity-50 hover:bg-blue-700"
          >
            使用 Google 登录
          </button>
        )}

        {providers && !providers.google && (
          <p className="text-sm text-gray-500">暂未配置 Google 登录，请联系管理员。</p>
        )}
      </div>
    </div>
  );
}
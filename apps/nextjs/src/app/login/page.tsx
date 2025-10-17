"use client";

import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
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

  const handleGitHubSignIn = async () => {
    setLoading(true);
    try {
      await signIn("github", { callbackUrl: "/" });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await signIn("email", { email });
      alert("Magic link 已发送到您的邮箱，请查收");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold">登录到您的帐号</h1>
        {providers?.github && (
          <>
            <button
              onClick={handleGitHubSignIn}
              disabled={loading}
              className="w-full rounded-md bg-black text-white py-2 disabled:opacity-50"
            >
              使用 GitHub 登录
            </button>
            <div className="text-center text-sm text-gray-500">或</div>
          </>
        )}

        {providers?.email && (
          <form onSubmit={handleEmailSignIn} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入邮箱"
              className="w-full border rounded-md px-3 py-2"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-600 text-white py-2 disabled:opacity-50"
            >
              邮箱登录（Magic Link）
            </button>
          </form>
        )}

        {!providers && (
          <p className="text-sm text-gray-500">正在加载可用的登录方式...</p>
        )}

        {providers && !providers.github && !providers.email && (
          <p className="text-sm text-gray-500">暂未配置任何登录方式，请联系管理员。</p>
        )}
      </div>
    </div>
  );
}
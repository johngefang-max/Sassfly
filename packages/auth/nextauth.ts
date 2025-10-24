import { getServerSession, NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { env } from "./env.mjs";
import EmailProvider from "next-auth/providers/email";
import { KyselyAdapter } from "@auth/kysely-adapter";
import { db } from "./db";
import { HttpsProxyAgent } from "https-proxy-agent";

const AdapterAny: any = KyselyAdapter as any;

const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || process.env.ALL_PROXY;
const proxyAgent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined;
// 统一 httpOptions：仅在检测到代理时附加 agent
const providerHttpOptions = proxyAgent ? { timeout: 30000, agent: proxyAgent } : { timeout: 30000 };
const globalHttpOptions = proxyAgent ? { timeout: 300000, agent: proxyAgent } : { timeout: 300000 };



// 扩展 Session/JWT 字段
declare module "next-auth" {
  interface Session {
    user: User & { id: string; isAdmin: boolean };
  }
}

declare module "next-auth" {
  interface JWT {
    isAdmin: boolean;
  }
}

// 动态注册 Provider
const providers: NextAuthOptions["providers"] = [];

// 开发模式下启用邮箱登录，避免无 Provider 导致配置错误
if (env.IS_DEBUG === "true") {
  providers.push(
    EmailProvider({
      from: env.RESEND_FROM || "dev@example.com",
      maxAge: 24 * 60 * 60,
      // 在本地开发环境中直接输出验证链接，而不实际发送邮件
      sendVerificationRequest({ identifier, url }) {
        console.log("[DEV] Email sign-in link for", identifier, "=>", url);
      },
    })
  );
}

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile"
        },
      },
      httpOptions: providerHttpOptions,
    })
  );
}

if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      // 移除代理配置以避免潜在问题
      httpOptions: providerHttpOptions,
    })
  );
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { 
    signIn: "/login", 
    error: "/login",
    signOut: "/login"
  },
  providers,
  adapter: AdapterAny(db as any),
  secret: env.NEXTAUTH_SECRET,
  debug: env.IS_DEBUG === "true",
  httpOptions: globalHttpOptions,
  callbacks: {
    async signIn({ user, account, profile }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      // 确保重定向到正确的域名
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({ session, token }) {
      return session;
    },
    async jwt({ token, user }) {
      return token;
    },
  }
};

// Server 端使用
export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

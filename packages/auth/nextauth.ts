import { getServerSession, NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { env } from "./env.mjs";
import EmailProvider from "next-auth/providers/email";
import { KyselyAdapter } from "@auth/kysely-adapter";
import { db } from "./db";
import { HttpsProxyAgent } from "https-proxy-agent";
import CredentialsProvider from "next-auth/providers/credentials";

const AdapterAny: any = KyselyAdapter as any;

const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || process.env.ALL_PROXY;
let proxyAgent = undefined;

// // 在Bun环境下暂时禁用代理，因为兼容性问题
// if (proxyUrl) {
//   try {
//     proxyAgent = new HttpsProxyAgent(proxyUrl);
//   } catch (error) {
//     console.warn('Failed to create proxy agent:', error);
//     proxyAgent = undefined;
//   }
// }

// 统一 httpOptions：暂时禁用代理
const providerHttpOptions = { timeout: 30000 };
const globalHttpOptions = { timeout: 300000 };



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

// 开发模式下启用免验证邮箱登录（仅本地/调试）
// 条件：DEV_LOGIN_ENABLED=true 或 IS_DEBUG=true
const DEV_LOGIN_ENABLED =
  process.env.DEV_LOGIN_ENABLED === "true" || env.IS_DEBUG === "true";
const DEV_LOGIN_EMAIL = process.env.DEV_LOGIN_EMAIL || "johnfang@gmail.com";

if (DEV_LOGIN_ENABLED) {
  providers.push(
    CredentialsProvider({
      name: "Dev Email",
      credentials: {
        email: { label: "Email", type: "text" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email?.trim();
        if (email && email === DEV_LOGIN_EMAIL) {
          return { id: `dev-${email}`, name: "Developer", email } as any;
        }
        return null;
      },
    })
  );
}

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
      // 登录后重定向到主页，根据用户语言偏好重定向
      if (url.includes("/dashboard") || url === baseUrl) {
        // 检测用户语言偏好，默认英文
        const userAgent = typeof window !== 'undefined' ? window.navigator.language : '';
        const preferredLang = userAgent.includes('zh') ? 'zh' : 'en';
        return `${baseUrl}/${preferredLang}`;
      }
      // 确保重定向到正确的域名
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({ session, token }) {
      if (session.user && token?.sub) {
        (session.user as any).id = token.sub as string;
        (session.user as any).isAdmin = !!(token as any).isAdmin;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        (token as any).isAdmin = user.email === DEV_LOGIN_EMAIL;
      }
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

import { getServerSession, NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { env } from "./env.mjs";

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

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      httpOptions: { timeout: 15000 },
    })
  );
}

if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers,
  callbacks: {
    session({ token, session }) {
      if (token && session.user) {
        session.user.id = (token.id as string) ?? (token.sub as string);
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.isAdmin = (token.isAdmin as boolean) ?? false;
      }
      return session;
    },
    async jwt({ token, user }) {
      const emailFromToken = token?.email ?? "";
      const email = user?.email ?? emailFromToken;
      let isAdmin = false;
      if (env.ADMIN_EMAIL) {
        const adminEmails = env.ADMIN_EMAIL.split(",");
        if (email) isAdmin = adminEmails.includes(email);
      }
      if (user) {
        token.id = (user.id as string) ?? (token.sub as string);
        token.name = user.name ?? token.name;
        token.email = user.email ?? token.email;
        token.picture = user.image ?? token.picture;
      }
      token.isAdmin = isAdmin;
      return token;
    },
  },
  debug: env.IS_DEBUG === "true",
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

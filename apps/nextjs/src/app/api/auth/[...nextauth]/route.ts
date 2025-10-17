import NextAuth from "next-auth";
import { authOptions } from "@saasfly/auth";

// 将 NextAuth 挂载到 App Router 的 /api/auth/*
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
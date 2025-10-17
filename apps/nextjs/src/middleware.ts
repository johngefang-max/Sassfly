import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export { default } from 'next-auth/middleware';

// 配置需要保护的路由
export const config = {
  matcher: [
    // 需要保护的路由
    '/dashboard/:path*',
    '/settings/:path*',
    // 不建议全局保护 /api，以免影响公开的接口。若有需要保护的 API，请精确指定路径。
  ],
};
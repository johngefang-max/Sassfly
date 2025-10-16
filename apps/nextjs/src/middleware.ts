import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export { default } from 'next-auth/middleware';

// 配置需要保护的路由
export const config = {
  matcher: [
    // 需要保护的路由
    '/dashboard/:path*',
    '/settings/:path*',
    '/api/:path*',
  ],
};
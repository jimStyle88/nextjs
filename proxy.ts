import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// ===============================
// 跨域(CORS)配置
// ===============================
const corsConfig = {
  // 允许的源列表（生产环境应该限制为特定域名）
  allowedOrigins: ['http://localhost:3000'],
  // 允许的HTTP方法
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  // 允许的请求头
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Version', 'X-App-Id'],
  // 是否允许发送凭证（如cookies）
  allowCredentials: true,
  // 预检请求的缓存时间（秒）
  maxAge: 86400, // 24小时
};

// ===============================
// 自定义请求头配置
// ===============================
const customRequestHeaders = {
  // 静态请求头
  'X-API-Version': '1.0.0',
  'X-App-Id': 'nextjs-api-demo',
  'X-Platform': 'Web',

  // 动态生成的请求头（使用函数）
  'X-Request-Timestamp': () => new Date().toISOString(),
  'X-Request-Id': () => Math.random().toString(36).substr(2, 9),
};

// ===============================
// 辅助函数
// ===============================

// 辅助函数：生成唯一请求ID
function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

// 辅助函数：根据请求Origin返回允许的源
function getAllowOrigin(request: NextRequest): string {
  const origin = request.headers.get('origin');
  if (origin && corsConfig.allowedOrigins.includes(origin)) {
    return origin;
  }
  // 默认使用第一个允许的源
  return corsConfig.allowedOrigins[0];
}

// ===============================
// Next.js 16 Proxy 实现
// ===============================
export function proxy(request: NextRequest) {
  // 减少控制台日志输出，避免浏览器扩展端口通信问题
  // console.log('=== PROXY TRIGGERED ===');
  // console.log('Path:', request.nextUrl.pathname);
  // console.log('Method:', request.method);

  // 1. 处理OPTIONS请求（预检请求）
  if (request.method === 'OPTIONS') {
    // 减少控制台日志输出，避免浏览器扩展端口通信问题
    // console.log('✓ Handling OPTIONS (preflight) request');

    // 创建预检响应
    const preflightResponse = new NextResponse(null, {
      status: 204, // No Content
      headers: {
        // CORS核心头
        'Access-Control-Allow-Origin': getAllowOrigin(request),
        'Access-Control-Allow-Methods': corsConfig.allowedMethods.join(','),
        'Access-Control-Allow-Headers': corsConfig.allowedHeaders.join(','),
        'Access-Control-Allow-Credentials': corsConfig.allowCredentials.toString(),
        'Access-Control-Max-Age': corsConfig.maxAge.toString(),

        // 其他标准头
        'Content-Length': '0',
      },
    });



    return preflightResponse;
  }

  // 2. 创建新的请求头
  const requestHeaders = new Headers(request.headers);

  // 3. 应用自定义请求头
  Object.entries(customRequestHeaders).forEach(([key, value]) => {
    let headerValue: string;

    if (typeof value === 'function') {
      headerValue = (value as () => string)();
    } else {
      headerValue = String(value);
    }

    requestHeaders.set(key, headerValue);
  });

  // 4. 处理API请求
  if (request.nextUrl.pathname.startsWith('/api')) {
    const url = new URL(request.url);
    url.searchParams.set('api_version', '1.0.0');

    const apiResponse = NextResponse.rewrite(url, {
      request: { headers: requestHeaders },
    });

    // 5. 设置API响应头和CORS头
    apiResponse.headers.set('X-Middleware-Applied', 'true');
    apiResponse.headers.set('Access-Control-Allow-Origin', getAllowOrigin(request));
    apiResponse.headers.set('Access-Control-Allow-Credentials', corsConfig.allowCredentials.toString());

    return apiResponse;
  }

  // 6. 处理非API请求
  // 不需要认证的路径
  const publicPaths = ['/login', '/api/auth/login', '/api/auth/register'];

  if (!publicPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    // 获取token
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // 验证token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // 7. 设置非API响应头和CORS头
  response.headers.set('X-Middleware-Applied', 'true');
  response.headers.set('Access-Control-Allow-Origin', getAllowOrigin(request));
  response.headers.set('Access-Control-Allow-Credentials', corsConfig.allowCredentials.toString());

  return response;
}

// 配置proxy的匹配路径
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
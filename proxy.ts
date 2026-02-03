import { NextRequest, NextResponse } from 'next/server';

// Next.js 16的proxy功能 - 必须放在app目录下
export function proxy(request: NextRequest) {
  console.log('=== PROXY TRIGGERED ===');
  console.log('Path:', request.nextUrl.pathname);
  
  // 1. 修改请求头（发送给服务器）
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('X-API-Version', '1.0.0');
  requestHeaders.set('X-App-Id', 'nextjs-api-demo');
  
  // 2. 处理API请求的情况
  if (request.nextUrl.pathname.startsWith('/api')) {
    const url = new URL(request.url);
    url.searchParams.set('api_version', '1.0.0');
    
    // 为API请求创建响应，包含响应头设置
    const apiResponse = NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders,
      },
    });
    
    // 关键：在API响应中也设置响应头
    apiResponse.headers.set('X-Middleware-Applied', 'true');
    apiResponse.headers.set('X-Custom-Response-Header', 'Hello from API proxy!');
    apiResponse.headers.set('X-Response-Time', new Date().toISOString());
    
    return apiResponse;
  }
  
  // 3. 处理非API请求的情况
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  
  // 4. 给前端响应头增加内容
  response.headers.set('X-Middleware-Applied', 'true');
  response.headers.set('X-Custom-Response-Header', 'Hello from proxy!');
  response.headers.set('X-Response-Time', new Date().toISOString());
  response.headers.set('Access-Control-Expose-Headers', 'X-Middleware-Applied,X-Custom-Response-Header,X-Response-Time');
  
  return response;
}

// 配置proxy的匹配路径
export const config = {
  matcher: ['/api/:path*'],
};
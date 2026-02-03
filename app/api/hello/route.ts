import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types/api';

/**
 * GET API endpoint example
 * Access at: http://localhost:3000/api/hello
 */
export async function GET(request: Request) {
  // 从请求中获取中间件添加的公共参数
  const apiVersionHeader = request.headers.get('X-API-Version');
  const appIdHeader = request.headers.get('X-App-Id');
  
  // 从URL中获取查询参数
  const url = new URL(request.url);
  const apiVersionQuery = url.searchParams.get('api_version');
  const appIdQuery = url.searchParams.get('app_id');
  
  return NextResponse.json({
    message: 'Hello from Next.js API! 你真棒',
    timestamp: new Date().toISOString(),
    method: 'GET',
    status: 'success',
    // 显示中间件添加的公共参数
    middlewareParams: {
      headers: {
        'X-API-Version': apiVersionHeader,
        'X-App-Id': appIdHeader,
      },
      queryParams: {
        api_version: apiVersionQuery,
        app_id: appIdQuery,
      },
    },
  });
}

/**
 * POST API endpoint example
 * Access at: http://localhost:3000/api/hello
 */
export async function POST(request: Request) {
  try {
    // Parse JSON body from request
    const body = await request.json();
    
    // 从请求中获取中间件添加的公共参数
    const apiVersionHeader = request.headers.get('X-API-Version');
    const appIdHeader = request.headers.get('X-App-Id');
    const requestTimestamp = request.headers.get('X-Request-Timestamp');
    
    return NextResponse.json({
      message: 'Hello from POST API!',
      received: body,
      timestamp: new Date().toISOString(),
      method: 'POST',
      status: 'success',
      // 显示中间件添加的公共参数
      middlewareParams: {
        headers: {
          'X-API-Version': apiVersionHeader,
          'X-App-Id': appIdHeader,
          'X-Request-Timestamp': requestTimestamp,
        }
      }
    });
  } catch (error) {
    return NextResponse.json(
      { 
        message: 'Error processing request', 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    );
  }
}
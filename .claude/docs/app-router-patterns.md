# App Router 开发模式

## 页面路由

```text
app/
└── feature/
    ├── page.tsx
    ├── components/
    └── types.ts
```

- `page.tsx` 是路由入口，负责页面布局与状态组合。
- 可复用或复杂区块放在同级 `components/`。
- 动态路由使用 `[id]/page.tsx`；加载和错误边界按需使用 `loading.tsx`、`error.tsx`。
- 修改根布局 `app/layout.tsx` 前必须取得用户确认。

## API Route Handler

```text
app/api/resource/route.ts
```

- 导出 `GET`、`POST`、`PUT`、`PATCH`、`DELETE` 等命名函数。
- 使用 `NextRequest` 读取 URL、请求头和请求体，使用 `NextResponse.json` 返回 JSON。
- 成功、输入错误、未认证、未找到和服务端异常分别使用合适状态码。
- 不向客户端返回原始异常、SQL 或堆栈信息。

## Route Handler 示例

```ts
import { NextRequest, NextResponse } from 'next/server';

interface CreateRequest {
  name: string;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<CreateRequest>;

  if (!body.name?.trim()) {
    return NextResponse.json({ success: false, message: '名称不能为空' }, { status: 400 });
  }

  return NextResponse.json({ success: true, data: { name: body.name.trim() } }, { status: 201 });
}
```

## 页面访问 API

- 现有页面可使用相对路径 `fetch('/api/...')`。
- 需要公共请求头、超时或拦截器时使用 `lib/apiClient.ts`。
- 同一个功能内避免同时混用多种客户端封装。

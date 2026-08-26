# 认证与安全模式

## 当前流程

```text
登录页
  -> POST /api/auth/login
  -> lib/login.ts 查询用户
  -> lib/auth.ts 使用 bcrypt 校验
  -> 生成 JWT
  -> 写入 httpOnly token Cookie
  -> proxy.ts 校验后放行或重定向
```

## 必须遵守

- `JWT_SECRET` 必须通过环境变量提供；生产环境不得使用默认值。
- 密码只保存 bcrypt 哈希，不记录原始密码或登录请求体。
- 登录失败统一返回安全提示，避免泄露用户名是否存在。
- Cookie 至少设置 `httpOnly`；生产环境设置 `secure`。
- 根据部署站点补充 `sameSite: 'lax'` 和 `path: '/'`。
- JWT 内容只放必要身份字段，不放密码和敏感资料。
- 认证函数的返回类型必须明确，不使用 `any`。

## 公共路径

`proxy.ts` 中公共路径必须保持最小范围，通常包括：

- `/login`
- `/api/auth/login`
- `/api/auth/register`（仅在允许公开注册时）

新增公共页面或接口前要评估是否真的无需认证。

## 错误处理

- 无 Cookie：页面请求重定向到 `/login`。
- JWT 无效或过期：清理 Cookie 或重定向登录。
- API 鉴权失败：返回 `401` 或 `403`，不要返回 HTML 重定向作为 API 响应。

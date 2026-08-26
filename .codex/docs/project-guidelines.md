# 项目开发规范

## 技术栈

- Next.js 16 App Router
- React 19 + TypeScript strict mode
- Ant Design 6 + Tailwind CSS 4
- 原生 `fetch` 与 Axios
- MySQL2 Promise 连接池
- bcrypt + JSON Web Token

## 代码边界

- `app/` 负责路由、页面、布局和 Route Handlers。
- `lib/` 负责数据库、认证、业务服务和通用客户端。
- `types/` 放跨模块复用类型；仅单页使用的类型可放页面同级 `types.ts`。
- `sql/` 只放初始化或迁移参考 SQL，不在运行时读取执行。

## Client/Server 规则

- 只有需要状态、事件、浏览器 API 或 Ant Design 客户端交互的组件才声明 `'use client'`。
- 客户端组件禁止导入 `lib/db.ts`、`lib/mysql.ts`、`lib/login.ts`、`lib/auth.ts`。
- 密钥、数据库连接、密码哈希和 JWT 签名只在服务端执行。
- 服务端页面可以直接读取服务端资源，但当前项目的浏览器交互优先通过 `/api` Route Handler。

## UI 与样式

- 优先复用当前页面已有 Ant Design 模式。
- Tailwind 类名遵循项目现有写法，不使用不存在的 `tw:` 前缀。
- 避免在 TSX 中写大量 `style` 对象；复杂样式拆到 CSS。
- 页面超过 300 行时优先拆出组件、类型和业务逻辑。

## TypeScript

- 禁止无理由使用 `any`；外部输入先作为 `unknown` 再收窄。
- API 请求体、响应体和数据库行定义明确类型。
- 类型导入使用 `import type`。
- 不使用非空断言掩盖可空数据，优先显式处理。

## 验证

代码改动后运行：

```bash
pnpm type-check
pnpm lint
```

如果项目已配置测试，再运行 `pnpm test`。完成报告必须说明未运行的验证及原因。

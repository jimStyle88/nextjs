# Next.js 项目 Agent 规范

> 本文件是项目级 AI 工具的统一入口。项目是 Next.js App Router 单应用，不是 Turborepo Monorepo。

## 1. 项目事实

- 应用框架：Next.js 16 + React 19 + TypeScript。
- 页面路由位于 `app/**/page.tsx`，布局位于 `app/**/layout.tsx`。
- 服务端接口位于 `app/api/**/route.ts`，使用 `NextRequest` 和 `NextResponse`。
- 服务端基础设施位于 `lib/`：数据库、SQL、登录和 JWT 工具。
- 数据库为 MySQL，连接池由 `lib/db.ts` 创建，查询封装由 `lib/mysql.ts` 提供。
- 身份认证使用 bcrypt + JWT，JWT 存储在 `httpOnly` Cookie 中，由 `proxy.ts` 保护页面。
- UI 使用 Ant Design；样式优先使用当前项目已经采用的 Tailwind CSS 类名。

## 2. 禁止扫描路径

- 禁止读取或扫描 `node_modules/`。
- 禁止读取或扫描 `.next/`、`dist/`、`out/` 等构建产物。
- 不要读取 `.env.local` 的敏感值；只检查变量名和是否存在。

## 3. 目录与文件职责

```text
app/       页面、布局、全局样式和 API Route Handlers
lib/       数据库、认证、API 客户端和业务基础设施
types/     可复用 TypeScript 类型
sql/       数据库初始化脚本
public/    静态资源
proxy.ts   请求头、CORS 和 JWT 页面保护
```

- 页面主文件负责页面编排；独立表单区块拆到同级 `components/`。
- API 参数校验、业务处理和响应格式应保持在 Route Handler 内或抽取到 `lib/`。
- 数据库访问只能通过 `lib/mysql.ts` 和 `lib/db.ts`，禁止在客户端组件中导入数据库模块。
- 不要把密码、JWT 密钥、数据库连接信息或 Node-only 模块导入带有 `'use client'` 的组件。

## 4. HTTP 与数据请求

- 浏览器端请求使用原生 `fetch` 或 `lib/apiClient.ts` 的 Axios 实例，二者择一并保持页面内一致。
- 不要凭空引入 `@agent/data`、TanStack Query、Zustand 或其他当前依赖中不存在的包。
- API 路由必须返回 JSON 和明确的 HTTP 状态码。
- 输入参数必须校验；数据库值使用参数化查询。表名、列名等 SQL 标识符不得直接来自用户输入。
- 请求失败时保留服务端日志，客户端显示安全、简洁的错误信息，不泄露 SQL、密码或密钥。

## 5. 认证与安全

- 登录流程：`POST /api/auth/login` -> 查询用户 -> bcrypt 校验 -> 生成 JWT -> 写入 `token` Cookie。
- 登出流程：`POST /api/auth/logout` 清除 `token` Cookie。
- 受保护页面通过 `proxy.ts` 校验 Cookie 中的 JWT，失败时重定向到 `/login`。
- 生产环境必须设置高强度 `JWT_SECRET`，禁止依赖代码中的默认密钥。
- Cookie 应设置 `httpOnly`、生产环境 `secure`，并根据部署场景补充 `sameSite` 和 `path`。

## 6. 样式和组件

- 优先复用项目已有的 Ant Design 组件和当前页面模式。
- 不要套用不存在的 `@agent/ui` v2 组件规则。
- 禁止在 TSX 中新增大段 `<style>`；复杂样式放入 CSS 文件或使用 Tailwind 类名。
- 保持现有字体、间距和响应式风格，不要从外部模板复制整套样式。

## 7. 文件拆分与类型

- 页面文件尽量控制在 300 行以内；超过后拆出 `components/`、`lib/` 或专用类型文件。
- 避免 `any`，优先使用具体类型、泛型或 `unknown` 收窄。
- 类型仅供类型使用时使用 `import type`。
- 新增 API 时同步补充请求和响应类型。

## 8. 环境变量

必需变量见 `.env.example`：`DB_HOST`、`DB_PORT`、`DB_USER`、`DB_PASSWORD`、`DB_NAME`、`JWT_SECRET`。

- `.env.local` 只保留在本机，禁止提交真实密码或 JWT 密钥。
- 配置文件或环境变量文件属于受保护文件，修改前必须向用户说明原因和影响。

## 9. 测试与验证

- 测试统一放在 `__tests__/`，按源文件路径镜像目录结构；禁止把测试放进 `app/` 页面目录。
- 代码变更后至少运行 `pnpm type-check` 和 `pnpm lint`。
- 具备测试依赖后运行 `pnpm test`；没有测试依赖时必须在报告中说明。
- 声称完成前必须提供实际命令输出，不得以推测代替验证。

## 10. 受保护文件

修改以下文件前必须先告知用户并说明影响范围，获得确认后再修改：

- `package.json`、`pnpm-lock.yaml`、`package-lock.json`
- `next.config.ts`、`tsconfig.json`、`eslint.config.mjs`、`postcss.config.mjs`
- `app/layout.tsx`、`app/globals.css`、`proxy.ts`
- `.env*`、Docker、CI 和部署配置

## 11. AI 配置与提交

- `.claude/` 是共享 AI 文档和 Skill 的源目录；`.codex/`、`.agents/` 由同步脚本生成。
- 只修改 `.claude/` 或本文件，不直接编辑生成的镜像目录。
- 所有代码、文档和配置变更都禁止 AI 自动执行 `git commit`、`git push` 或创建 PR。
- 提交信息可以由 AI 生成，但必须由用户亲自执行提交。
- 不使用不存在或未配置的 YApi、SSO Menu、OpenSpec 服务；需要接入时先补充实际配置和凭证说明。

## 12. 自查报告

每次生成或修改代码后报告：

1. 修改文件和每个文件的行数。
2. 是否触碰受保护文件。
3. 是否新增 `any`、客户端/服务端边界问题或敏感信息风险。
4. 是否运行 `pnpm type-check`、`pnpm lint`、`pnpm test`，以及结果。
5. 未完成项和后续建议。

# 测试规范

## 当前状态

项目目前没有配置测试框架和 `test` 脚本。在增加测试依赖前，Agent 不得声称测试已通过；必须运行现有的类型检查和 lint。

## 目录约定

测试统一放在根目录 `__tests__/`，镜像源文件结构：

```text
app/formPage/page.tsx
__tests__/app/formPage/page.test.tsx

lib/auth.ts
__tests__/lib/auth.test.ts
```

- 禁止把 `.test.tsx` 或 `.spec.tsx` 放入 `app/`。
- 文件名使用 `<源文件名>.test.ts` 或 `<源文件名>.test.tsx`。

## 推荐测试范围

- `lib/`：纯函数、参数校验、认证和错误分支单元测试。
- Route Handler：状态码、请求校验、成功和失败 JSON。
- 页面：表单校验、加载态、成功提示和失败提示。
- 数据库：使用 mock 或独立测试数据库，不连接生产数据库。

## 完成前验证

```bash
pnpm type-check
pnpm lint
```

配置测试工具后增加：

```bash
pnpm test
```

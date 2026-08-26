---
name: lint-fix
description: 检查并修复指定文件或目录的 lint 和类型错误
---

# Lint 和类型检查修复

对指定的文件或目录进行 ESLint 和 TypeScript 类型检查，并在用户明确要求修复时修改发现的问题。

## 使用方式

```bash
/lint-fix <文件路径或目录路径>
```

示例：
- `/lint-fix app/login/page.tsx`
- `/lint-fix app/api`

## 检查流程

### 第一步：确定检查范围

从 `$ARGUMENTS` 获取目标路径：
- 如果未提供参数，默认检查当前 git 改动的文件
- 如果提供了路径，检查该路径下的所有 `.ts` 和 `.tsx` 文件

### 第二步：运行 ESLint 检查

```bash
pnpm exec eslint <目标路径>
```

重点关注以下规则：
- `react-hooks/exhaustive-deps` - hooks 依赖数组问题
- `react-hooks/rules-of-hooks` - hooks 使用规则
- `@typescript-eslint/no-unused-vars` - 未使用的变量
- `@typescript-eslint/no-explicit-any` - any 类型使用

### 第三步：运行 TypeScript 类型检查

```bash
pnpm type-check
```

### 第四步：分析并修复问题

按优先级修复：

#### 优先级 1：react-hooks 相关错误（最高优先级）
- `react-hooks/exhaustive-deps` - 补全依赖或使用 useCallback/useMemo
- `react-hooks/set-state-in-effect` - 改用 useMemo 或调整逻辑
- `react-hooks/rules-of-hooks` - 确保 hooks 在顶层调用

#### 优先级 2：TypeScript 类型错误
- 缺失类型定义 - 添加明确类型
- 类型不匹配 - 修正类型或添加类型断言
- 可选链问题 - 使用 `?.` 或 `??` 处理

#### 优先级 3：代码质量问题
- 未使用的变量 - 删除或添加 `_` 前缀
- any 类型 - 替换为具体类型或 unknown

### 第五步：验证修复

修复后重新运行检查，确保：
1. 所有 lint 错误已解决
2. 所有类型错误已解决
3. 没有引入新的问题

### 第六步：输出报告

```markdown
## Lint 和类型检查报告

### 检查范围
- 路径：<目标路径>
- 文件数：X

### 发现的问题
| 文件 | 行号 | 类型 | 规则 | 描述 |
|------|------|------|------|------|
| ... | ... | error/warning | ... | ... |

### 修复结果
✅ 已修复：X 个错误，X 个警告
⚠️ 需要手动处理：X 个问题

### 修复详情
- [文件路径:行号] 修复说明
- ...

### 验证结果
✅ Lint 检查通过
✅ 类型检查通过
```

## 注意事项

1. **优先修复 react-hooks 错误**：这类错误可能导致运行时 bug
2. **保持代码语义不变**：修复时不改变原有逻辑
3. **避免过度使用 eslint-disable**：只在确实无法修复时使用
4. **类型断言谨慎使用**：优先通过正确的类型定义解决问题

不要运行 `git commit`。现在开始检查 `$ARGUMENTS` 指定的路径；如用户未明确要求修复，先只报告问题。

---
name: commit-conventional
description: 生成符合 Conventional Commits 规范的提交信息；不执行提交
---

按照 Conventional Commits 规范生成提交信息。根据项目规范，只展示建议命令，不执行 `git commit`、`git push` 或创建 PR。

## 执行步骤

### 第一步：收集变更信息

运行以下命令收集当前变更：

```bash
git diff --cached --stat
git diff --cached --name-only
git diff --cached
```

如果暂存区为空，运行 `git status` 提示用户先 `git add` 需要提交的文件。

### 第二步：分析变更，生成提交信息

根据变更内容，生成符合以下格式的提交信息：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**type 规范：**
- `feat` - 新功能
- `fix` - 修复 bug
- `refactor` - 重构（不新增功能，不修复 bug）
- `style` - 样式调整（不影响逻辑）
- `docs` - 文档变更
- `test` - 测试相关
- `chore` - 构建/工具/依赖变更
- `perf` - 性能优化

**scope 规范：**
- 使用受影响的模块名，如 `agent`、`agent-admin`、`ui`、`data`、`shared`
- 跨多模块时可省略 scope

**subject 规范：**
- 中文简短描述，不超过 50 字
- 动词开头，如"新增"、"修复"、"重构"、"更新"

**body 规范：**
- 说明本次变更的具体内容（做了什么、为什么这样做）
- 列出主要变更文件和改动点
- 每条变更以 `- ` 开头

**footer（可选）：**
- 关联 issue：`Closes #123`
- 关联 spec：`Related Spec: openspec/changes/<name>/`
- Breaking change：`BREAKING CHANGE: <描述>`

### 第三步：展示提交信息并确认

将生成的提交信息展示给用户，询问是否确认提交。

### 第四步：展示提交建议

用户确认后，执行：

```bash
git commit -m "$(cat <<'EOF'
<生成的提交信息>
EOF
)"
```

不要执行上面的命令，不要输出虚构的 commit hash。将建议的提交标题、正文和用户可手动执行的命令展示给用户。

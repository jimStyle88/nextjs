# Next.js 项目 Agent 规范

项目级开发约束请以根目录 `AGENTS.md` 为准。Claude 使用 `.claude/` 下的 commands、skills 和 docs；不要根据旧的 `agent-turbo` Monorepo 模板创建 `apps/`、`packages/` 或 `@agent/*` 代码。

执行任务前请先阅读 `AGENTS.md`，根据任务需要读取：

- `.claude/docs/project-guidelines.md`
- `.claude/docs/app-router-patterns.md`
- `.claude/docs/data-patterns.md`
- `.claude/docs/auth-patterns.md`
- `.claude/docs/testing-patterns.md`

所有变更禁止自动提交。需要提交时只生成 Conventional Commit 建议，由用户亲自执行 `git commit`。

# nextjs 架构文档

更新日期：2026-08-26

## 零、环境部署与启动，前置信息

### 0.1 安装 Node.js

推荐使用 [nvm](https://github.com/nvm-sh/nvm) 管理 `Node` 版本，要求 **Node.js >= 18**。

```bash
# 使用 nvm 安装（推荐）
nvm install 18
nvm use 18

# 或直接从官网下载安装
# https://nodejs.org
```

### 0.2 安装 pnpm

```bash
npm install -g pnpm@9
```

### 0.3 安装依赖

```bash
# 在项目根目录执行
pnpm install
```

### 0.4 启动开发环境

pnpm dev

```b

```

### 0.9 AI 开发工作流规范（OpenSpec + Superpowers）

```bash
npm install -g @fission-ai/openspec@latest.  # 安装openspec
/plugin install superpowers@claude-plugins-official  # 自动加载superpower插件
```

两者结合使用，可以覆盖从需求探索到代码落地的完整流程，superpowers技能通过自然语言 + skills + agent 自动触发：

**推荐工作流：**

1. **探索需求** → `/openspec-explore`
   梳理模糊需求、理清边界，动手前与 AI 对齐目标。
2. **生成设计文档** → `/openspec-propose`
   基于探索结果生成设计文档和接口规范（任务拆分由 superpowers 负责）。
3. **拆分任务计划** → `/writing-plans`
   把设计文档转成可执行的任务列表，明确步骤和依赖。
4. **并行执行** → `/executing-plans` 或 `/subagent-driven-development`
   任务间无依赖时用 subagent 并行执行提速；有顺序依赖时用 executing-plans 带 checkpoint 逐步推进。
5. **验证变更** → `openspec verify`（自然语言触发：是否符合 propose 设计）
   执行完成后校验实现是否符合设计规范，确保没有偏离 propose 阶段的约定。
6. **归档变更** → `/openspec-archive-change`
   验证通过后归档，保留决策上下文供后续参考。

**其他常用技能：**

- `/brainstorming` — 写新功能前先头脑风暴，明确意图再动手
- `/systematic-debugging` — 遇到 bug 时系统性排查，而非盲猜
- `/verification-before-completion` — 提交前验证，避免"我以为好了"

> 核心原则：**先想清楚再写代码**。openspec 负责结构化思考与验收，superpowers 负责任务规划与执行。

**场景使用：**


| 场景                             | 推荐流程                                                                                |
| -------------------------------- | --------------------------------------------------------------------------------------- |
| 新功能长任务（跨多文件、多模块） | explore → propose → writing-plans → executing-plans / subagent → verify → archive  |
| 简单功能 / 小改动                | brainstorming → 直接 vibe coding，或 writing-plans → executing-plans                  |
| 架构重整 / 复杂重构              | explore → propose → writing-plans → subagent-driven-development → verify → archive |
| 线上 bug 排查                    | systematic-debugging → 修复 → verification-before-completion                          |

---

## 一、项目结构

当前仓库是一个基于 Next.js App Router 的单应用项目，目录职责如下：

```
nextjs/
├── app/                              # 页面、布局与 API Route Handlers
│   ├── api/                          # 服务端 API
│   │   ├── auth/                     # 登录、注册、退出
│   │   ├── employeeList/             # 员工列表 CRUD API
│   │   └── hello/                    # API 调试示例
│   ├── apitest/                      # API 调试页面
│   ├── formPage/                     # 表单示例页面
│   │   └── components/               # 表单布局与字段组件
│   ├── login/                        # 登录页面及交互辅助模块
│   ├── layout.tsx                    # 根布局、Metadata、Ant Design 注册
│   ├── page.tsx                      # 首页
│   └── globals.css                   # 全局样式
├── lib/                              # 服务端与客户端基础设施
│   ├── apiClient.ts                  # Axios API 客户端封装
│   ├── auth.ts                       # bcrypt 密码处理与 JWT 工具
│   ├── db.ts                         # MySQL 连接池
│   ├── login.ts                      # 用户查询、注册与密码校验
│   └── mysql.ts                      # SQL 查询及增删改封装
├── types/                            # TypeScript 类型定义
│   └── api.ts                        # API 响应类型
├── sql/                              # 数据库初始化脚本
│   ├── init-db.sql
│   └── employeelist.sql
├── public/                           # 静态资源（图片、图标、SVG）
├── proxy.ts                          # 请求代理、CORS 与 JWT 页面保护
├── next.config.ts                    # Next.js 配置
├── tsconfig.json                     # TypeScript 配置
├── eslint.config.mjs                 # ESLint 配置
├── postcss.config.mjs                # PostCSS/Tailwind 配置
├── package.json                      # 项目脚本与依赖
└── pnpm-lock.yaml                    # pnpm 依赖锁定文件
```

## 二、技术栈

| 分类 | 技术 | 版本 | 用途 |
| --- | --- | --- | --- |
| 应用框架 | Next.js | 16.1.6 | 基于 App Router 的页面渲染、路由与服务端 API |
| UI 框架 | React / React DOM | 19.2.3 | 页面组件与交互状态 |
| 语言 | TypeScript | ^5 | 类型检查与开发 |
| UI 组件 | Ant Design | ^6.2.3 | 表单、卡片、按钮、消息等界面组件 |
| 样式 | Tailwind CSS | ^4 | 原子化 CSS 样式 |
| HTTP 客户端 | Axios | ^1.13.4 | `lib/apiClient.ts` 中的请求封装；页面调试也使用原生 `fetch` |
| 数据库 | MySQL2 | ^3.17.0 | MySQL 连接池与参数化 SQL 执行 |
| 身份认证 | JSON Web Token | ^9.0.3 | 登录后生成并校验 JWT |
| 密码安全 | bcrypt | ^6.0.0 | 用户密码哈希与校验 |
| 日期处理 | Day.js | ^1.11.19 | 日期值处理 |
| 图标 | Ant Design Icons | ^6.1.0 | Ant Design 图标 |
| 代码质量 | ESLint / eslint-config-next | ^9 / 16.1.6 | 代码规范与 Next.js 规则检查 |
| 包管理 | pnpm | 9.x | 依赖安装与脚本执行 |

## 四、应用目录结构

`app/` 使用 Next.js App Router 约定：目录名对应路由，`page.tsx` 对应页面，`route.ts` 对应同路径下的 HTTP API。

```
app/
├── api/
│   ├── auth/
│   │   ├── login/route.ts             # POST /api/auth/login，校验用户并写入 token Cookie
│   │   ├── register/route.ts          # POST /api/auth/register，创建用户
│   │   └── logout/route.ts            # POST /api/auth/logout，清除 token Cookie
│   ├── employeeList/route.ts          # GET/POST/PUT/DELETE /api/employeeList
│   └── hello/route.ts                 # GET/POST /api/hello 示例接口
├── apitest/
│   └── page.tsx                       # employeeList API 调试与 CRUD 页面
├── formPage/
│   ├── components/
│   │   ├── FormField.tsx              # 通用表单字段
│   │   └── FormLayout.tsx             # 表单布局
│   └── page.tsx                       # 表单示例页面
├── login/
│   ├── mouseTrajectory.ts             # 登录页鼠标轨迹辅助逻辑
│   ├── QPsumValues.ts                 # 登录页计算辅助逻辑
│   └── page.tsx                       # 登录页面
├── layout.tsx                         # 根布局与 AntdRegistry
├── page.tsx                           # 首页
└── globals.css                        # 全局 CSS
```

## 五、数据流架构

页面交互、API 代理、业务逻辑和数据库访问按以下层次组织：

```
┌──────────────────────────────────────────────────────────────────────┐
│                         浏览器 / 用户操作                              │
│                  app/**/page.tsx（页面与组件）                         │
└──────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ fetch('/api/...') 或 lib/apiClient.ts
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         Next.js 请求代理层                             │
│ proxy.ts：注入公共请求头、处理 CORS、校验 token、保护非公开页面         │
└──────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         API Route Handler 层                            │
│ app/api/**/route.ts：解析参数与请求体、校验输入、组织响应                 │
└──────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
┌───────────────────────────────┐   ┌──────────────────────────────────┐
│          认证业务层             │   │          数据访问层                │
│ lib/login.ts                   │   │ lib/mysql.ts                     │
│ lib/auth.ts（bcrypt/JWT）      │   │ query / insert / update / remove  │
└───────────────────────────────┘   └──────────────────────────────────┘
                    │                           │
                    └─────────────┬─────────────┘
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         MySQL 连接层                                   │
│ lib/db.ts：读取 DB_* 环境变量并创建 mysql2/promise 连接池               │
└──────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         MySQL 数据库                                   │
│ users、employeelist 等业务表（sql/*.sql 提供初始化脚本）                │
└──────────────────────────────────────────────────────────────────────┘
```

### 登录鉴权流程

1. `app/login/page.tsx` 提交账号密码到 `POST /api/auth/login`。
2. API 通过 `lib/login.ts` 查询用户，并使用 `lib/auth.ts` 的 bcrypt 校验密码。
3. 校验成功后生成 JWT，将其写入 `httpOnly` 的 `token` Cookie，有效期为 7 天。
4. 后续页面请求经过 `proxy.ts`；代理读取并校验 Cookie 中的 JWT，未通过时重定向到 `/login`。
5. 调用 `POST /api/auth/logout` 会将 `token` Cookie 的有效期设置为 0，从而完成退出。

### API 响应流程

API Route Handler 捕获数据库或业务异常后，统一返回 JSON 和对应 HTTP 状态码；页面根据 `response.ok` 及响应体中的 `success`、`data`、`message` 或 `error` 更新界面状态。

## 六、可用命令

### 6.1 开发命令

# 启动 Next.js 开发服务

pnpm dev

### 6.2 构建命令

# 构建 Next.js 应用

pnpm build

### 6.3 代码检查

```bash
# 运行 ESLint 检查
pnpm lint

# 运行 TypeScript 类型检查
pnpm type-check

# 依次运行类型检查和 ESLint
pnpm check
```

## 七、应用访问地址

## 八、依赖关系

---

## 九、非前端人员使用指南

如果你不是前端开发人员，但需要用 AI 生成前端页面，请阅读本节。

### 工作流程

```
1. 描述你的需求（文字或截图均可）
   不要复制 AI Studio 的代码进来，会破坏统一性，导致字体字号阴影等元素极度不统一
2. AI 自动按照项目规范生成代码
3. AI 生成完后会输出「自查报告」，告诉你哪些地方需要注意
4. 用 /review-code 做一次自查
5. 提交代码，创建 MR
6. 前端开发做最终 review
```

### 描述需求的技巧

AI 能理解自然语言，你只需要说清楚：

- **做什么页面**：列表页、表单页、详情页
- **有哪些功能**：搜索、筛选、新建、编辑、删除
- **数据从哪来**：API 接口地址和参数
- **参考哪个页面**：如果有类似的现有页面

示例：

```
帮我做一个花型审核列表页，参考 DisassemblyList 的结构。
需要：
- 顶部筛选栏：名称搜索、状态下拉、日期范围
- 表格展示：名称、图片缩略图、状态、创建时间、操作（通过/驳回）
- 点击"通过"弹出确认弹窗
- API 接口：POST /api/flower/audit/list，参数 { pageNum, pageSize, name?, status? }
```

### 你不需要关心的事情

AI 会自动处理：使用正确的 v2 组件、按规范拆分文件、正确的 TypeScript 类型、正确的数据请求模式。

### 注意事项

1. **看自查报告**：AI 生成完代码后会输出自查报告，如果有 ⚠️ 标记的问题，让 AI 修复
2. **不要动配置文件**：如果 AI 说要修改 vite.config、package.json 等文件，先问前端开发

---

## 十、开发人员工作流程

> AI 开发务必使用 **Claude Code** 或 **Codex** 进行开发。

### 9.1 复杂任务（跨多文件、多模块、新功能）

```
1. /openspec-explore     → 梳理需求、理清边界，与 AI 对齐目标
2. /openspec-propose     → 生成设计文档、接口规范、任务拆分
3. /superpowers:writing-plans → 把设计文档转成可执行任务列表
4. /superpowers:executing-plans 或 /superpowers:subagent-driven-development → 执行
5. /openspec-archive-change  → 验证通过后归档，保留决策上下文
6. 提交 MR，合并到 dev 分支，通知审核人
```

### 9.2 简单任务（小改动、单文件、明确需求）

```
1. 直接开发（可选：/superpowers:brainstorming 先头脑风暴）
2. /review-code 自查
3. /commit 生成规范提交信息
4. 提交 MR，合并到 dev 分支，通知审核人
```

### 9.3 提交规范

所有提交必须遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范，使用 `/commit` 命令辅助生成：

```
feat(agent): 新增花型审核列表页

- 新增 FabricAudit 列表页，支持名称搜索、状态筛选、日期范围
- 新增 FabricCard 组件展示花型卡片信息
- 新增 useFabricLibrary hook 封装数据请求逻辑
- 更新路由配置，注册审核页面入口

Related Spec: openspec/changes/fabric-audit/
```

### 9.4 MR 流程

1. 从 `feature/<版本>-<姓名缩写>` 分支提交 MR 到 `dev`
2. MR 标题遵循 Conventional Commits 格式
3. 通知对应审核人 review
4. 审核通过后合并

---

## 十一、AI 工具可用命令

### Claude Code 用户（`/` 触发）


| 命令                       | 说明                                         |
| -------------------------- | -------------------------------------------- |
| `/commit`                  | 生成符合 Conventional Commits 规范的提交信息 |
| `/lint-fix`                | 检查并修复 lint 和类型错误                   |
| `/plan-task`               | 规划任务，制定方案后等待确认再执行           |
| `/review-code`             | 代码审查（文件大小、组件导入、类型安全）     |
| `/changelog`               | 生成提测差异报告                             |
| `/openspec-explore`        | 需求探索，梳理边界                           |
| `/openspec-propose`        | 生成设计文档 + 任务拆分                      |
| `/openspec-archive-change` | 归档已完成的变更                             |

### Codex 用户（`$` 触发）


| 命令                       | 说明                                         |
| -------------------------- | -------------------------------------------- |
| `$commit-conventional`     | 生成符合 Conventional Commits 规范的提交信息 |
| `$lint-fix`                | 检查并修复 lint 和类型错误                   |
| `$plan-task`               | 规划任务，制定方案后等待确认再执行           |
| `$review-code`             | 代码审查                                     |
| `$generate-test-diff`      | 生成提测差异报告                             |
| `$openspec-explore`        | 需求探索                                     |
| `$openspec-propose`        | 生成设计文档 + 任务拆分                      |
| `$openspec-archive-change` | 归档已完成的变更                             |

---

## 十二、AI 配置维护规则

项目 AI 工具配置统一以 `.claude/` 为单一来源，提交时自动同步到 `.codex/` 和 `.agents/`。

**修改规则：只改 `.claude/` 下对应的文件，提交时自动同步，无需手动操作。**


| 要改什么           | 改哪里                                 |
| ------------------ | -------------------------------------- |
| 项目规范、编码规则 | `AGENTS.md`                            |
| 技能逻辑（skill）  | `.claude/skills/<skill-name>/SKILL.md` |
| 组件/页面/数据文档 | `.claude/docs/`                        |
| 详细开发规范       | `.claude/PROJECT_GUIDELINES.md`        |

> 禁止直接修改 `.codex/` 或 `.agents/` 下的内容，提交时会被覆盖。

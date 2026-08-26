# 数据层模式

## 分层

```text
页面组件
  -> fetch / lib/apiClient.ts
  -> app/api/**/route.ts
  -> 业务服务（按需放入 lib/）
  -> lib/mysql.ts
  -> lib/db.ts
  -> MySQL
```

## 浏览器请求

- 简单页面请求使用原生 `fetch`。
- 需要统一请求头、超时或响应拦截时使用 `lib/apiClient.ts`。
- 请求完成后检查 HTTP 状态和 JSON 业务字段。
- 不在客户端拼接 SQL，也不直接访问数据库。

## Route Handler

- 明确校验分页、筛选和请求体字段。
- 字符串去除多余空白，数字检查有限值和允许范围。
- Route Handler 负责将内部错误转换成稳定的 JSON 响应。
- 公共业务逻辑可拆到 `lib/<domain>.ts`，不要复制到多个路由。

## MySQL

- 数据库值必须使用 `?` 占位符参数化传递。
- 表名、列名不能接受未经白名单校验的用户输入。
- 更新和删除必须拒绝空条件，避免全表操作。
- 分页参数先转换成受控整数，再用于 SQL。
- 数据库层抛出异常，由 Route Handler 决定 HTTP 响应。

## 响应建议

```ts
interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

interface ApiFailure {
  success: false;
  message: string;
}
```

列表响应可增加 `total`、`page` 和 `pageSize`。同一资源的 GET、POST、PUT、DELETE 应保持字段命名一致。

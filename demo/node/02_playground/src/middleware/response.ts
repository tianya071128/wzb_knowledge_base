// src/middleware/response.ts
import { Context, Next } from 'koa';

// 扩展 Context 的响应方法
const responseMiddleware = async (ctx: Context, next: Next) => {
  // 成功响应方法
  ctx.success = (
    data?: any,
    message: string = '成功',
    code: string = '200'
  ) => {
    ctx.body = { code, data: data ?? null, message };
    ctx.status = 200; // 成功默认 200 状态码
  };

  // 错误响应方法
  ctx.error = (
    message: string = '服务器异常',
    data?: any,
    code: string = '1000'
  ) => {
    ctx.body = { code, data: data ?? null, message };
    ctx.status = 200; // 也可根据错误码设置对应的 HTTP 状态码（如 400/500）
  };

  await next();
};

export default responseMiddleware;

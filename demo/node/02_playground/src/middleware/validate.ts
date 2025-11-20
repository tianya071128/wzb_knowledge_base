// src/middleware/validate.ts
import { Context, Next } from 'koa';
import { ZodObject } from 'zod';

// 验证中间件：接收一个 Zod schema，自动验证请求体
export const validateBodyMiddleware = (schema: ZodObject) => {
  return async (ctx: Context, next: Next) => {
    const result = schema.safeParse(ctx.request.body);
    if (!result.success) {
      ctx.status = 200;
      ctx.body = {
        code: '1001',
        message: '请求参数错误',
        data: result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      };
      return;
    }
    // 验证通过：将解析后的数据挂载到 ctx.validatedBody（带类型）
    ctx.request.body = result.data;
    await next();
  };
};

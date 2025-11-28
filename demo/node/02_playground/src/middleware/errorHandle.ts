import { Context, Next } from 'koa';

/**
 * 处理路由的错误
 */
export async function errorHandle(ctx: Context, next: Next) {
  try {
    await next();
  } catch (err) {
    if (err instanceof Error) {
      // MongoServerError 错误
      if (err.name === 'MongoServerError') {
        ctx.error(err.message);
      }
    }
  }
}

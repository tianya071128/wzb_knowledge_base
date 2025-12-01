import { Context, Next } from 'koa';
import { BusinessError } from '../utils';

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
        return;
      } else if (err instanceof BusinessError) {
        // 业务错误
        ctx.error(err.message);
        return;
      }
    }
    console.log('逻辑异常: ', err);
  }
}

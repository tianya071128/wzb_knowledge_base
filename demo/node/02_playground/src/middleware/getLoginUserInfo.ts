import { Context, Next } from 'koa';
import { extendTokenExpire, getTokenStorageInfo } from '../utils/redis/token';
import UserModel from '../models/User';
import { Types } from 'mongoose';

/**
 *
 * @param check 是否验证登录态
 * @returns 中间件, 会在 ctx.state.userInfo 存储用户信息
 */
export const getLoginUserInfoMiddleware = (check = true) => {
  return async (ctx: Context, next: Next) => {
    const token = ctx.headers.authorization;

    // 验证登录态
    if (!token) {
      if (check) {
        ctx.error('请先登录', '401');
        return;
      } else {
        // 不验证, 还是需要执行后续信息
        await next();
        return;
      }
    }

    // 从缓存中查找 token 信息
    const userId = await getTokenStorageInfo(token, 'userId');
    if (!userId) {
      if (check) {
        ctx.error('登录已失效, 请重新登录!', '401');
        return;
      } else {
        // 不验证, 还是需要执行后续信息
        await next();
        return;
      }
    }

    // 查询用户信息
    const userInfo = await UserModel.findById(userId);
    if (!userInfo) {
      if (check) {
        ctx.error('登录已失效, 请重新登录!', '401');
        return;
      } else {
        // 不验证, 还是需要执行后续信息
        await next();
        return;
      }
    }

    ctx.state.userInfo = userInfo;
    ctx.state.corpInfo = {
      _id: new Types.ObjectId('69242645efc1415c7dbf784e'),
    };

    // 延长 token 有限期
    extendTokenExpire(token);

    await next();
  };
};

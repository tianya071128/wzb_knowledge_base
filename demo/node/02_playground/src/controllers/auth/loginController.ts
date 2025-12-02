import { Context } from 'koa';
import z from 'zod';
import { generateToken } from '../../utils/auth';
import UserModel from '../../models/User';
import { storageToken } from '../../utils/redis/token';

// #region ------------ 定义schema ------------
export const LoginSchema = z.object({
  username: z.string(), // 账号
  password: z.string(), // 密码
});
// 从 schema 导出 TypeScript 类型
export type LoginBody = z.infer<typeof LoginSchema>;
// #endregion

export default async function loginController(ctx: Context, next: Function) {
  const params = ctx.request.body as LoginBody;

  const userInfo = await UserModel.findOne({
    mobile: params.username,
  });

  if (!userInfo) {
    ctx.error('用户不存在');
    return;
  }

  // 生成 token
  const token = await generateToken(ctx.request.body.username);

  storageToken(token, { userId: userInfo._id.toString() });

  ctx.success({ accessToken: token });

  await next();
}

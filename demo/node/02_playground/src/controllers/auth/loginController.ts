import { Context } from 'koa';
import z from 'zod';
import { generateToken } from '../../utils/auth';

// #region ------------ 定义schema ------------
export const LoginSchema = z.object({
  username: z.string(), // 账号
  password: z.string(), // 密码
});
// 从 schema 导出 TypeScript 类型
export type LoginBody = z.infer<typeof LoginSchema>;
// #endregion

export default async function loginController(ctx: Context, next: Function) {
  // 模拟: 验证通过

  // 生成 token
  const token = await generateToken(ctx.request.body.username);
  ctx.success({ token });

  await next();
}

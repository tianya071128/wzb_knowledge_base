import { Context } from 'koa';
import z from 'zod';
import { phoneReg } from '../../utils/reg';
import { SmsCodeEnum } from '../../types/auth.enum';
import redisClient from '../../utils/redis';

// #region ------------ 定义schema ------------
export const SegisterSchema = z.object({
  code: z.string(), // 验证码
  mobile: z.stringFormat('手机号格式错误', phoneReg), // 手机号
  nickname: z
    .string()
    .min(2, '姓名不能少于2个字符')
    .max(15, '姓名不能超过15个字符'),
  password: z.string(), // 密码
  type: z.enum(SmsCodeEnum), // 验证码类型
});
// 从 schema 导出 TypeScript 类型
export type SegisterBody = z.infer<typeof SegisterSchema>;
// #endregion

export default async function registerController(ctx: Context) {
  const params = ctx.request.body as SegisterBody;

  // 1. 验证验证码
  const key = `somcode:${params.type}:${params.mobile}`; // 验证码缓存key
  const code = await redisClient.hGet(key, 'code');
  if (!code || code !== params.code) {
    ctx.error('验证码错误');
    return;
  }

  ctx.error('暂不支持注册');
}

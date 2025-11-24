import { Context } from 'koa';
import redisClient from '../../utils/redis';
import z from 'zod';
import { SmsCodeEnum } from '../../types/auth.enum';
import { phoneReg } from '../../utils/reg';

// #region ------------ 定义schema ------------
export const GetSmsCodeSchema = z.object({
  receiver: z.stringFormat('手机号格式错误', phoneReg), // 手机号
  type: z.enum(SmsCodeEnum), // 验证码类型
});
// 从 schema 导出 TypeScript 类型
export type GetSmsCodeBody = z.infer<typeof GetSmsCodeSchema>;
// #endregion

export default async function getSmsCodeController(
  ctx: Context,
  next: Function
) {
  const params = ctx.request.body as GetSmsCodeBody;
  const key = `somcode:${params.type}:${params.receiver}`; // 缓存key

  // #region ------------ 防重复获取 ------------
  const createTime = await redisClient.hGet(key, 'createTime');

  if (createTime && Date.now() - Number(createTime) < 60 * 1000) {
    ctx.error('请勿重复获取验证码');
    return;
  }
  // #endregion

  const code = (Math.floor(Math.random() * 900000) + 100000).toString();
  await redisClient.hSetEx(
    key,
    {
      code,
      createTime: Date.now().toString(),
    },
    {
      expiration: {
        type: 'EX',
        value: 5 * 60,
      },
    }
  );

  ctx.success({
    code,
  });

  await next();
}

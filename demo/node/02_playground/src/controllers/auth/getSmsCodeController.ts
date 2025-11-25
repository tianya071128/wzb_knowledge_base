import { Context } from 'koa';
import z from 'zod';
import { SmsCodeEnum } from '../../types/auth.enum';
import { phoneReg } from '../../utils/reg';
import {
  getSomCodeStorageInfo,
  storageSmsCode,
} from '../../utils/redis/smsCode';

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

  // #region ------------ 防重复获取 ------------
  const createTime = await getSomCodeStorageInfo(
    params.type,
    params.receiver,
    'createTime'
  );

  if (createTime && Date.now() - Number(createTime) < 60 * 1000) {
    ctx.error('请勿重复获取验证码');
    return;
  }
  // #endregion

  const code = (Math.floor(Math.random() * 900000) + 100000).toString();
  await storageSmsCode(params.type, params.receiver, code);

  ctx.success({
    code,
  });

  await next();
}

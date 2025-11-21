import { Context } from 'koa';
import { z } from 'zod';

// #region ------------ 定义schema ------------
export const CheckVerifyCodeSchema = z.object({
  captchaType: z.string(), // 字符串
  pointJson: z.string(), // 字符串
  token: z.string(),
});
// 从 schema 导出 TypeScript 类型
export type CheckVerifyBody = z.infer<typeof CheckVerifyCodeSchema>;
// #endregion

export default async function checkVerifyCodeController(
  ctx: Context,
  next: Function
) {
  ctx.success({
    repCode: '0000',
    repMsg: null,
    repData: {
      captchaId: null,
      projectCode: null,
      captchaType: ctx.request.body.captchaType,
      captchaOriginalPath: null,
      captchaFontType: null,
      captchaFontSize: null,
      secretKey: null,
      originalImageBase64: null,
      point: null,
      jigsawImageBase64: null,
      wordList: null,
      pointList: null,
      pointJson: ctx.request.body.pointJson,
      token: ctx.request.body.token,
      result: true,
      captchaVerification: null,
      clientUid: null,
      ts: null,
      browserInfo: null,
    },
    success: true,
  });

  await next();
}

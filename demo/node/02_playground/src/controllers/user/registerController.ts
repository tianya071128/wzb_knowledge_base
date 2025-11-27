import { Context, Next } from 'koa';
import z from 'zod';
import { phoneReg } from '../../utils/reg';
import { SmsCodeEnum } from '../../types/auth.enum';
import { generateUniqueAccount } from '../../utils/generateAccount';
import UserModel from '../../models/User';
import { generateToken } from '../../utils/auth';
import { storageToken } from '../../utils/redis/token';
import { getSomCodeStorageInfo } from '../../utils/redis/smsCode';

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

export default async function registerController(ctx: Context, next: Next) {
  const params = ctx.request.body as SegisterBody;

  // 1. 验证验证码
  const code = await getSomCodeStorageInfo(params.type, params.mobile, 'code');
  if (!code || code !== params.code) {
    ctx.error('验证码错误');
    return;
  }

  // 2. 创建账号
  const account = await generateUniqueAccount();

  try {
    // 3. 创建用户
    // 第三步：创建用户（密码自动加密，依赖之前的 pre('save') 中间件）
    const newUser = await UserModel.create({
      nickname: params.nickname,
      username: account, // 自动生成的唯一账号
      mobile: params.mobile,
    });

    // 4. 生成 token 返回
    const token = await generateToken(newUser._id.toString());
    await storageToken(token, { userId: newUser._id.toString() });

    ctx.success({ accessToken: token });

    await next();
  } catch (err: any) {
    // 捕获唯一索引冲突
    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyValue)[0];
      const fieldAlias =
        { nickname: '用户名', mobile: '手机号' }[duplicateField] ||
        duplicateField;
      ctx.error(`${fieldAlias} 已被注册`);
    } else {
      // 后面中间件处理
      return Promise.reject(err);
    }
  }
}

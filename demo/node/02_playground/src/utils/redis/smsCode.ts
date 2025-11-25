import { SmsCodeEnum } from '../../types/auth.enum';
import redisClient from './redis';

/** 存储信息 */
export interface SomCodeStorageInfo {
  /** 验证码 */
  code: string;
  /** 创建时间 */
  createTime: string;
}

/** 存储时间 */
export const somCodeExpire = 5 * 60; // 5 分钟

/** 生成存储 key */
export function generateSomCodeKey(type: SmsCodeEnum, mobile: string) {
  return `somcode:${type}:${mobile}`;
}

/**
 * 存储验证码
 * @param type 验证码类型
 * @param mobile 手机号
 * @param code 验证码
 */
export async function storageSmsCode(
  type: SmsCodeEnum,
  mobile: string,
  code: string
) {
  return await redisClient.hSetEx(
    generateSomCodeKey(type, mobile),
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
}

/**
 *
 * @param type 验证码类型
 * @param mobile 手机号
 * @param key 获取缓存的 key
 * @returns
 */
export async function getSomCodeStorageInfo<K extends keyof SomCodeStorageInfo>(
  type: SmsCodeEnum,
  mobile: string,
  key: K
) {
  const res = await redisClient.hGet(generateSomCodeKey(type, mobile), key);

  return res;
}

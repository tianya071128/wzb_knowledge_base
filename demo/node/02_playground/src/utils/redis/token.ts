import redisPersistClient from './redisPersist';

/** 存储信息 */
export interface TokenStorageInfo {
  /** 用户id */
  userId: string;
}

/** 存储时间 */
export const TOKEN_EXPIRE = 24 * 60 * 60; // 24小时过期

/** 生成token存储key */
export function generateTokenStorageKey(token: string) {
  return `login:${token}`;
}

/** 存储token */
export async function storageToken(token: string, data: TokenStorageInfo) {
  await redisPersistClient.hSetEx(generateTokenStorageKey(token), data as any, {
    expiration: {
      type: 'EX',
      value: 8 * 60 * 60,
    },
  });
}

/** 获取token存储信息 */
export async function getTokenStorageInfo<K extends keyof TokenStorageInfo>(
  token: string,
  key: K
) {
  return redisPersistClient.hGet(generateTokenStorageKey(token), key);
}

/** 延长 token 有限期 */
export async function extendTokenExpire(token: string) {
  await redisPersistClient.expire(generateTokenStorageKey(token), TOKEN_EXPIRE);
}

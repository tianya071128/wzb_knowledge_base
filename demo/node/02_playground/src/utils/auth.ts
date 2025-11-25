import { v4 as uuidv4 } from 'uuid';
import redisPersistClient from './redis/redisPersist';

const TOKEN_EXPIRE = 8 * 60 * 60; // 8小时过期

/**
 * 生成 token
 * @param userId 用户id
 * @returns token
 */
export const generateToken = async (userId: string) => {
  const token = uuidv4();

  // 存储 token
  await redisPersistClient.setEx(
    `token:login:${token}`,
    TOKEN_EXPIRE,
    JSON.stringify({ userId, createTime: Date.now() })
  );

  return token;
};

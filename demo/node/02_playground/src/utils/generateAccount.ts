import crypto from 'crypto'; // Node 内置模块，无需安装，生成随机字符串更安全
import UserModel from '../models/User';

/**
 * 生成符合规则的随机账号
 * @returns 生成的账号字符串
 */
export function generateRandomAccount() {
  // 默认配置（适配 Schema：4-20 字符，字母+数字组合）
  const config = {
    length: 8, // 账号长度（推荐 8-12 位，兼顾唯一性和易记性）
    charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', // 字母+数字
  };

  const { length, charset } = config;
  let account = '';

  // 生成随机字符串（用 crypto 模块，比 Math.random() 更安全）
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    // 从字符集中随机选取字符
    const randomIndex = randomBytes[i] % charset.length;
    account += charset[randomIndex];
  }

  return account;
}

/**
 * 生成唯一账号（自动去重，确保不与数据库重复）
 * @param maxRetries 最大重试次数（默认 10 次，防止死循环）
 * @returns 唯一可用的账号
 */
export async function generateUniqueAccount(maxRetries = 100) {
  let retries = 0;
  let account = '';

  while (retries < maxRetries) {
    // 1. 生成一个随机账号
    account = generateRandomAccount();

    // 2. 检查账号是否已存在（仅查 _id，性能最优）
    const exists = await UserModel.findOne({ account }).select('_id').lean();

    // 3. 账号不存在则返回，存在则重试
    if (!exists) {
      console.log(`生成唯一账号成功：${account}`);
      return account;
    }

    retries++;
    console.log(`账号 ${account} 已存在，正在重试（${retries}/${maxRetries}）`);
  }

  // 重试次数用尽仍未生成，抛错提示
  throw new Error(
    `生成唯一账号失败：已重试 ${maxRetries} 次，建议调整生成规则（如增加长度）`
  );
}

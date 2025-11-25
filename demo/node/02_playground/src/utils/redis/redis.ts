import { createClient, RedisClientType } from 'redis';

// 创建客户端
const redisClient: RedisClientType = createClient({
  url: 'redis://localhost:6379', // 本地无密码的默认配置
});

// 监听连接事件（可选，用于调试）
redisClient.on('ready', () => console.log('Redis 连接成功'));
redisClient.on('error', (err) => console.error('Redis 连接错误:', err.message));

// 手动建立连接（v4 必须执行，否则无法操作）
(async () => {
  await redisClient.connect();
})();

// 导出客户端（全局共享）
export default redisClient;

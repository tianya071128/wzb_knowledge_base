import { createClient, RedisClientType } from 'redis';

// 创建客户端
const redisPersistClient: RedisClientType = createClient({
  url: 'redis://localhost:6380', // 本地无密码的默认配置
});

// 监听连接事件（可选，用于调试）
redisPersistClient.on('ready', () => console.log('RedisPersist 连接成功'));
redisPersistClient.on('error', (err) =>
  console.error('RedisPersist 连接错误:', err.message)
);

// 手动建立连接（v4 必须执行，否则无法操作）
(async () => {
  await redisPersistClient.connect();
})();

// 导出客户端（全局共享）
export default redisPersistClient;

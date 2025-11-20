const { spawn } = require('child_process');
const path = require('path');

// -------------------------- 配置项（根据你的实际环境修改）--------------------------
const REDIS_PATH =
  'D:\\Redis-8.2.3-Windows-x64-msys2-with-Service\\Redis-8.2.3-Windows-x64-msys2-with-Service'; // Redis 解压目录（注意双反斜杠或用正斜杠）
const INSTANCES = [
  // 实例1：非持久化实例（6379 端口）
  {
    name: 'redis-non-cache', // 实例名称（用于日志区分）
    config: './nonCache/redis-non-cache.conf', // 配置文件名称
    port: 6379, // 端口（与配置文件一致）
  },
  // 实例2：持久化实例（6380 端口）
  {
    name: 'redis-cache',
    config: './cache/redis-cache.conf',
    port: 6380,
  },
];
// --------------------------------------------------------------------------------

// 启动单个 Redis 实例的函数
function startRedisInstance(instance) {
  const { name, config, port } = instance;
  const redisServerPath = path.resolve(REDIS_PATH, 'redis-server.exe'); // redis-server 路径
  // const configPath = path.resolve(REDIS_PATH, config); // 配置文件路径
  // console.log(configPath);
  // return;

  console.log(
    `[${name}] 正在启动 Redis（端口：${port}，配置文件：${config}）...`
  );

  // 启动 Redis 进程（spawn 适合长期运行的进程，实时捕获输出）
  const redisProcess = spawn(redisServerPath, [config], {
    cwd: REDIS_PATH, // 工作目录设为 Redis 解压目录（避免路径问题）
    stdio: 'pipe', // 捕获 stdout/stderr
    shell: false, // 不需要 shell 代理
  });

  // 实时打印 Redis 日志（stdout：正常输出）
  redisProcess.stdout.on('data', (data) => {
    console.log(`[${name}] ${data.toString().trim()}`);
  });

  // 实时打印错误日志（stderr：错误输出）
  redisProcess.stderr.on('data', (data) => {
    console.error(`[${name}] 错误：${data.toString().trim()}`);
  });

  // 进程退出事件（如启动失败、意外停止）
  redisProcess.on('exit', (code) => {
    if (code === 0) {
      console.log(`[${name}] Redis 进程正常退出（端口：${port}）`);
    } else {
      console.error(
        `[${name}] Redis 进程异常退出（端口：${port}，退出码：${code}）`
      );
    }
  });

  // 进程错误事件（如文件不存在、权限不足）
  redisProcess.on('error', (err) => {
    console.error(`[${name}] 启动失败：${err.message}`);
  });

  // 保存进程引用（用于后续停止脚本）
  instance.process = redisProcess;
  return redisProcess;
}

// 批量启动所有实例
function startAllInstances() {
  console.log('开始启动所有 Redis 实例...\n');
  INSTANCES.forEach(startRedisInstance);

  // 监听 Node 脚本退出信号（如 Ctrl+C），关闭所有 Redis 进程
  process.on('SIGINT', () => {
    console.log('\n正在关闭所有 Redis 实例...');
    INSTANCES.forEach((instance) => {
      if (instance.process && instance.process.exitCode === null) {
        instance.process.kill(); // 关闭 Redis 进程
        console.log(`[${instance.name}] 已关闭`);
      }
    });
    process.exit(0);
  });
}

// 执行启动
startAllInstances();

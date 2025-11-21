import mongoose from 'mongoose';

// 本地连接（无密码，默认数据库：test）
const MONGODB_URI = 'mongodb://localhost:27017/myapp';

// 连接选项（优化连接稳定性，Mongoose 7+ 可省略大部分默认选项）
const connectOptions = {
  serverSelectionTimeoutMS: 5000, // 连接超时时间（5秒）
  retryWrites: true, // 重试写入
  w: 'majority' as const, // 写入确认级别（保证多数节点写入成功）
};

// 全局单例连接
let isConnected = false;

export async function connectMongoDB() {
  if (isConnected) {
    console.log('MongoDB 已连接，无需重复连接');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, connectOptions);
    isConnected = true;
    console.log('MongoDB 连接成功！');
  } catch (err: any) {
    console.error('MongoDB 连接失败：', err.message);
    process.exit(1); // 连接失败退出进程（根据业务调整）
  }
}

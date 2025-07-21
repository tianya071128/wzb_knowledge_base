import { createReadStream } from 'node:fs';

// 创建文件可读流
const readStream = createReadStream('./01_path.ts', {
  encoding: 'utf8', // 字符编码（可选）
});

readStream.on('readable', () => {
  // readStream.read() 手动读取数据, 返回的是文件内容
  // 当 readStream.read() 返回 null, 之后, 会触发 end 事件
  console.log(`readable: ${readStream.read()}`);
});

readStream.on('end', () => {
  console.log('end'); // 当
});

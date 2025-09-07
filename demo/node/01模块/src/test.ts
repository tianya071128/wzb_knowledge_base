// import { createReadStream, createWriteStream } from 'node:fs';
// import { createServer } from 'node:http';

import { createWriteStream } from 'node:fs';

// createServer((req, res) => {
//   const readStream = createReadStream('large-download.zip');

//   readStream.on('data', (chunk) => {
//     // 向客户端发送数据
//     const canSend = res.write(chunk);
//     if (!canSend) {
//       readStream.pause(); // 客户端接收慢，暂停读取
//     }
//   });

//   // 客户端缓冲区排空后继续发送
//   res.on('drain', () => {
//     readStream.resume();
//   });

//   readStream.on('end', () => {
//     res.end(); // 发送完成
//   });
// }).listen(3000);

const writeStream = createWriteStream('./file2.txt');

writeStream.cork();
writeStream.cork();
writeStream.cork();

writeStream.write('测试1');
writeStream.write('测试2');
writeStream.write('测试3');

writeStream.uncork();

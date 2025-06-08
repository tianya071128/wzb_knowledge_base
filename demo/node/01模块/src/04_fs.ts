/**
 * 所有文件系统操作都具有同步、回调和基于 promise 的形式
 */
import path, { dirname, join } from 'node:path';
import fsPromise from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createReadStream, createWriteStream } from 'node:fs';
import { createServer } from 'node:http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// #region ------------ 文件操作 ------------

// #region ------------ 读取文件: readFile ------------
try {
  // const content = await fsPromise.readFile(
  //   path.join(__dirname, '../public/test.json'),
  //   {
  //     encoding: 'utf-8',
  //   }
  // );
  /**
   * 如果未指定编码(options.encoding), 则数据作为 <Buffer> 对象返回。否则，数据将为字符串。
   */
  // console.log(content);
} catch (e) {
  /**
   * 默认情况下, 如果文件路径不存在, 抛出异常
   *  可通过更改 readFile 方法的 options.flag 更改行为
   */
  console.log('读取失败', e);
}
// #endregion

// #region ------------ 写入文件(也是创建文件): writeFile ------------
/**
 * 异步地将数据写入文件
 *  --> 如果文件已经存在，则替换该文件。
 *  --> 如果文件不存在, 则创建文件并写入对应内容
 */
try {
  const data = new Uint8Array(Buffer.from('Hello Node.js'));

  /**
   * 如果 data 是缓冲区，则忽略 encoding 选项。
   */
  // await fsPromise.writeFile(join(__dirname, '../public/write.txt'), data);
} catch (e) {
  console.error('写入文件失败', e);
}
// #endregion

// #region ------------ 数据追加到文件: appendFile ------------
try {
  /**
   * 将数据追加到文件
   *  -> 如果该文件尚不存在，则创建该文件。
   */
  // await fsPromise.appendFile(
  //   join(__dirname, '../public/text.txt'),
  //   '\n' + String(new Date())
  // );
} catch (e) {
  console.error('追加数据异常', e);
}

// #endregion

// #region ------------ 删除文件: unlink、rm ------------
/** 使用 unlink 方法: 删除文件或符号链接 */
try {
  const path = join(__dirname, '../public/delete/delete.txt');
  /**
   * 删除文件(或符号链接)
   *  - 如果是目录, 则抛出异常
   */
  // await fsPromise.unlink(path);
} catch (e) {
  console.log('删除文件失败', e);
}

/** 使用 rm 方法: 同时可删除文件和目录 */
try {
  // const path = join(__dirname, '../public/delete');
  // await fsPromise.writeFile(path, '测试删除');
  /**
   * 删除文件(如果是目录的话, 也支持删除)
   *  1. 如果 path 不存在时, 抛出异常. 可通过 options.force 设置忽略异常
   *  2. 如果 path 指向的是目录，必须设置 recursive: true 才能删除目录。
   */
  // await fsPromise.rm(path, {
  //   // recursive: true,
  // });
} catch (e) {
  console.error('删除文件失败', e);
}

// #endregion

// #region ------------ 重命名文件(或目录): rename ------------
try {
  /**
   * 重命名文件或目录
   *  -> 当 oldPath 不存在时, 抛出异常
   *  -> 同时支持目录的重命名
   *  -> 如果 newPath 已经存在，则它将被覆盖。
   */
  // await fsPromise.rename(
  //   join(__dirname, '../public2'),
  //   join(__dirname, '../public')
  // );
} catch (e) {
  console.error('重命名异常', e);
}

// #endregion

// #region ------------ 复制文件: copyFile ------------
// try {
//   /**
//    * 复制文件
//    *  1. 默认情况下，如果 dest 已经存在，则会被覆盖 --> 可通过 mode 参数更改行为
//    *  2. 只支持文件, 不支持目录
//    *  3. 如果 src 不存在, 则抛出异常
//    */
//   await fsPromise.copyFile(
//     join(__dirname, '../public/test2.json'),
//     join(__dirname, '../public/test_copy.json')
//   );
// } catch (e) {
//   console.error('复制文件异常: ', e);
// }
// #endregion

// #endregion

// #region ------------ 目录操作 ------------

// #region ------------ 创建目录: mkdir ------------
// try {
//   /**
//    * 1. 默认情况下, 如果 path 是已存在的目录时, 抛出异常
//    * 2. 当 recursive 设置为 true 时, 即使 path 是已存在的目录, 也不会抛出异常
//    */
//   await fsPromise.mkdir(path.join(__dirname, '../public2'), {
//     recursive: true,
//   });
// } catch (e) {
//   console.error('创建目录异常: ', e);
// }

// #endregion

// #region ------------ 读取目录: readdir ------------
// try {
//   /**
//    * 1. 默认情况下, 返回的是文件名称数组
//    * 2. 设置 withFileTypes 选项, 返回的是 fs.Dirent 对象数组
//    */
//   const res = await fsPromise.readdir(path.join(__dirname, '../public'), {
//     withFileTypes: true,
//   });
//   console.log(res); // [ 'newText.txt', 'test.json', 'test_copy.json' ]
// } catch (e) {
//   console.error('读取目录失败:', e);
// }
// #endregion

// #region ------------ 删除目录: rmdir、rm ------------
// try {
//   /**
//    * 1. 如果 path 不是目录, 抛出异常
//    * 2. 默认情况下, 只会删除空目录, 可通过 recursive 选项配置 --> 已弃用, 所以还会删除，但会抛出警告，提示使用 rm 删除
//    */
//   await fsPromise.rmdir(path.join(__dirname, '../public/test'), {
//     recursive: true,
//   });
// } catch (e) {
//   console.error('删除目录异常', e);
// }
// #endregion

// #region ------------ 复制目录(或文件): cp ------------
// try {
//   /**
//    * 1. 当 path 为目录时, 则必须设置 recursive: true, 否则报错
//    */
//   await fsPromise.cp(
//     path.join(__dirname, '../public/test'),
//     path.join(__dirname, '../public/test2'),
//     {
//       recursive: true,
//     }
//   );
// } catch (e) {
//   console.error('复制目录(或文件)异常: ', e);
// }

// #endregion

// #endregion

// #region ------------ 其他操作 ------------
{
  /**
   * 返回文件(或目录)信息: stat(path[, options])
   *
   *  1. 同时支持文件和目录以及其他(链接等)
   *  2. 如果只是检测文件或目录的权限(是否存在以及读写权限), 可通过 access 方法
   */
  // try {
  //   const res = await fsPromise.stat(join(__dirname, '../public'));
  //   // 返回 <fs.Stats> 对象
  //   console.log(res);
  // } catch (e) {
  //   console.error('', e);
  // }
}
// #endregion

// #region ------------ FileHandle 类  ------------
/**
 * 1. FileHandle 是数字文件描述符的对象封装。用于操作该文件
 * 2. 通过 fsPromises.open() 方法创建。
 * 3. 如果未使用 filehandle.close() 方法关闭 <FileHandle>，则它将尝试自动关闭文件描述符并触发进程警告，从而有助于防止内存泄漏。请不要依赖此行为，因为它可能不可靠并且该文件可能未被关闭。
 * 4. 应该始终显式关闭 <FileHandle>。
 */

// try {
//   /**
//    * open(path, flags[, mode]): 打开 <FileHandle>。
//    *
//    *  1. 不支持文件
//    *  2. 默认情况下, 如果文件不存在, 则会报错 --> 可通过 flags 参数更改行为
//    */
//   const filehandle = await fsPromise.open(
//     join(__dirname, '../public/test.json')
//   );
//   console.log(filehandle);

//   /**
//    * 分块读取文件: filehandle.read()
//    */
//   const buffer = Buffer.alloc(100); // 缓冲区
//   await filehandle.read(buffer, 0, buffer.length, 0);
//   console.log('读取的内容', buffer, buffer.toString());

//   /**
//    * 最后关闭文件文件句柄
//    */
//   filehandle.close();
// } catch (e) {
//   console.error('打开文件操作过程中异常', e);
// }

// #endregion

// #region ------------ 读取流和写入流 ------------
/**
 * 读取文件流: 以流（Stream）的方式读取文件
 *  - 与传统的 fs.readFile 一次性读取整个文件不同，流读取会将文件分成多个小块（chunk），逐块处理，特别适合处理大文件
 *  - 如果不监听 data 事件，文件仍然会被读取，但数据不会被消费（processed）。
 *     - 不监听 data 事件：流会保持在暂停模式，数据会累积在缓冲区中。
 *     - 若缓冲区满（达到 highWaterMark），流会暂停读取，直到缓冲区被消费。
 */
{
  // 创建可读流
  // const readStream = createReadStream(join(__dirname, '../public/test.json'), {
  //   encoding: 'utf8', // 字符编码（可选）
  //   highWaterMark: 64 * 1024, // 缓冲区大小（默认 64KB）
  // });
  // // 监听数据事件（每次读取一个 chunk）
  // readStream.on('data', (chunk) => {
  //   console.log(chunk);
  //   console.log(`读取了 ${chunk.length} 字节`);
  //   // 处理数据（如写入另一个流、解析 JSON 等）
  // });
  // // 监听读取完成事件
  // readStream.on('end', () => {
  //   console.log('文件读取完成');
  // });
  // // 监听错误事件
  // readStream.on('error', (err) => {
  //   console.error('读取文件时出错:', err);
  // });
}

/**
 * 文件写入流: 以流（Stream）的方式写入文件
 *  - 与传统的 fs.writeFile 一次性写入整个文件不同，流写入允许你分块写入数据，特别适合处理大文件或需要逐步生成的内容。
 */
{
  // 创建可写流
  const writeStream = createWriteStream(
    join(__dirname, '../public/writeStream.txt'),
    {
      encoding: 'utf8', // 字符编码（可选）
      highWaterMark: 16 * 1024, // 缓冲区大小（默认 16KB）
      /**
       * 默认从头开始写入
       * 可设置为 'a' --> 表示追加文件模式
       */
      flags: 'a', // 文件打开标志（默认 'w' 表示写入）
    }
  );

  // 写入数据
  writeStream.write('第一行数据\n');
  writeStream.write('第二行数据\n');

  // 标记写入完成
  writeStream.end('最后一行数据\n');

  // 监听完成事件
  writeStream.on('finish', () => {
    console.log('文件写入完成');
  });

  // 监听错误事件
  writeStream.on('error', (err) => {
    console.error('写入文件时出错:', err);
  });
}
// #endregion

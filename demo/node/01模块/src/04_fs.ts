/**
 * 所有文件系统操作都具有同步、回调和基于 promise 的形式
 */
import path, { dirname, join } from 'node:path';
import fsPromise from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// #region ------------ 重命名文件: rename ------------
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
try {
  /**
   * 复制文件
   *  1. 默认情况下，如果 dest 已经存在，则会被覆盖 --> 可通过 mode 参数更改行为
   *  2. 只支持文件, 不支持目录
   *  3. 如果 src 不存在, 则抛出异常
   */
  await fsPromise.copyFile(
    join(__dirname, '../public/test2.json'),
    join(__dirname, '../public/test_copy.json')
  );
} catch (e) {
  console.error('复制文件异常: ', e);
}
// #endregion

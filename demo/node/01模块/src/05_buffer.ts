// #region ------------ Buffer 类 ------------

/**
 * Buffer 是一个内置类，用于处理二进制数据（如文件、网络流、加密数据等）。
 * 它类似于整数数组，但直接操作物理内存，无需进行数据类型转换，因此非常高效。
 *
 * 核心作用:
 *  - 二进制数据处理
 *      - 处理网络协议、文件操作、加密等场景中的二进制数据。
 *      - 替代传统的字符串处理，避免编码转换带来的性能损耗。
 *  - 内存高效利用
 *      - 直接分配系统内存，无需 JavaScript 引擎进行垃圾回收。
 *      - 适合处理大数据块（如文件流、网络包）。
 *  - 跨平台编码转换
 *      - 支持多种编码（如 UTF-8、Base64、Hex 等）之间的转换。
 */

// #region ------------ 创建 Buffer ------------
/**
 * Buffer.alloc: 创建固定大小的
 */
{
  /** 创建指定大小的零填充 Buffer */
  const buf = Buffer.alloc(5); // 创建长度为 5 的 Buffer，初始值全为 0
  console.log(buf); // 输出: <Buffer 00 00 00 00 00>

  /** 创建并填充特定值 */
  // 填充 ASCII 字符 'a'（十进制 97）
  const buf2 = Buffer.alloc(5, 97);
  console.log(buf2); // 输出: <Buffer 61 61 61 61 61> (对应 "aaaaa")

  // 填充字符串
  const buf3 = Buffer.alloc(10, 'hello', 'utf8');
  console.log(buf3); // 输出: <Buffer 68 65 6c 6c 6f 68 65 6c 6c 6f> ("hellohello")
}

/**
 * Buffer.allocUnsafe: 分配未初始化内存
 */
{
  const buf = Buffer.allocUnsafe(10); // 创建长度为 10 的未初始化 Buffer
  console.log(buf); // 可能输出: <Buffer 00 00 00 00 00 00 00 00 00 00>（取决于内存状态）

  // 立即填充数据（覆盖潜在的旧内容）
  buf.fill(0); // 填充 0
}

/**
 * Buffer.form: 从现有数据创建
 */
{
  /** 从字符串中创建 */
  const buf1 = Buffer.from('hello'); // 默认 UTF-8
  console.log(buf1); // <Buffer 68 65 6c 6c 6f>
  console.log(buf1.toString('base64')); // aGVsbG8=(编码转换)

  /** 从数组 / 类数组对象创建 */
  const buf2 = Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // ASCII 码
  console.log(buf2.toString()); // "Hello"

  const buf3 = Buffer.from([256, -1, 512]); // 超出范围的处理
  console.log(buf3); // <Buffer 00 ff 00>（256 → 0，-1 → 255，512 → 0）

  /** 从 ArrayBuffer/TypedArray 创建 */
  // 零拷贝（共享内存）
  const arrBuf = new ArrayBuffer(10);
  const view = new Uint8Array(arrBuf);
  view[0] = 72; // 'H'

  const buf4 = Buffer.from(arrBuf);
  console.log(buf4.toString()); // "H"

  view[0] = 74; // 修改原始数据
  console.log(buf4.toString()); // "J"（同步变化）

  /** 从 Buffer 复制 */
  const original = Buffer.from('hello');
  const copy = Buffer.from(original);

  original[0] = 72; // 修改原始 Buffer
  console.log(copy.toString()); // "hello"（未受影响）
}
// #endregion

// #region ------------ 读取 Buffer ------------
/**
 * buf.toString([encoding[, start[, end]]]): 读取为字符串
 */
{
  /** 全量读取 */
  const buf = Buffer.from('hello world', 'utf8');
  console.log(buf.toString('base64')); // "aGVsbG8gd29ybGQ="

  /** 部分读取（切片） */
  const buf2 = Buffer.from('hello world');

  console.log(buf2.toString('utf8', 0, 5)); // "hello"
  console.log(buf2.toString('utf8', 6)); // "world"（从位置 6 到末尾）
}

/**
 * buf.subarray: 切片视图
 */
{
  /** 基本例子 */
  const original = Buffer.from('hello world');
  const view = original.subarray(6, 11); // 从索引 6 到 10
  console.log(view.toString()); // "world"

  /** 负数索引 */
  const last3 = original.subarray(-3); // 从倒数第 3 个到末尾
  console.log(last3.toString()); // "rld"

  /** 修改视图影响原 Buffer */
  const view2 = original.subarray(0, 2);
  view2[0] = 72; // 修改视图的第 0 个字节（'H' 的 ASCII 码）
  console.log(original.toString()); // "Hello world"
}
// #endregion

// #region ------------ 写入 Buffer ------------
/**
 * buf.write(string[, offset[, length]][, encoding]): 写入字符串
 */
{
  const buf = Buffer.alloc(10);
  const bytesWritten = buf.write('hello');

  console.log(bytesWritten); // 5
  console.log(buf.toString()); // "hello"
}

/**
 * buf.fill(value[, offset[, end]][, encoding]): 填充固定值
 */
{
  /** 填充数值 */
  const buf1 = Buffer.alloc(10).fill(0);
  console.log(buf1); // <Buffer 00 00 00 00 00 00 00 00 00 00>

  /** 填充字符串 */
  const buf2 = Buffer.alloc(6).fill('a');
  console.log(buf2.toString()); // "aaaaaa"

  /** 填充多字节字符*/
  const buf = Buffer.alloc(6).fill('你'); // 每个 '你' 占 3 字节
  console.log(buf.toString()); // "你你"
}
// #endregion

// #region ------------ 比较与查找 ------------
/**
 * buf.equals: 比较两个 Buffer 的字节是否相同
 */
{
  /** 相同字节内容但不同对象实例 */
  const bufA = Buffer.from([0x61, 0x62, 0x63]);
  const bufB = Buffer.from([0x61, 0x62, 0x63]);
  console.log(bufA.equals(bufB)); // 输出: true (内容相同)

  /** 相同字符串但不同编码 -- 字节不一样 */
  const utf8Buf = Buffer.from('你好', 'utf8');
  const hexBuf = Buffer.from('你好', 'hex');
  console.log(utf8Buf.equals(hexBuf)); // 输出: false

  /** 与 == 和 === 的区别：这两个运算符比较的是对象引用，而非内容。 */
  const a = Buffer.from('test');
  const b = Buffer.from('test');
  console.log(a === b); // 输出: false (引用不同)
  console.log(a.equals(b)); // 输出: true (内容相同)
}

/**
 * buf.indexOf: 查找值的位置
 */
{
  /** 查找字符串 */
  const buf = Buffer.from('hello world');
  console.log(buf.indexOf('world')); // 输出: 6
  console.log(buf.indexOf('l')); // 输出: 2 (第一个 'l' 的位置)

  /** 查找 Buffer */
  const target = Buffer.from('ll');
  console.log(buf.indexOf(target)); // 输出: 2

  /** 处理多字节字符 */
  const buf2 = Buffer.from('你好，世界');
  console.log(buf2.indexOf('好')); // 输出: 3 (注意：UTF-8 中一个汉字占 3 个字节)
}
// #endregion

// #region ------------ 拼接与复制 ------------
/**
 * Buffer.concat: 合并多个 Buffer
 */
{
  const buf1 = Buffer.from('hello');
  const buf2 = Buffer.from(' ');
  const buf3 = Buffer.from('world');

  const combined = Buffer.concat([buf1, buf2, buf3]);
  console.log(combined.toString()); // 输出: hello world
}

/**
 * buf.copy(target[, targetStart[, sourceStart[, sourceEnd]]]): 复制到另一个 Buffer
 */
{
  const src = Buffer.from('hello');
  const dst = Buffer.alloc(5); // 创建一个长度为 5 的 Buffer

  src.copy(dst);
  console.log(dst.toString()); // 输出: hello
}
// #endregion

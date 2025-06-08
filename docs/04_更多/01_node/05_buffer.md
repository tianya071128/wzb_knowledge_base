# Buffer

在 Node.js 中，`Buffer` 是一个内置类，用于处理**二进制数据**（如文件、网络流、加密数据等）。它类似于整数数组，但直接操作物理内存，无需进行数据类型转换，因此非常高效。

## 核心作用

1. **二进制数据处理**
   - 处理网络协议、文件操作、加密等场景中的二进制数据。
   - 替代传统的字符串处理，避免编码转换带来的性能损耗。
2. **内存高效利用**
   - 直接分配系统内存，无需 JavaScript 引擎进行垃圾回收。
   - 适合处理大数据块（如文件流、网络包）。
3. **跨平台编码转换**
   - 支持多种编码（如 UTF-8、Base64、Hex 等）之间的转换。

## 工作原理

 **1. 内存分配**

- **直接内存**：Buffer 分配的是 Node.js 进程外的原生内存（C++ 管理），不依赖 JavaScript 堆，因此不受 V8 引擎堆大小限制。
- **预分配池**：
  - 小 Buffer（< 8KB）从预分配的 8KB 池中分配，减少系统调用开销。
  - 大 Buffer 直接使用 `malloc()` 分配独立内存。

 **2. 数据存储**

- **字节数组**：每个元素是 0-255 的整数，表示一个字节。
- **固定长度**：创建后长度不可变（除非重新分配）。

 **3. 编码转换**

- 支持多种编码：`utf8`、`base64`、`hex`、`ascii` 等。
- 转换时需注意字节序（如 UTF-16 的 Big Endian/Little Endian）。

## 创建 Buffer

有多种方式创建 Buffer

### Buffer.alloc:分配固定大小

* **方法**: **`Buffer.alloc(size[, fill[, encoding]])`**

* **描述**: 用于创建**已初始化**的 `Buffer` 实例的静态方法。**与 `Buffer.allocUnsafe()` 不同，`alloc` 会确保分配的内存被初始化为零（填充 `0`），避免了潜在的安全风险（如暴露旧内存数据）**。

* **参数**

  | **参数**   | **类型**               | **描述**                                                     |
  | ---------- | ---------------------- | ------------------------------------------------------------ |
  | `size`     | 数字                   | 必须。Buffer 的字节长度（如超过 `Buffer.kMaxLength` 会抛出错误）。 |
  | `fill`     | 数字 / 字符串 / Buffer | 可选。填充值（默认为 `0`）。                                 |
  | `encoding` | 字符串                 | 可选。若 `fill` 是字符串，指定其编码（如 `'utf8'`、`'hex'`）。 |

* **核心作用**

  * **安全分配内存**
    直接分配并清零内存，防止读取到之前其他进程遗留的敏感数据。
  * **高效初始化**
    比手动填充更高效，尤其适合需要全零缓冲区的场景（如加密、网络协议）。
  * **简化开发**
    无需担心内存污染问题，代码更安全。

* **性能考量**

  - **初始化开销**：`alloc` 会执行内存清零操作，比 `allocUnsafe` 略慢（尤其在大尺寸时）。
  - **适用场景**：若需频繁创建大 Buffer 且立即填充数据，建议使用 `allocUnsafe` 并手动填充（如网络数据接收）。
  
* **示例**

  ```js
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
  ```

### Buffer.allocUnsafe: 分配未初始化内存

* **方法**: **`Buffer.allocUnsafe(size)`**

* **描述**: `Buffer.allocUnsafe(size)` 是用于创建**未初始化**的 `Buffer` 实例的静态方法。与 `Buffer.alloc()` 不同，它**不初始化内存**，因此可能包含敏感的旧数据（如前一个进程的内存残留），但**分配速度更快**。

* **参数**
  
  | **参数** | **类型** | **描述**                                                     |
  | -------- | -------- | ------------------------------------------------------------ |
| `size`   | 数字     | 必须。Buffer 的字节长度（如超过 `Buffer.kMaxLength` 会抛出错误）。 |
  
* **核心特点**

  * **高性能**
  直接分配内存，跳过初始化步骤，比 `alloc()` 快约 **30%-50%**（尤其在大尺寸时）。
  * **内存风险**
  返回的 Buffer 可能包含随机数据（前一个进程的内存内容），需立即填充新数据覆盖。
  * **适用场景**
  * 性能敏感的操作（如网络数据包处理、大文件读写）。
    * 立即覆写内容的场景（如流处理、加密算法）。
  
* **示例**

  ```js
  const buf = Buffer.allocUnsafe(10); // 创建长度为 10 的未初始化 Buffer
  console.log(buf); // 可能输出: <Buffer 00 00 00 00 00 00 00 00 00 00>（取决于内存状态）
  
  // 立即填充数据（覆盖潜在的旧内容）
  buf.fill(0); // 填充 0
  ```

### Buffer.from: 从现有数据创建

* 方法:

  * **Buffer.from(string[, encoding])**: 从字符串中创建

  * **Buffer.from(array)**: 使用 `0` – `255` 范围内的 `array` 字节分配新的 `Buffer`。该范围之外的数组条目将被截断以符合它。

  * **Buffer.from(arrayBuffer[, byteOffset[, length]])**: 从 `ArrayBuffer`/`TypedArray` 创建

    * 这将创建 [\<ArrayBuffer\>](https://web.nodejs.cn/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 的视图，而无需复制底层内存。例如，当传入对  [ \<TypedArray\> ](https://web.nodejs.cn/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)  实例的 .buffer 属性的引用时，新创建的 Buffer 将与  [ \<TypedArray\> ](https://web.nodejs.cn/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)  的底层 ArrayBuffer 共享相同的分配内存。
    * **也就是说，会直接共享内存（修改会互相影响）**。

  * **Buffer.from(buffer)**: 创建新 Buffer 并复制原始内容（深拷贝）。

* 示例

  ```js
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
  ```

### 创建方法的比较

待定

## 读取 Buffer

从 `Buffer` 读取数据的方法丰富多样

### buf.toString: 读取字符串
* **方法**: `buf.toString([encoding[, start[, end]]])`

* **参数:**

  | **参数**   | **默认值**   | **描述**                                                     |
  | ---------- | ------------ | ------------------------------------------------------------ |
  | `encoding` | `'utf8'`     | 指定解码方式，支持 `'utf8'`、`'base64'`、`'hex'`、`'ascii'`、`'latin1'` 等。 |
  | `start`    | `0`          | 开始解码的字节偏移量（从 0 开始）。                          |
  | `end`      | `buf.length` | 结束解码的字节偏移量（不包含该位置）。                       |

* **注意事项**
  * **多字节字符截断风险**
     当使用 `start`/`end` 时，需确保边界落在字符边界上（如 UTF-8 中汉字占 3 字节），否则会导致乱码。
  * **编码不匹配后果**
     若实际编码与 `encoding` 参数不符（如用 `'utf8'` 解码 GBK 数据），会产生乱码。
  * **性能考虑**
     频繁调用 `toString()` 会增加 GC 压力，建议批量处理大 Buffer（如通过 `Buffer.concat()` 合并后再转换）。
  
* 示例

  ```js
  /** 全量读取 */
  const buf = Buffer.from('hello world', 'utf8');
  console.log(buf.toString('base64')); // "aGVsbG8gd29ybGQ="
  
  
  /** 部分读取（切片） */
  const buf2 = Buffer.from('hello world');
  console.log(buf2.toString('utf8', 0, 5)); // "hello"
  console.log(buf2.toString('utf8', 6)); // "world"（从位置 6 到末尾）
  ```

###  buf[index]: 按索引访问

* **方法**: buf[index] --> 同数组访问

* **字节 vs 字符**

  - 索引操作的单位是字节，非字符（如 UTF-8 中汉字占 3 个索引位置）。
  - **修改多字节字符需确保完整覆盖所有字节**。
  
* **示例**

  ```js
  const buf = Buffer.from('hello', 'utf8');
  console.log(buf[0]); // 104（对应 'h' 的 ASCII 码）
  console.log(buf[1]); // 101（对应 'e' 的 ASCII 码）
  ```
### buf.subarray: **切片视图**

* **方法**: **buf.subarray([start[, end]])**

  * **描述**: `buf.subarray()` 是一个用于创建 `Buffer` 视图的方法，类似于 `slice()`，但更贴近 JavaScript 的 `TypedArray.subarray()` API。
  * **参数**：
    - `start`：可选，起始索引（默认 0），支持负数（从末尾倒数）。
    - `end`：可选，结束索引（不包含），默认 `buf.length`，支持负数。
  * **返回值**：返回一个新的 `Buffer` 视图，**共享原内存**（零拷贝）。
  
* **注意事项**:

  * **内存共享风险**
    修改视图会直接影响原 Buffer，需确保数据隔离
  * **生命周期管理**
    即使原 Buffer 不再被引用，只要视图存在，内存就不会被 GC 回收
  * **buf.slice** 方法已被标记为弃用, 使用该方法更适当

* **示例**

  ```js
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
  ```

  

## 写入 Buffer

### buf.write: 写入字符串

* **方法**: `buf.write(string[, offset[, length]][, encoding])`

  * **描述**: 向 `Buffer` 写入字符串
  * **参数**：
    - `string`：必选，要写入的字符串。
    - `offset`：可选，起始写入位置（字节），默认 `0`。
    - `length`：可选，最大写入字节数，默认 `buf.length - offset`。
    - `encoding`：可选，字符串编码，默认 `'utf8'`。
  * **返回值**：实际写入的字节数。

* **注意事项**

  * **编码一致性**: 确保 `encoding` 参数与字符串实际编码匹配（如用 `'utf8'` 写入 GBK 字符串会导致乱码）。
  * **内存覆盖风险**: 写入会覆盖原有数据，需确保 `offset` 和 `length` 不会破坏关键数据
  * **性能权衡**: 频繁调用 `write()` 会有开销，大数据量建议使用 `Buffer.concat()` 或 `copy()`。

* **示例**

  ```js
  const buf = Buffer.alloc(10);
  const bytesWritten = buf.write('hello');
  
  console.log(bytesWritten); // 5
  console.log(buf.toString()); // "hello"
  ```

### buf[index]: 按索引写入

* **语法**: buf[index] = value; // 写入单个字节（0-255 的整数）

  * **参数**
    * `index`：字节位置（0 至 `buf.length - 1`）。
    * `value`：要写入的字节值（无符号 8 位整数，范围 0-255）。

* **特性**：

  - **直接修改内存**：无需编码转换，高效但需手动处理字节表示。
  - **溢出自动截断**：超出 0-255 的值会被自动截断（如 `256 → 0`，`-1 → 255`）。

* 示例

  ```js
  const buf = Buffer.alloc(5);
  buf[0] = 72;  // 'H'
  buf[1] = 101; // 'e'
  buf[2] = 108; // 'l'
  buf[3] = 108; // 'l'
  buf[4] = 111; // 'o'
  
  console.log(buf.toString()); // "Hello"
  ```

### buf.fill: 填充固定值

* **语法**: `buf.fill(value[, offset[, end]][, encoding])`

  * **描述**: 用指定的 `value` 填充 `buf`。
  * **参数**:
    - `value`：必选，填充值，可以是：
      - **数值**（0-255 的整数）：按字节填充。
      - **字符串**：按指定编码转换为字节后填充。
    - `offset`：可选，起始位置（默认 0）。
    - `end`：可选，结束位置（不包含，默认 `buf.length`）。
    - `encoding`：可选，当 `value` 为字符串时的编码（默认 `'utf8'`）。
  * **返回值**：返回修改后的 `Buffer` 自身（支持链式调用）。

* **注意事项**

  * **多字节字符填充**: 会按照每个字符的字节重复填充
  * **字符串填充的字节对齐**: 当用多字节字符串填充时，若 Buffer 长度不是字符串字节长度的整数倍，会自动截断
  * **数值溢出处理**: 填充数值会自动截断为 0-255
  * **字符串按字节重复填充**

* **示例**

  ```js
  /** 填充数值 */
  const buf1 = Buffer.alloc(10).fill(0);
  console.log(buf1); // <Buffer 00 00 00 00 00 00 00 00 00 00>
  
  
  /** 填充字符串 */
  const buf2 = Buffer.alloc(6).fill('a');
  console.log(buf2.toString()); // "aaaaaa"
  
  
  /** 填充多字节字符*/
  const buf = Buffer.alloc(6).fill('你'); // 每个 '你' 占 3 字节
  console.log(buf.toString()); // "你你"
  ```

## 比较与查找

### Buffer.isBuffer: 判断是否为 Buffer

* **语法**: `Buffer.isBuffer(obj)`

  * **作用**: 作用是判断传入的对象是否为 `Buffer` 实例。
  * **参数**：`obj`（任意类型），即需要进行判断的对象。
  * **返回值**：若 `obj` 是 `Buffer` 实例，返回 `true`；反之则返回 `false`。

* **注意事项**

  * **仅判断 `Buffer` 实例**：该方法只对真正的 `Buffer` 实例返回 `true`，对于类似 Buffer 的对象（如 TypedArray、DataView），会返回 `false`。
  * **不判断内容是否为二进制**：它只检查对象类型，不会验证对象内容是否为有效的二进制数据。

* **示例**

  ```js
  const buf = Buffer.from('hello');
  const str = 'hello';
  const arr = [1, 2, 3];
  const num = 123;
  
  console.log(Buffer.isBuffer(buf));   // 输出: true
  console.log(Buffer.isBuffer(str));   // 输出: false
  console.log(Buffer.isBuffer(arr));   // 输出: false
  console.log(Buffer.isBuffer(num));   // 输出: false
  ```

### buf.equals: 比较两个 Buffer 的字节是否相同

* **语法**: `buf.equals(otherBuffer)`

  * **作用**: 用于比较两个 `Buffer` 实例是否具有相同字节内容的方法。
  * **参数**：`otherBuffer`（`Buffer`），即需要比较的另一个 `Buffer` 实例。
  * **返回值**：**如果两个 `Buffer` 的长度相同且所有字节都相等**，则返回 `true`；否则返回 `false`。

* **注意事项**:

  * **仅比较 `Buffer` 实例**：如果参数不是 `Buffer`，会抛出类型错误。
  * **性能考虑**：`equals()` 方法的时间复杂度是 O (n)，即需要遍历所有字节。对于大文件比较，可考虑先比较哈希值（如 SHA-256），再决定是否进行完整比较。
  * **与 `==` 和 `===` 的区别**：这两个运算符比较的是对象引用，而非内容。

* **示例**:

  ```js
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
  ```

### buf.indexOf: 查找值的位置

* **语法**: `buf.indexOf(value[, byteOffset][, encoding])`

  * **作用**: 在 `Buffer` 实例中查找指定值的第一个出现位置。它的功能类似于字符串的 `indexOf` 方法，但针对的是二进制数据

  * **参数**: 

    - `value`（必需）：要查找的值，可以是 **字符串**、**Buffer**、**整数**（0-255 的字节值）。
    - `byteOffset`（可选）：开始查找的索引位置，默认值为 `0`。
    - `encoding`（可选）：当 `value` 是字符串时，指定其编码，默认值为 `'utf8'`。

  * **返回值**：返回首次出现的 **字节索引**，若未找到则返回 `-1`。
  
* **示例**
  
```js
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
```

### buf.includes: 检查是否包含某个值

* **语法**: `buf.includes(value[, byteOffset][, encoding])`

  * **作用**: 用于判断 `Buffer` 实例是否包含指定值。相当于 `buf.indexOf(value) !== -1`。
  * **参数**：
    - `value`（必需）：要查找的值，可以是 **字符串**、**Buffer**、**整数**（0-255 的字节值）。
    - `byteOffset`（可选）：开始查找的索引位置，默认值为 `0`。
    - `encoding`（可选）：当 `value` 是字符串时，指定其编码，默认值为 `'utf8'`。
  * **返回值**：如果 `Buffer` 包含 `value`，返回 `true`；否则返回 `false`。

* **与 indexOf 的关系**: `buf.includes()` 本质上是对 `buf.indexOf()` 的封装，以下代码等价：

  ```js
  buf.includes(value)
  // 等价于
  buf.indexOf(value) !== -1
  ```

## 拼接与复制

### Buffer.concat: 合并多个 Buffer

* **语法**: `Buffer.concat(list[, totalLength])`

  * **作用**: 用于合并多个 `Buffer` 实例的静态方法。
  * **参数**：
    - `list`（必需）：要合并的 `Buffer` 数组。
    - `totalLength`（可选）：指定合并后的总长度（字节数）。若提供，则会预先分配对应大小的新 `Buffer`；若省略，则会自动计算所有 `Buffer` 的总长度。
  * **返回值**：返回一个新的 `Buffer`，包含所有输入 `Buffer` 的内容。

* **注意事项**

  * **返回新 Buffer**：`concat` 不会修改原始 `Buffer`，而是返回一个新的 `Buffer`。

  * **总长度参数的影响**：若 `totalLength` 小于实际总长度，合并后的 `Buffer` 会被截断。

  * **性能考虑**：对于极大量的 `Buffer` 合并（如数千个），频繁调用 `concat` 可能导致内存碎片。此时可考虑使用 `Buffer.allocUnsafe()` 手动分配内存并复制数据
  
* **示例**

  ```js
  const buf1 = Buffer.from('hello');
  const buf2 = Buffer.from(' ');
  const buf3 = Buffer.from('world');
  
  const combined = Buffer.concat([buf1, buf2, buf3]);
  console.log(combined.toString()); // 输出: hello world  
  ```

### buf.copy: 复制到另一个 Buffer

* **语法**: `buf.copy(target[, targetStart[, sourceStart[, sourceEnd]]])`
  * **作用**: 将数据从 `buf` 的区域复制到 `target` 的区域，即使 `target` 内存区域与 `buf` 重叠。
  * **参数**：
    - `target`（必需）：目标 `Buffer`，即数据要复制到的 `Buffer`。
    - `targetStart`（可选）：目标 `Buffer` 的开始写入位置，默认值为 `0`。
    - `sourceStart`（可选）：源 `Buffer` 的开始读取位置，默认值为 `0`。
    - `sourceEnd`（可选）：源 `Buffer` 的结束读取位置（不包含该位置），默认值为 `buf.length`。
  * **返回值**：返回实际复制的字节数。
* **注意事项**
  * **目标 `Buffer` 必须足够大**：若目标 Buffer 的剩余空间不足，复制会自动截断。
  * **索引边界检查**：`sourceStart` 和 `sourceEnd` 必须在源 Buffer 的有效范围内，否则会抛出错误。
  * **与 `Buffer.concat()` 的区别**：
    - `copy()` 是在现有 `Buffer` 之间复制数据；
    - `concat()` 是创建一个新 `Buffer` 并合并多个 `Buffer` 的内容。

* 示例

  ```js
  const src = Buffer.from('hello');
  const dst = Buffer.alloc(5); // 创建一个长度为 5 的 Buffer
  
  src.copy(dst);
  console.log(dst.toString()); // 输出: hello
  ```

  









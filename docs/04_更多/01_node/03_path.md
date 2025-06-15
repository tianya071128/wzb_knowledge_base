# Path 路径

`node:path` 模块提供了用于处理文件和目录的路径的实用工具。

## Windows 与 POSIX

模块的默认操作因运行 Node.js 应用的操作系统而异。具体来说，当在 Windows 操作系统上运行时，`node:path` 模块将假定正在使用 Windows 风格的路径。

因此，在 POSIX 和 Windows 上使用 `path.basename()` 可能会产生不同的结果

* 当使用 Windows 文件路径时，若要在任何操作系统上获得一致的结果，则使用 [`path.win32`](https://nodejs.cn/api/v22/path.html#pathwin32)
* 当使用 POSIX 文件路径时，若要在任何操作系统上获得一致的结果，则使用 [`path.posix`](https://nodejs.cn/api/v22/path.html#pathposix)
* **但一般情况下, 使用 path 自动适配平台**

## 路径组合与拼接

用于将多个路径片段合并为一个完整路径

### path.resolve: 将路径片段解析为绝对路径

* **方法**: `path.resolve([...paths])`

  * **作用**: 将路径或路径片段的序列解析为绝对路径
  * **参数**：
    - `...paths`（可选）：一系列路径或路径片段，按从右到左的顺序解析。
  * **返回值**：返回一个经过规范化处理的绝对路径字符串。

* **特性**

  * **从右到左解析路径片段**: `path.resolve()` 从右到左处理参数，直到构造出一个绝对路径。如果没有提供参数，则返回当前工作目录（`process.cwd()`）。

  * **遇到绝对路径则停止解析**: 如果参数中包含绝对路径，则从该路径开始向右继续解析，忽略左侧的所有路径。

    ```js
    // 遇到绝对路径 /tmp 后，忽略左侧的 'a'
    console.log(path.resolve('a', '/tmp', 'b', 'c'));  // 输出: /tmp/b/c
    ```

  * **规范化处理路径**: 解析后的路径会自动处理 `.`、`..` 和多余的斜杠。

  * **相对路径处理**:若所有参数都是相对路径，则最终路径相对于当前工作目录（`process.cwd()`）

    ```js
    // 假设当前工作目录是 /home/user
    console.log(path.resolve('src', 'utils')); // 输出: /home/user/src/utils
    ```

  * 如果没有传入 `path` 片段，则 `path.resolve()` 将返回当前工作目录的绝对路径
  * **`path.resolve()` 生成绝对路径，依赖当前工作目录(`process.cwd()`)**。可结合 __dirname（当前模块所在目录） 使用，确保路径稳定性。

### path.join: 拼接路径片段

* **方法**: `path.join([...paths])`

  * **作用**: 用于拼接路径片段的核心方法。它会根据当前操作系统的规则自动处理路径分隔符，确保生成的路径在不同平台上都能正确工作
  * **参数**：
    - `...paths`（必需）：一个或多个路径片段，按顺序拼接。
  * **返回值**：返回一个经过规范化处理的路径字符串。

* **特性**

  * **规范化路径**: 自动处理 `.`、`..` 和多余的斜杠

    ```js
    console.log(path.join('a', 'b', '../c', './d')); // 输出: a/c/d
    console.log(path.join('a', '//b', '/c')); // 输出: a/b/c
    ```

  * **不生成绝对路径**: `path.join()` 不会自动将路径转换为绝对路径，即使包含绝对路径片段

    ```js
    // Unix 示例
    console.log(path.join('/a', 'b')); // 输出: /a/b（看似绝对路径，但由第一个片段决定）
    console.log(path.join('a', '/b', 'c')); // 输出: a/b/c（错误示例！）
    
    // Windows 示例
    console.log(path.join('C:\\a', 'b')); // 输出: C:\a\b
    ```

  * **与 `path.resolve()` 的区别**

    - `path.join()`：仅拼接和规范化路径，不考虑当前工作目录。
    - `path.resolve()`：生成绝对路径。

### path.relative: 计算从一个路径到另一个路径的相对路径

* **方法**: `path.relative(from, to)`

  * **作用**: 根据当前工作目录返回从 `from` 到 `to` 的相对路径。如果 `from` 和 `to` 都解析为相同的路径（在分别调用 `path.resolve()` 之后），则返回零长度字符串。
  * **参数**：
    - `from`（必需）：起始路径（字符串）。
    - `to`（必需）：目标路径（字符串）。
  * **返回值**：
    - 返回从 `from` 到 `to` 的相对路径字符串。若无法计算，则返回 `to`。

* **特性**:

  * **计算相对路径**: 通过分析两个路径的公共部分，生成从 `from` 到 `to` 的相对路径

    ```js
    const path = require('path');
    
    // 示例：从 /a/b 到 /a/c/d
    console.log(path.relative('/a/b', '/a/c/d')); // 输出: ../c/d
    ```

  * **处理绝对路径与相对路径**

    - 若 `from` 或 `to` 是相对路径，则相对于当前工作目录（`process.cwd()`）解析。
    - 推荐使用绝对路径以确保结果稳定。

    ```js
    // 绝对路径示例
    console.log(path.relative('/user/project/src', '/user/project/build')); // 输出: ../build
    
    // 相对路径示例（假设当前目录是 /user/project）
    console.log(path.relative('src', 'build')); // 输出: ../build
    ```

## 路径解析与规范化

用于将路径字符串转换为标准格式或解析为组成部分。

### path.normalize: 规范化路径

* **方法**: `path.normalize(path)`

  * **作用**:规范化路径字符串，处理路径中的冗余部分（如 `.`、`..` 和多余的斜杠），确保路径格式符合当前操作系统的规则
  * **参数**：
    - `path`（必需）：字符串类型的路径。
  * **返回值**：返回规范化后的路径字符串，遵循当前操作系统的路径规则。

* **特性**: 

  * **处理相对路径符号**

    - `.`（当前目录）会被移除。
    - `..`（上级目录）会根据路径层级进行解析。

    ```js
    // 移除 .
    console.log(path.normalize('/a/b/./c')); // 输出: /a/b/c
    
    // 解析 ..
    console.log(path.normalize('/a/b/../c')); // 输出: /a/c
    console.log(path.normalize('/a/../../c')); // 输出: /c（注意：超出根目录仍保留根目录）
    ```

  * **合并多余的斜杠**: 连续的多个斜杠会被合并为一个

    ```js
    console.log(path.normalize('/a//b/c')); // 输出: /a/b/c
    console.log(path.normalize('a///b/c')); // 输出: a/b/c
    ```

  * **处理路径末尾的斜杠**: 保留路径末尾的斜杠，但会规范化中间的斜杠。

    ```js
    console.log(path.normalize('/a/b/c/')); // 输出: /a/b/c/
    console.log(path.normalize('/a/b/c//')); // 输出: /a/b/c/
    ```

  * **根路径保护**: 尝试超出根目录的操作会被限制为根目录

### path.parse: 将路径字符串解析为其组成部分

* **方法**: `path.parse(path)`

  * **作用**: 将路径字符串解析为其组成部分，从完整路径中分离出根目录、目录名、文件名、扩展名等信息
  * **参数**：
    - `path`（必需）：字符串类型的路径。
  * **返回值**：返回一个对象，包含以下属性：
    - `root`：路径的根目录（如 `/` 或 `C:\`）。
    - `dir`：路径的目录部分（不含根目录）。
    - `base`：路径的最后一部分（文件名或目录名）。
    - `ext`：文件扩展名（包括点号 `.`）。
    - `name`：文件名（不含扩展名）。

* **特性**:

  * **解析路径各部分**: 将完整路径拆分为根目录、目录、文件名、扩展名等组件

    ```js
    // Windows 风格路径
    const winParsed = path.parse('C:\\a\\b\\c.txt');
    console.log(winParsed);
    /* 输出:
    {
      root: 'C:\\',
      dir: 'C:\\a\\b',
      base: 'c.txt',
      ext: '.txt',
      name: 'c'
    }
    */
    ```

  * **复杂扩展名处理**: 对于包含多个点的文件名，`ext` 仅包含最后一个点及其后的部分

  * **隐藏文件处理**: 以点开头的隐藏文件（如 `.gitignore`）被视为无扩展名

    ```js
    path.parse('.gitignore');
    /* 输出:
    {
      root: '',
      dir: '',
      base: '.gitignore',
      ext: '',
      name: '.gitignore'
    }
    */
    ```

### path.format: 从路径对象反序列化为路径字符串

* **方法**: `path.format(pathObject)`
  * **作用**: 与 `path.parse()` 互为逆操作，能根据路径对象的属性（如 `root`、`dir`、`base` 等）构建符合当前操作系统规则的路径字符串
  * **参数**：
    - `pathObject`（必需）：包含路径组件的对象
  * **返回值**：返回根据 `pathObject` 构建的路径字符串，遵循当前操作系统的路径规则。
* **特性**:
  * **从对象构建路径**
    根据 `pathObject` 的属性组合成路径字符串，优先级规则如下：
    - 若同时存在 `dir` 和 `root`，`dir` 会覆盖 `root` 的部分（但保留根目录）。
    - 若存在 `base`，则忽略 `name` 和 `ext`。
    - 若不存在 `base`，则使用 `name` 和 `ext` 组合成 `base`。

## 路径信息提取

用于获取路径的特定部分（目录、文件名、扩展名等）

### path.dirname: 提取路径中目录部分

* **方法**: `path.dirname(path)`

  * **作用**: 用于提取路径中目录部分。从完整路径中分离出文件所在的目录路径
  * **参数**：
    - `path`（必需）：字符串类型的路径。
  * **返回值**：返回 `path` 的目录部分（即从路径中移除最后一个路径片段后的结果）。

* **特性**:

  * **提取目录路径**: 从完整路径中分离出文件或子目录所在的上级目录

  * **处理相对路径**: 对相对路径同样有效，返回相对目录

    ```js
    console.log(path.dirname('src/utils.js')); // 输出: src
    console.log(path.dirname('a/b/c')); // 输出: a/b
    ```

  * **特殊路径处理**

    - 若路径中没有斜杠（即只有文件名），返回 `.`（表示当前目录）。
    - 若路径是根目录（如 `/` 或 `C:\`），返回根目录本身。

    ```js
    console.log(path.dirname('file.txt')); // 输出: .
    console.log(path.dirname('/')); // 输出: /
    console.log(path.dirname('C:\\')); // 输出: C:\
    ```

### path.basename: 提取路径中最后一部分

* **方法**: `path.basename(path[, ext])`

  * **作用**: 用于提取路径中最后一部分。从完整路径中分离出文件名或目录名
  * **参数**：
    - `path`（必需）：字符串类型的路径。
    - `ext`（可选）：字符串类型的扩展名，用于从结果中排除特定扩展名。
  * **返回值**：返回 `path` 的最后一部分（文件名或目录名），可选择性排除扩展名。

* **特性**:

  * **提取文件名或目录名**: 从完整路径中分离出最后一个路径片段

    ```js
    const path = require('path');
    
    console.log(path.basename('/a/b/c.txt')); // 输出: c.txt
    console.log(path.basename('/a/b/')); // 输出: b（注意末尾斜杠的处理）
    ```

  * **扩展名匹配规则**

    - 会直接从路径末尾去除掉 `ext`

    ```js
    console.log(path.basename('file.txt', '.txt')); // 输出: file
    console.log(path.basename('file.txt', 'txt')); // 输出: file.
    ```

### path.extname: 提取文件的扩展名

* **方法**: `path.extname(path)` 

  * **作用**: 用于提取路径中文件扩展名。从完整路径中分离出文件的后缀部分
  * **参数**：
    - `path`（必需）：字符串类型的路径。
  * **返回值**：返回 `path` 的扩展名（包括点号 `.`），若无扩展名则返回空字符串。

* **特性**: 

  * **仅提取最后一个扩展名**：无论文件名包含多少个点号，只返回最后一个点之后的部分

    ```js
    console.log(path.extname('archive.tar.gz')); // 输出: .gz
    console.log(path.extname('app.min.js')); // 输出: .js
    ```

  * **处理特殊情况**

    - 若路径中无点号或点号在路径开头，则返回空字符串。
    - 若路径以点号结尾，则返回 `.`。

    ```js
    console.log(path.extname('filename')); // 输出: ''
    console.log(path.extname('.gitignore')); // 输出: ''
    console.log(path.extname('file.')); // 输出: .
    console.log(path.extname('.')); // 输出: ''
    console.log(path.extname('..')); // 输出: ''
    ```

## 路径特性判断

用于检测路径的特定属性

### path.isAbsolute: 判断路径是否为绝对路径

* **语法**: `path.isAbsolute(path)`

  * **作用**: 区分路径是从文件系统根目录开始（绝对路径）还是相对于当前工作目录（相对路径）
  * **参数**：
    - `path`（必需）：字符串类型的路径。
  * **返回值**：返回一个布尔值，表示 `path` 是否为绝对路径。

* **特性**:

  * **判断绝对路径**: 根据当前操作系统的规则，判断路径是否以根目录标识开头

    - **Unix**：路径以斜杠 `/` 开头即为绝对路径。
    - **Windows**：路径以盘符（如 `C:\`）或反斜杠 `\` 开头即为绝对路径。

    ```js
    const path = require('path');
    
    // Unix 风格路径
    console.log(path.isAbsolute('/a/b/c')); // 输出: true
    console.log(path.isAbsolute('a/b/c')); // 输出: false
    
    // Windows 风格路径
    console.log(path.isAbsolute('C:\\a\\b\\c')); // 输出: true
    console.log(path.isAbsolute('\\a\\b\\c')); // 输出: true（相对根目录）
    console.log(path.isAbsolute('a\\b\\c')); // 输出: false
    ```

  * **处理相对路径**: 任何不以根目录标识开头的路径都被视为相对路径

    ```js
    console.log(path.isAbsolute('.')); // 输出: false
    console.log(path.isAbsolute('..')); // 输出: false
    console.log(path.isAbsolute('src/file.js')); // 输出: false
    ```

    

## 平台相关方法

### path.sep: 获取当前操作系统路径分隔符的静态属性

* **属性**: `path.sep`

  * **作用**: 获取当前操作系统路径分隔符的静态属性。它不是一个方法，而是一个字符串常量，用于表示文件路径中各部分之间的分隔符。
  * **类型**：字符串。
  * **值**：
    - **Windows**：反斜杠 `\`。
    - **Unix/Linux/macOS**：斜杠 `/`。

* **特性**

  * **静态属性而非方法**: `path.sep` 是一个属性，不是可调用的方法，直接访问即可

  * **与 `path.delimiter` 的区别**

    - `path.sep`：路径各部分之间的分隔符（如 `a/b` 中的 `/`）。
    - `path.delimiter`：环境变量（如 `PATH`）中多个路径之间的分隔符（Windows 为 `;`，Unix 为 `:`）。

  * 在解析路径字符串时，使用 `path.sep` 分割路径各部分

    ```js
    const fullPath = '/a/b/c.txt';
    const parts = fullPath.split(path.sep);
    // 在 Unix 上输出: ['', 'a', 'b', 'c.txt']
    // 在 Windows 上需注意转义问题，建议使用 path.parse()
    ```

### path.delimiter: 获取当前操作系统环境变量路径分隔符的静态属性

* **属性**: `path.delimiter`

  * **作用**: 表示环境变量（如 `PATH`）中多个路径之间的分隔符。
  * **类型**：字符串。
  * **值**：
    - **Windows**：分号 `;`。
    - **Unix/Linux/macOS**：冒号 `:`。

* **特性**

  * **解析环境变量中的多路径**: 在处理 `PATH`、`NODE_PATH` 等环境变量时，使用 `path.delimiter` 分割多个路径

    ```js
    // 获取系统 PATH 环境变量并分割
    const pathEnv = process.env.PATH ?? '';
    const pathDirs = pathEnv.split(path.delimiter);
    
    console.log(pathDirs);
    // 输出: ['D:\\学习\\node_modules\\.bin', 'D:\\node_modules\\.bin', ...]
    // 根据不同操作系统的输出可能不同
    ```

### path.posix: POSIX 风格路径处理方法的对象

* **语法**: `path.posix`
  * **作用**: 在任何操作系统上使用 Unix 风格的路径规则（如使用斜杠 `/` 作为路径分隔符），这在需要跨平台统一路径格式的场景中非常有用
  * **类型**：对象。
  * **功能**：提供与 `path` 模块相同的方法（如 `join`、`resolve`、`dirname` 等），但始终遵循 POSIX 路径规则。
* **特性**
  * **强制使用 POSIX 路径规则**: 无论 Node.js 运行在何种操作系统上，`path.posix` 的方法都使用 Unix 风格的路径处理规则
  * **与 `path.win32` 的对比**
    - `path.posix`：强制使用 Unix 风格路径规则。
    - `path.win32`：强制使用 Windows 风格路径规则。
    - `path`：根据当前操作系统选择规则
  * **路径分隔符固定为斜杠 `/`**

### path.win32: Windows 风格路径处理方法的对象

* **语法**: `path.win32`
  * **作用**: 在任何操作系统上使用 Windows 风格的路径规则（如使用反斜杠 `\` 作为路径分隔符，支持驱动器号），这在需要跨平台统一路径格式或特定 Windows 路径处理的场景中非常有用
  * **类型**：对象。
  * **功能**：提供与 `path` 模块相同的方法（如 `join`、`resolve`、`dirname` 等），但始终遵循 Windows 路径规则。

## 其他实用方法

### path.toNamespacedPath: 将路径转换为 Windows 命名空间路径

* **方法**: `path.toNamespacedPath(path)`
  * **作用**: 将路径转换为 Windows 命名空间路径（namespace path）的特殊方法。该方法主要用于处理长路径（超过 260 个字符）或 UNC（通用命名约定）路径，在 Windows 系统上提供更灵活的路径处理能力
  * **参数**：
    - `path`（必需）：字符串类型的路径。
  * **返回值**：返回转换后的 Windows 命名空间路径字符串。在非 Windows 系统上，直接返回原路径。
* **特性**
  * 待续...
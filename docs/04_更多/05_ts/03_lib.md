# lib

在安装 TypeScript 时，`lib` 文件夹是其核心组成部分，主要用于提供 **JavaScript 运行时和 DOM API 的类型定义**。这些类型定义文件（`.d.ts`）让 TypeScript 能够理解和校验 JavaScript 内置对象、全局变量及浏览器 API 的使用。

## 核心作用

1. **提供内置类型定义**
   包含 `Array`、`Promise`、`Map`、`Date` 等 JavaScript 内置对象的类型声明，使 TypeScript 能够对其进行类型检查。
2. **支持不同 ECMAScript 版本**
   通过 `lib.es5.d.ts`、`lib.es2015.d.ts` 等文件，提供不同 ES 版本的 API 类型（如 ES6 的箭头函数、ES2020 的 `Promise.allSettled`）。
3. **DOM 和浏览器 API 类型**
   `lib.dom.d.ts` 定义了 `window`、`document`、`HTMLElement` 等浏览器环境的全局对象和 API。
4. **自定义编译环境**
   通过 `tsconfig.json` 中的 `lib` 选项，可按需加载不同的类型库，优化编译环境。

## 配置方式

1. **默认配置**：若未指定 `lib`，TypeScript 会根据 `target` 选项自动加载默认库（如 `ES5 + DOM`）。

2. **通过 `tsconfig.json` 的 `lib` 配置**：

   ```json
   {
     "compilerOptions": {
       "lib": ["ES2020", "DOM"] // 按需加载类型库
     }
   }
   ```

3. **使用三斜杠指令**

   ```typescript
   /// <reference lib="esnext.array" />
   const arr = [1, 2, 3];
   arr.toSpliced(1, 1); // 使用 ES2023 的 Array 方法
   ```

## 注意

1. **类型与运行时的区别**：`lib` 文件夹仅提供类型定义，不包含实际的 JavaScript 实现。例如，使用 `Promise` 类型时，运行环境（如浏览器或 Node.js）必须支持该 API。
2. **避免过度加载**：加载过多类型库（如同时包含 ES5 和 ES2020）可能导致类型冲突，建议根据项目需求精确配置。
3. **与 `@types` 的关系**
   - `lib` 提供 JavaScript 内置 API 的类型。
   - `@types` 包（如 `@types/node`）提供第三方库（如 Node.js、React）的类型。

## compilerOptions.lib 配置: 精确控制项目编译时所使用的类型定义库

`compilerOptions.lib` 其作用是**精确控制项目编译时所使用的类型定义库**，也就是决定 TypeScript 编译器能够识别哪些 JavaScript 内置 API 和 DOM API。

### 核心作用

1. **指定内置类型定义的范围**
2. **支持不同的 ECMAScript 版本**
3. **适配不同的运行环境**

### 配置

* **默认配置**：要是没有指定 `lib` 选项，TypeScript 会依据 `target` 选项自动加载默认的类型库。比如，当 `target` 为 `ES5` 时，会默认加载 `ES5` 和 `DOM` 的类型定义。
* **自定义组合**：可以混合搭配不同版本的类型库。例如 `["ESNext", "DOM.Iterable"]`，这样就能支持最新的 JavaScript 特性和迭代器相关的 DOM API。
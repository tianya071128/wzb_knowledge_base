# @types

在 TypeScript 中，`@types` 是一个非常重要的概念，它指的是由 DefinitelyTyped 社区维护的**类型定义文件仓库**，其主要作用是为那些没有自带 TypeScript 类型定义的 JavaScript 库（如 `lodash`、`express`、`react` 等）提供类型定义，从而让 TypeScript 能够对这些 JavaScript 库的使用进行类型检查和代码提示。

## 核心作用

1. **提供第三方库的类型定义**：许多 JavaScript 库（如 `moment.js`、`jquery`）本身是纯 JavaScript 编写的，没有自带类型定义。`@types` 为这些库提供了类型声明文件（`.d.ts`），使 TypeScript 项目可以无缝使用它们。
2. **增强开发体验**
   - 编辑器（如 VS Code）可提供智能提示、自动补全和类型错误检查。
   - 减少运行时错误，提前发现类型不匹配问题。

## 全局 `@types`

默认情况下，`TypeScript` 会自动包含支持全局使用(**全局声明文件，没有导入导出语句**)的任何声明定义。

可通过 `compilerOptions.types` 手动告诉 `TypeScript` 加载的类型文件

##  模块 `@types`

安装完之后，不需要特别的配置，当你加载对应的模块时，会在 `@types` 中查找对应的类型文件

```typescript
import * as $ from 'jquery'; // 此时 ts 就知道 $ 的类型定义
```

## compilerOptions.types 配置: 精确控制类型声明的加载范围

`compilerOptions.types` 用于**精确控制全局类型声明的加载范围**。它的主要作用是限制 TypeScript 编译器自动包含的类型包（`@types`），从而优化编译性能并避免类型冲突。

### 语法

**注意: **一般资料上都说 **只能指定包名，不能指定具体文件路径**，但实测可以指定文件路径，也是奇了怪

```json
{
  "compilerOptions": {
    // 会自动在 typeRoots 配置的文件夹, 默认为 node_modules/@types
    "types": ["node", "jest", "express"],
      
     // 也可以指定文件路径, 实测是有效的, 不知道是为什么, 难道是版本(测试版本为 5.8.3)更新问题?
     "types": ["./test"] // test.d.ts 文件
  }
}
```



### 核心作用

1. **缩小类型扫描范围**

   **默认情况下，TypeScript 会自动包含 `node_modules/@types` 目录下的所有类型声明**。使用 `types` 选项后，编译器仅会加载你明确指定的类型包，减少不必要的类型扫描。

2. **避免类型冲突**

   当项目中存在多个版本的同一类型包或不兼容的类型声明时，通过 `types` 可以精确控制加载哪些类型，避免冲突。

3. **优化编译速度**

   减少需要处理的类型文件数量，从而提升编译性能，尤其在大型项目中效果显著。

### 注意

1. **仅影响全局类型**
   `types` 选项只对**全局类型包**有效（即没有 `export` 的类型声明文件）。如果类型是通过模块导入的（如 `import { Type } from 'lib'`），则不受此选项影响。
2. **与 `typeRoots` 的配合**
   如果同时设置了 `typeRoots` 和 `types`：
   - TypeScript 会先从 `typeRoots` 指定的路径中查找类型包。
   - 然后只加载 `types` 中列出的包。
3. **默认行为**
   若未设置 `types` 选项，TypeScript 会自动包含 `node_modules/@types` 下的所有类型包。
4. 在 TypeScript 中，**模块（Module）** 和 **全局类型（Global Types）** 的区分取决于文件是否包含 **顶级 `import` 或 `export` 语句**，而非 `compilerOptions.types` 的配置方式。
# Vite HMR (Hot Module Replacement) 深度解析

## 什么是 HMR?

HMR(Hot Module Replacement)是一种在应用程序运行时,无需刷新页面就能替换、添加或删除模块的技术。它能够:

- **保持应用状态**: 避免页面刷新导致的状态丢失
- **提升开发效率**: 只更新变更的模块,响应更快
- **提供即时反馈**: 代码修改后立即在浏览器中看到效果

## 一、服务端启动与文件监听

### 1.1 服务器创建流程

在 [cli.ts](https://github.com/tianya071128/wzb_knowledge_base/blob/master/%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/vite%405.2.11/packages/vite/src/node/cli.ts) 文件中,调用 dev 命令启动器,最终会调用 [server/index.ts](https://github.com/tianya071128/wzb_knowledge_base/blob/master/%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/vite%405.2.11/packages/vite/src/node/server/index.ts) 文件中的 `_createServer` 方法创建服务器。

### 1.2 文件监听机制

Vite 使用 `chokidar` 库来监听文件系统变化:

- **监听范围**: 项目根目录下的所有文件
- **忽略规则**: `node_modules`、`.git` 等目录
- **事件类型**: `change`(文件修改)、`add`(文件添加)、`unlink`(文件删除)

**关键配置:**

```typescript
const watcher = chokidar.watch(path.resolve(root), {
  ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**'],
  ignoreInitial: true, // 忽略初始扫描
  ignorePermissionErrors: true,
  disableGlobbing: true,
});
```

## 二、HMR 传播与边界查找

### 2.1 模块失效机制

当文件发生变化时,Vite 会通过 `moduleGraph.invalidateModule` 方法将变化的文件及其递归导入这个文件的所有文件都置为失效状态。

### 2.2 模块依赖图(ModuleGraph)

Vite 维护了一个模块依赖图,记录了模块之间的导入关系:

```typescript
class ModuleGraph {
  // URL -> ModuleNode 映射
  urlToModuleMap = new Map<string, ModuleNode>()

  // 文件路径 -> ModuleNode 映射
  fileToModulesMap = new Map<string, Set<ModuleNode>>()

  // 模块信息
  class ModuleNode {
    url: string              // 模块 URL
    file: string | null      // 文件路径
    type: 'js' | 'css'       // 模块类型
    importers: Set<ModuleNode>  // 导入者
    importedModules: Set<ModuleNode>  // 被导入的模块
    acceptedHmrDeps: Set<ModuleNode>  // 接受更新的依赖
    isSelfAccepting: boolean  // 是否自接受
  }
}
```

### 2.3 HMR 边界查找算法

HMR 边界是指通过 `import.meta.hot.accept()` 声明接受更新的模块。查找边界的算法如下:

**算法步骤:**

1. **从变更模块开始**: 从失效的模块开始向上遍历依赖树
2. **查找 accept 调用**: 检查模块是否调用了 `import.meta.hot.accept()`
3. **确定边界类型**:
   - **自接受(Self-Accepting)**: 模块接受自己的更新
   - **依赖接受(Dependency Acceptance)**: 模块接受特定依赖的更新
4. **传播更新**: 如果找到边界,停止传播;否则继续向上查找

### 2.4 静态分析 import.meta.hot

Vite 在服务端解析模块时,会通过静态分析模块的 `import.meta.hot` 方法调用来确定模块是否接受依赖项的更新。

## 三、客户端 HMR 更新处理

### 3.1 WebSocket 消息处理

客户端通过注入的 [client.ts](https://github.com/tianya071128/wzb_knowledge_base/blob/master/%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/vite%405.2.11/packages/vite/src/client/client.ts) 文件处理服务端的 HMR 消息。

### 3.2 模块更新机制

客户端通过 `importUpdatedModule` 方法,调用原生 `import()` 加上时间戳,请求边界模块

### 3.3 更新传播示例

```plaintext
假设依赖链:
A -> B -> C -> D

场景: 修改模块 D, 模块 B 接受更新

执行流程:
1. 服务端检测到 D 文件变化
2. 将 A, B, C, D 模块标记为失效
3. 查找 HMR 边界,找到 B 模块(因为 B 调用了 import.meta.hot.accept('./C'))
4. 发送更新消息: { type: 'update', updates: [{ path: '/B.js', acceptedPath: '/D.js' }] }
5. 客户端收到消息,请求 B 模块(带时间戳)
6. B 模块重新导入 C 模块(带时间戳)
7. C 模块重新导入 D 模块(带时间戳)
8. 执行 B 模块的 accept 回调,更新 UI
```

## 四、特殊场景处理

### 4.1 CSS HMR

CSS 文件的 HMR 处理方式与 JS 不同:

1. 查找旧的 link 标签

2. 创建新的 link 标签

3. 等待新样式加载完成后移除旧的

### 5.2 循环依赖

循环依赖场景下的 HMR 处理:

```plaintext
循环依赖:
A -> B -> C -> A

修改 C 文件:
1. 标记 A, B, C 为失效
2. 查找边界时,检测到循环
3. 如果有模块自接受,使用该模块作为边界
4. 否则触发页面重载
```

### 5.3 模块失效(invalidate)

当模块需要强制重新加载时:

```typescript
// app.ts
import { config } from './config';

if (import.meta.hot) {
  import.meta.hot.accept('./config', (newConfig) => {
    // 配置变化太大,需要重新加载整个应用
    import.meta.hot.invalidate();
  });
}
```

## 六、总结

Vite 的 HMR 机制通过以下核心流程实现:

1. **文件监听**: 使用 chokidar 监听文件变化
2. **模块失效**: 通过 ModuleGraph 标记受影响的模块
3. **边界查找**: 静态分析 `import.meta.hot` 调用,确定 HMR 边界
4. **消息推送**: 通过 WebSocket 发送更新消息给客户端
5. **模块更新**: 客户端动态导入更新的模块,执行回调

通过理解 HMR 的工作原理,我们可以更好地利用它来提升开发效率,同时避免常见的问题。

## 参考资料

- [Vite HMR 官方文档](https://vitejs.dev/guide/api-hmr.html)
- [HMR Propagation 详解](https://bjornlu.com/blog/hot-module-replacement-is-easy#hmr-propagation)

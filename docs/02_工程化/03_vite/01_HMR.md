# HMR

## 前置条件

1. 在 [cli.ts](https://github.com/tianya071128/wzb_knowledge_base/blob/master/%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/vite%405.2.11/packages/vite/src/node/cli.ts) 文件中, 调用 dev 命令启动器, 最终会调用 [server/index.ts](https://github.com/tianya071128/wzb_knowledge_base/blob/master/%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/vite%405.2.11/packages/vite/src/node/server/index.ts) 文件中的 `_createServer` 方法创建服务器

2. 在 `_createServer` 方法中使用 `chokidar` 监听项目文件的变化, 最终调用 [/server/hmr.ts](https://github.com/tianya071128/wzb_knowledge_base/blob/master/%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/vite%405.2.11/packages/vite/src/node/server/index.ts) 的 `handleHMRUpdate` 方法响应

## HMR传播查找HMR边界模块

[详见](https://bjornlu.com/blog/hot-module-replacement-is-easy#hmr-propagation)

1. **将受影响的模块失效**: 会通过 `moduleGraph.invalidateModule` 方法将变化的文件及其递归将导入这个文件的所有文件都置为失效状态, 从而触发重新请求, 并且服务端会重新处理该模块

2. 查找边界模块是在服务端处理的，服务端在解析模块时，**会通过静态分析模块的 `import.meta.hot` 方法调用来确定模块是否接受依赖项的更新**。从而确定是否为 HMR 边界

3. 将 HMR 边界模块通过 `ws` 的 `hot.send({type: 'update', 变更的模块信息})`发送给客户端

::: tip
如果没有找到边界模块的话, 那么就会发送消息给客户端, 让客户端重新加载页面
:::

## 客户端处理HMR更新

1. **接收服务端的响应**: 客户端会通过注入的 [client.ts](https://github.com/tianya071128/wzb_knowledge_base/blob/master/%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/vite%405.2.11/packages/vite/src/client/client.ts) 文件中的 `handleMessage` 方法处理

2. **重新请求边界模块**客户端会通过 `importUpdatedModule` 方法, 调用原生 `import()` 加上时间戳, 请求一下边界模块, 这样的话, 其他的模块因为也已经失效了, 所以会重新请求一次

```plaintext
假设:

A -> B -> C -> D

其中修改模块 D, 模块 B 接受更新

那么就会将 A,B,C,D 模块失效, 并且将 B 作为边界模块发送给客户端

客户端加上时间戳请求 B 模块, 进而会触发请求 C 和 D 模块 --> 因为 C 和 D 模块已经失效, 在模块 B 请求后, 会加上时间戳请求 C 和 D 模块
```

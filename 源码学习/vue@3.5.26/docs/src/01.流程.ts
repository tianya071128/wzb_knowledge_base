// []
//   -> []
//   -> [生成的 createApp 方法在 runtime-core/src/apiCreateApp.ts 文件中]
//   -> [调用上一步生成的 createApp 方法, 生成一个应用实例, 具体参考 20.应用实例.ts]

/**
 * 1. const app = createApp(App) --> 调用 createApp(App) 创建应用实例
 *     - 参考: 04.应用实例(createApp)
 * 2. app.mount('#app') --> 将应用实例挂载在一个容器元素中
 *     - 会调用应用实例的 mount 方法, 首先调用 runtime-dom/src/index.ts 的 createApp 方法中重写的 mount 方法, 做一些额外的处理
 *     - 最终还是调用 runtime-core/src/apiCreateApp.ts 的 createAppAPI 的应用实例的 mount 方法
 *     - 参考: 04.应用实例(createApp)的 mount 方法
 */

/**
 * 为本地 monorepo 中未提供类型声明的 babel 插件包补充环境声明。
 * 这些包发布时不含 .d.ts，此处仅用于消除 TypeScript 的隐式 any 报错。
 */
declare module "@babel/plugin-transform-arrow-functions" {
  import type { PluginItem } from "@babel/core";
  const plugin: PluginItem;
  export default plugin;
}

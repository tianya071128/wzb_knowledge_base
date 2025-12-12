// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/scss/index.scss'],
  modules: ['@pinia/nuxt', '@element-plus/nuxt', '@vueuse/nuxt'],
  // 运行时配置允许将动态配置和环境变量传递给 Nuxt 应用上下文。
  runtimeConfig: {
    // 默认情况下，Nuxt 运行时配置是私有的，因此它们不能被客户端访问。
    // 但是，你可以使用 publicRuntimeConfig 选项来公开一些配置。
    public: {
      apiBase: process.env.NUXT_API_BASE,
    },
  },
  routeRules: {
    '/portal/**': {
      proxy: 'https://www.esa2000.com/portal/**',
    },
  },
  // 代理
  // nitro: {
  //   devProxy: {
  //     // 匹配以 /portal 开头的请求，转发到目标服务器
  //     '/portal': {
  //       target: 'https://www.esa2000.com', // 目标服务器地址（必填）
  //       changeOrigin: true, // 开启跨域（关键！避免目标服务器校验 Origin 失败）
  //       prependPath: true, // 保留 /portal 前缀（默认 true，若目标接口无 /portal 则设为 false）
  //       // 可选：路径重写（比如目标接口是 /api/portal，需重写路径）
  //       // rewrite: (path) => path.replace(/^\/portal/, '/api/portal'),
  //     },
  //   },
  // },
});

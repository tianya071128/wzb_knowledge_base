import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      vue: resolve(process.cwd(), '../code/packages/vue/src/index.ts'), // 重定向 vue 到你的本地文件
      '@vue/runtime-dom': resolve(
        process.cwd(),
        '../code/packages/runtime-dom/src/index.ts'
      ), // 重定向 vue 到你的本地文件
      '@vue/runtime-core': resolve(
        process.cwd(),
        '../code/packages/runtime-core/src/index.ts'
      ), // 重定向 vue 到你的本地文件
      '@vue/shared': resolve(
        process.cwd(),
        '../code/packages/shared/src/index.ts'
      ), // 重定向 vue 到你的本地文件
    },
  },
  define: {
    __COMMIT__: `"dev"`,
    __VERSION__: `"3.5.16"`,
    __DEV__: JSON.stringify(false),
    __TEST__: JSON.stringify(false),
    __BROWSER__: JSON.stringify(false),
    __GLOBAL__: JSON.stringify(false),
    __ESM_BUNDLER__: JSON.stringify(false),
    __ESM_BROWSER__: JSON.stringify(false),
    __CJS__: JSON.stringify(false),
    __SSR__: JSON.stringify(false),
    __COMPAT__: JSON.stringify(false),
    __FEATURE_SUSPENSE__: JSON.stringify(false),
    __FEATURE_OPTIONS_API__: JSON.stringify(false),
    __FEATURE_PROD_DEVTOOLS__: JSON.stringify(false),
    __FEATURE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
  },
});

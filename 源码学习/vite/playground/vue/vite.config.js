import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8080,
    host: true, // 监听所有地址
    proxy: {
      // ...serverList.reduce((total, item) => {
      //   return {
      //     ...total,
      //     [item.value]: {
      //       target: item.url,
      //       changeOrigin: true,
      //       rewrite: (path) => '/' + path.split('/').slice(2).join('/'),
      //     },
      //   }
      // }, {}),
      'test': {
        // target: `http://192.168.9.19:8112/`, // 钟理壮
        // target: `http://192.168.9.21:8112/`, // 袁准
        // target: `http://192.168.9.66:8111/`, // 曾勇
        // target: `http://192.168.9.26:8112/`, // 李毅
        // target: `http://192.168.9.12:8112/`, // 唐浩
        // target: `http://192.168.9.21:8113/`, // 肖重文
        // target: `http://192.168.9.33:8112/`, // 戴彪
        // target: `http://192.168.9.15:8112/`, // 许总
        target: `http://192.168.1.228:8112/`, // 开发环境
        // target: `http://192.168.1.206/`, // 测试环境
        // target: `http://192.168.1.206:81/`, // 测试环境02
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    include: ['eslint'],
  },
})

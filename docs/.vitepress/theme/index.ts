// .vitepress/theme/index.ts
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import 'element-plus/dist/index.css';
import ElementPlus from 'element-plus';
import HtmlTest from '../components/HtmlTest.vue';
import { onMounted } from 'vue';
import mediumZoom from 'medium-zoom';
import './index.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册自定义全局组件
    app.component('HtmlTest', HtmlTest);
    app.use(ElementPlus);
  },
  setup() {
    onMounted(() => {
      mediumZoom('.main img', {
        background: 'var(--vp-c-bg)',
      });
    });
  },
} satisfies Theme;

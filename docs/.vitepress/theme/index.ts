// .vitepress/theme/index.ts
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import 'element-plus/dist/index.css';
import ElementPlus from 'element-plus';
import HtmlTest from '../components/HtmlTest.vue';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册自定义全局组件
    app.component('HtmlTest', HtmlTest);
    app.use(ElementPlus);
  },
} satisfies Theme;

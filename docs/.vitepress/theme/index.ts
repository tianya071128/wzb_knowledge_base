// .vitepress/theme/index.ts
import { Theme, useRoute } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import 'element-plus/dist/index.css';
import ElementPlus from 'element-plus';
import HtmlTest from '../components/HtmlTest.vue';
import { onMounted, watch, nextTick } from 'vue';
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
    const route = useRoute();
    const initZoom = () => {
      mediumZoom('.main img', {
        background: 'var(--vp-c-bg)',
      });
    };
    onMounted(() => {
      initZoom();
    });
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    );
  },
} satisfies Theme;

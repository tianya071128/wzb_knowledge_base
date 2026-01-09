import { createApp, h } from 'vue';
import './style.css';
import App from './App.vue';
const Vnode = h('div');
console.log('元素 VNode', h(Vnode, { id: 'app' }, 'Hello World'));

// createApp(App).mount('#app');

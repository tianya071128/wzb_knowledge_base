<script setup lang="ts">
import { ref } from 'vue';
import ComponentDemo from './components/组件的渲染/ComponentDemo.vue';

const msg = ref('Hello World');
</script>

<template>
  <div>
    <ComponentDemo :msg="msg">
      <div>插槽</div>
    </ComponentDemo>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

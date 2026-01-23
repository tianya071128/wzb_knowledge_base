<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';

const msg = ref('Hello World');

const demos = ['原生元素的渲染', '组件的渲染'];
const active = ref('');

const ComponentDemoAsync = defineAsyncComponent(
  () => import('./components/组件的渲染/ComponentDemo.vue')
);
const NativeElementsDemoAsync = defineAsyncComponent(
  () => import('./components/原生元素的渲染/NativeElementsDemo.vue')
);
</script>

<template>
  <div class="app">
    <div class="app_header">
      <span>测试项目：</span>
      <div class="app_header--content">
        <span
          class="app_header--item"
          :class="{
            active: active === item,
          }"
          @click="active = item"
          style="margin-right: 5px"
          v-for="item in demos"
          :key="item">
          {{ item }}
        </span>
      </div>
    </div>

    <div class="app_warpper">
      <NativeElementsDemoAsync v-if="active === '原生元素的渲染'" :msg="msg">
        <div>插槽</div>
      </NativeElementsDemoAsync>
      <ComponentDemoAsync v-if="active === '组件的渲染'" :msg="msg">
        <div>插槽</div>
      </ComponentDemoAsync>
    </div>
  </div>
</template>

<style scoped>
.app {
}
.app_header {
  padding: 20px 0;
  display: flex;
  justify-content: center;
}
.app_header--content {
  max-width: 50vw;
  display: flex;
  flex-wrap: wrap;
}
.app_header--item {
  cursor: pointer;
}
.app_header--item.active {
  color: #409eff;
}
.app_header--item:hover {
  color: #409eff;
}
.app_warpper {
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

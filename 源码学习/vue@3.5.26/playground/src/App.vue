<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';

const msg = ref('Hello World');

const demos = [
  '原生元素的渲染',
  '文本和注释节点的渲染',
  '组件的渲染',
  '片段的渲染',
  '模板引用ref',
  'Props和Attrs',
  'emits',
  'Slots',
  '依赖注入',
  '自定义指令',
  '内置指令',
];
const active = ref('');

const ComponentDemoAsync = defineAsyncComponent(
  () => import('./components/VNode的渲染/组件的渲染/ComponentDemo.vue')
);
const NativeElementsDemoAsync = defineAsyncComponent(
  () => import('./components/VNode的渲染/原生元素的渲染/NativeElementsDemo.vue')
);
const TextAndCommonDemoAsync = defineAsyncComponent(
  () =>
    import('./components/VNode的渲染/文本和注释节点的渲染/TextAndCommonDemo.vue')
);
const FragmentDemoAsync = defineAsyncComponent(
  () => import('./components/VNode的渲染/片段的渲染/FragmentDemo.vue')
);
const RefDemoAsync = defineAsyncComponent(
  () => import('./components/基础/模板引用ref/RefDemo.vue')
);
const PropsAndAttrsDemoAsync = defineAsyncComponent(
  () => import('./components/组件相关概念/propsAndAttrs/PropsAndAttrsDemo.vue')
);
const EmitsDemoAsync = defineAsyncComponent(
  () => import('./components/组件相关概念/emits/EmitsDemo.vue')
);
const SlotsDemoAsync = defineAsyncComponent(
  () => import('./components/组件相关概念/Slots/SlotsDemo.vue')
);
const ProvideDemoAsync = defineAsyncComponent(
  () => import('./components/组件相关概念/依赖注入/ProvideDemo.vue')
);
const CustomDirectivesAsync = defineAsyncComponent(
  () => import('./components/指令/自定义指令/CustomDirectives.vue')
);
const InternalDirectivesDemoAsync = defineAsyncComponent(
  () => import('./components/指令/内置指令/InternalDirectivesDemo.vue')
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
      <TextAndCommonDemoAsync
        v-if="active === '文本和注释节点的渲染'"></TextAndCommonDemoAsync>
      <FragmentDemoAsync v-if="active === '片段的渲染'"></FragmentDemoAsync>
      <RefDemoAsync v-if="active === '模板引用ref'"></RefDemoAsync>
      <PropsAndAttrsDemoAsync
        v-if="active === 'Props和Attrs'"></PropsAndAttrsDemoAsync>
      <EmitsDemoAsync v-if="active === 'emits'"></EmitsDemoAsync>
      <SlotsDemoAsync v-if="active === 'Slots'"></SlotsDemoAsync>
      <ProvideDemoAsync v-if="active === '依赖注入'"></ProvideDemoAsync>
      <CustomDirectivesAsync
        v-if="active === '自定义指令'"></CustomDirectivesAsync>
      <InternalDirectivesDemoAsync
        v-if="active === '内置指令'"></InternalDirectivesDemoAsync>
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

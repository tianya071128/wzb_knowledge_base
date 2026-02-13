<script setup lang="ts">
import { defineAsyncComponent, ref, watch } from 'vue';

const AsyncComp = defineAsyncComponent({
  // 加载函数
  loader: () => {
    return new Promise<any>((resolve) => {
      // console.log(
      //   '触发',
      //   (() => import('./AsyncComponentSonDemo.vue')).toString()
      // );
      setTimeout(() => {
        resolve(import('./AsyncComponentSonDemo.vue'));
      }, 100);
    });
  },
});

// const C = ref();

// watch(
//   C,
//   () => {
//     console.log(C.value);
//   },
//   {
//     immediate: true,
//   }
// );
</script>

<template>
  <AsyncComp ref="C"></AsyncComp>
</template>

<style lang="scss" scoped></style>

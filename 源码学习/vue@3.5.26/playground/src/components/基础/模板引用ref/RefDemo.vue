<script setup lang="ts">
import { ref } from 'vue';
import RefComponentDemo from './RefComponentDemo.vue';
import './ref';

// 原生元素的 ref 引用
const ref1 = ref();
console.log('原生元素的 ref 引用: ', ref1);

// v-for 的 ref 引用
const ref2 = ref();
console.log('v-for的 ref 引用: ', ref1);

// 组件的 ref 引用
const ref3 = ref();
console.log('组件的 ref 引用: ', ref3);
</script>

<template>
  <div>
    <div ref="ref1"></div>
    <div v-for="(item, index) in 5" :key="index" ref="ref2">{{ index }}</div>
    <RefComponentDemo ref="ref3" />
  </div>
</template>

<style lang="scss" scoped></style>

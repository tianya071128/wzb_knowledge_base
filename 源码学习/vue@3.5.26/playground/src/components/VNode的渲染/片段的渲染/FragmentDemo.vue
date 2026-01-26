<script setup lang="ts">
import { ref } from 'vue';
import './片段的渲染';

const count = ref(3);
</script>

<template>
  <div>多根</div>
  <div>多根</div>
  <button type="button" @click="count++">更新 {{ count }}, 触发组件更新</button>
  <div>
    <div v-if="count"></div>
    <div v-for="(item, index) in count" :key="index">{{ item }}</div>
  </div>
  <template v-if="count">
    <div>多根1</div>
    <div>多根2</div>
  </template>
</template>

<style lang="scss" scoped></style>

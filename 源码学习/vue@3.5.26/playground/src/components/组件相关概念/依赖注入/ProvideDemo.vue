<script setup lang="ts">
import ProvideSonDemo from './ProvideSonDemo.vue';
import { provide } from 'vue';

provide(/* 注入名 */ 'message', /* 值 */ 'hello!');
</script>

<template>
  <div>
    <ProvideSonDemo />
  </div>
</template>

<style lang="scss" scoped></style>

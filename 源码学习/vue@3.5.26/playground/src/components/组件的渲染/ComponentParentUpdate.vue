<script setup lang="ts">
/**
 * 该组件用于测试父组件的变更, 触发子组件的变更
 */
defineProps<{
  count: number;
}>();
</script>

<template>
  <div style="margin: 10px">该组件用于测试父组件的变更: {{ count }}</div>
</template>

<style lang="scss" scoped></style>

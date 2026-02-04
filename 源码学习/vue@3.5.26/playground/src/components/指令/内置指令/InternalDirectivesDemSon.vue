<script setup lang="ts">
const emit = defineEmits<{
  (event: 'find'): void;
}>();
</script>

<template>
  <div @click="emit('find')">v-on 组件事件</div>
</template>

<style lang="scss" scoped></style>

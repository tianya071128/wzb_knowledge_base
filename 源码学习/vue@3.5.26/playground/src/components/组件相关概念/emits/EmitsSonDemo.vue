<script setup lang="ts">
const emit = defineEmits<{
  test: [];
}>();
</script>

<template>
  <div>
    <button @click="emit('test')">点击触发 emits 事件</button>
  </div>
</template>

<style lang="scss" scoped></style>

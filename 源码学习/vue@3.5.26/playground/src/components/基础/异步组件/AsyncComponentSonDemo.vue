<script setup lang="ts">
import { getCurrentInstance, watchEffect } from 'vue';

defineExpose({
  test: 2,
});

const instance = getCurrentInstance();
// watchEffect(() => console.log(instance));
</script>

<template>
  <div>123456</div>
</template>

<style lang="scss" scoped></style>

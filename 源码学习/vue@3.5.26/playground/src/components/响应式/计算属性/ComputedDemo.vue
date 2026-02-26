<script setup lang="ts">
import { computed, ref } from 'vue';

const count = ref(1);
const plusOne = computed(() => count.value + 1);
console.log('计算属性: ', plusOne);
</script>

<template>
  <div></div>
</template>

<style lang="scss" scoped></style>

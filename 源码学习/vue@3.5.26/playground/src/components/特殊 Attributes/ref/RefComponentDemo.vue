<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);

defineExpose({
  count,
});
</script>

<template>
  <div></div>
</template>

<style lang="scss" scoped></style>

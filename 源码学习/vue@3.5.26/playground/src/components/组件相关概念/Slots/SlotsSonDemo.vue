<script setup lang="ts">
import { renderSlot } from 'vue';
</script>

<template>
  <div>
    <slot name="title"></slot>
    <slot name="content" content="作用域插槽"></slot>
  </div>
</template>

<style lang="scss" scoped></style>

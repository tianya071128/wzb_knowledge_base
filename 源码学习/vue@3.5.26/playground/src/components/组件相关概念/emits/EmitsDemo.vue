<script setup lang="ts">
import EmitsSonDemo from './EmitsSonDemo.vue';
</script>

<template>
  <div>
    <EmitsSonDemo @test="console.log(111)" />
  </div>
</template>

<style lang="scss" scoped></style>

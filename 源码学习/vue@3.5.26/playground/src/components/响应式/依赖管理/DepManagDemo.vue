<script setup lang="ts">
import { reactive, watchEffect, watchSyncEffect } from 'vue';

const state = reactive({
  foo: 1,
  nested: {
    bar: 2,
  },
});
watchEffect(() => {
  console.log(state.foo);
});

watchEffect(() => {
  console.log('hi');
  console.log(state.foo);
  console.log(state.nested.bar);
});

setTimeout(() => {
  state.foo++;
  state.nested.bar++;
}, 2000);
</script>

<template>
  <div></div>
</template>

<style lang="scss" scoped></style>

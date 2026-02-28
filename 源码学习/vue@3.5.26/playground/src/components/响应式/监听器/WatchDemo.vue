<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue';

// #region ------------ watchEffect ------------
const count = ref(0);
const state = reactive({
  foo: 1,
});

watchEffect(
  () => {
    console.log(state.foo);

    /**
     * 如果在 watchEffect 中嵌套 watchEffect，那么外层 watchEffect 会收集两次 state.foo 依赖
     */
    watchEffect(() => state.foo);

    console.log(state.foo);
  },
  {
    flush: 'sync',
  }
);

setTimeout(() => {
  state.foo++;
}, 1500);
// #endregion
</script>

<template>
  <div></div>
</template>

<style lang="scss" scoped></style>

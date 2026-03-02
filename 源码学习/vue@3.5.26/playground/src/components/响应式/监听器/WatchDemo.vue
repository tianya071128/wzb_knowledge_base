<script setup lang="ts">
import { computed, effectScope, reactive, ref, watch, watchEffect } from 'vue';

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

// setTimeout(() => {
//   state.foo++;
// }, 1500);
// #endregion

// #region ------------ effectScope ------------
const counter = ref(0);
const scope = effectScope();

scope.run(() => {
  const doubled = computed(() => counter.value * 2);

  watch(doubled, () => console.log(doubled.value));

  watchEffect(() => console.log('Count: ', doubled.value));
});

// 处理掉当前作用域内的所有 effect
scope.stop();
// #endregion

const state2 = reactive([1, 2, 3]);
watchEffect(() => {
  console.log(state2.length);
});
setTimeout(() => {
  state2.reverse();
}, 2000);
</script>

<template>
  <div></div>
</template>

<style lang="scss" scoped></style>

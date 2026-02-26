<script setup lang="ts">
import {
  ref,
  shallowRef,
  triggerRef,
  watchEffect,
  customRef,
  toRefs,
  reactive,
} from 'vue';

// #region ------------ ref(): 返回一个响应式的、可更改的 ref 对象 ------------
const count = ref(0);

count.value = 1;

console.log(count);
// #endregion

// #region ------------ shallowRef(): ref() 的浅层作用形式。 ------------
const state = shallowRef({ count: 1 });

// 不会触发更改
state.value.count = 2;

// 会触发更改
state.value = { count: 2 };
// #endregion

// #region ------------ triggerRef(): 强制触发依赖于一个浅层 ref 的副作用，这通常在对浅引用的内部值进行深度变更后使用。 ------------
const shallow = shallowRef({
  greet: 'Hello, world',
});

// 触发该副作用第一次应该会打印 "Hello, world"
watchEffect(() => {
  console.log(shallow.value.greet);
});

// 这次变更不应触发副作用，因为这个 ref 是浅层的
shallow.value.greet = 'Hello, universe';

// 打印 "Hello, universe"
triggerRef(shallow);
// #endregion

// #region ------------ customRef(): 创建一个自定义的 ref，显式声明对其依赖追踪和更新触发的控制方式。 ------------
function useDebouncedRef(value: any, delay = 200) {
  let timeout: number;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          value = newValue;
          trigger();
        }, delay);
      },
    };
  });
}
const text = useDebouncedRef('hello');

text.value = 'words';
console.log(text);
// #endregion

// #region ------------ toRefs(): 将一个响应式对象转换为一个普通对象，这个普通对象的每个属性都是指向源对象相应属性的 ref。 ------------
const stateAsRefs = toRefs(reactive(new Set([1, 2])));
console.log(stateAsRefs);
// #endregion
</script>

<template>
  <div></div>
</template>

<style lang="scss" scoped></style>

<script setup lang="ts">
import {
  isReactive,
  isReadonly,
  reactive,
  readonly,
  ref,
  shallowReactive,
  shallowReadonly,
} from 'vue';

// #region ------------ reactive(): 返回一个对象的响应式代理 ------------
// const obj = reactive({
//   count: 0,
//   test: {
//     name: 'test',
//   },
// });
// console.log(obj.test, obj);
// obj.count++;
// #endregion

// #region ------------ readonly(): 接受一个对象 (不论是响应式还是普通的) 或是一个 ref，返回一个原值的只读代理。 ------------
const original = reactive({ count: 0 });
const copy = readonly(original);
copy.count;
// #endregion

// #region ------------ shallowReactive(): reactive() 的浅层作用形式 ------------
const state = shallowReactive({
  foo: 1,
  nested: {
    bar: 2,
  },
});
// 更改状态自身的属性是响应式的
state.foo++;

// ...但下层嵌套对象不会被转为响应式
isReactive(state.nested); // false

// 不是响应式的
state.nested.bar++;
// #endregion

// #region ------------ shallowReadonly(): readonly() 的浅层作用形式 ------------
const state2 = shallowReadonly({
  foo: 1,
  nested: {
    bar: 2,
  },
});

// 更改状态自身的属性会失败
state2.foo++;

// ...但可以更改下层嵌套对象
isReadonly(state2.nested); // false

// 这是可以通过的
state2.nested.bar++;
// #endregion
</script>

<template>
  <div></div>
</template>

<style lang="scss" scoped></style>

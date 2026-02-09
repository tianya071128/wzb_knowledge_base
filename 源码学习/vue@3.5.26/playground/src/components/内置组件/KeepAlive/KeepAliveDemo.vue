<script setup lang="ts">
import { defineComponent, h, onActivated, ref } from 'vue';

const flag = ref(false);

const activeComponentA = defineComponent({
  name: 'name_a',
  setup() {
    onActivated(() => {
      console.log('激活了a');
    });

    return () => {
      return h('div', 'a');
    };
  },
});

const activeComponentB = defineComponent({
  name: 'name_b',
  setup() {
    onActivated(() => {
      console.log('激活了b');
    });

    return () => {
      return h('div', ['b', h(activeComponentC)]);
    };
  },
});
const activeComponentC = defineComponent({
  name: 'name_c',
  setup() {
    onActivated(() => {
      console.log('激活了c');
    });

    return () => {
      return h('div', 'c');
    };
  },
});
</script>

<template>
  <div>
    <button @click="flag = !flag">{{ flag }}</button>

    <KeepAlive :include="['name_b']">
      <component :is="flag ? activeComponentA : activeComponentB" />
    </KeepAlive>
  </div>
</template>

<style lang="scss" scoped></style>

<script setup lang="ts">
import { defineComponent, h, ref, resolveDynamicComponent } from 'vue';

const flag = ref(true);

const activeComponentA = defineComponent({
  name: 'name_a',
  setup() {
    return () => {
      return h('div', 'a');
    };
  },
});

const activeComponentB = defineComponent({
  name: 'name_b',
  setup() {
    return () => {
      return h('div', ['b']);
    };
  },
});
</script>

<template>
  <div>
    <component :is="flag ? 'div' : 'span'">component特殊元素</component>
    <component :is="flag ? activeComponentA : activeComponentB">
      component特殊元素
    </component>
  </div>
</template>

<style lang="scss" scoped></style>

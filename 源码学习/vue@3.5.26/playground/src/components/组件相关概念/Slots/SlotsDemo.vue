<script setup lang="ts">
import SlotsSonDemo from './SlotsSonDemo.vue';
import { defineComponent, h, ref } from 'vue';
import './Slots';

const CompnetWrapper = defineComponent({
  components: {
    SlotsSonDemo,
  },
  setup() {
    const count = ref(0);

    return {
      count,
    };
  },
  render(...args: any[]) {
    return h('div', [
      h('div', this.count),
      h(
        SlotsSonDemo,
        {},
        {
          // 会抛出警告: 插槽“标题”遇到非函数值。优先选择函数槽以获得更好的性能
          // title: h('div', `使用手写 render 函数的插槽: ${this.count}`),
          content: (content: string) => h('div', `内容${content}`),
        }
      ),
    ]);
  },
});

const count = ref(0);
</script>

<template>
  <div>
    <!-- <CompnetWrapper /> -->

    <SlotsSonDemo>
      <template #title>使用 template 模板的插槽</template>
      <template #content="{ content }">内容{{ content }}</template>
      <template #footer v-if="count > 2">底部{{ count }}</template>
    </SlotsSonDemo>
  </div>
</template>

<style lang="scss" scoped></style>

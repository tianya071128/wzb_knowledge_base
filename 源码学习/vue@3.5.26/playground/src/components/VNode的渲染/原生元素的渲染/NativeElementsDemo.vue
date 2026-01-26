<script setup lang="ts">
import { ref } from 'vue';
import './原生元素的渲染';

const count = ref(0);
</script>

<template>
  <div>
    <div v-once>这是一个DIV元素{{ count }}</div>
    <div>
      <button type="button" @click="count++">
        更新 {{ count }}, 触发组件更新
      </button>
    </div>
    <div>
      <div>这是通过 v-for 渲染的子元素数组</div>
      <span v-for="i in count">{{ i }}</span>
    </div>
    <div v-if="count < 2">当 count 大于等于 2 时隐藏, 测试原生元素的卸载</div>
  </div>
</template>

<style lang="scss" scoped></style>

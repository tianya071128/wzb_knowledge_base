<script setup lang="ts">
import { ref } from 'vue';
import './原生元素的渲染';

const count = ref(0);
</script>

<template>
  <div>
    <div>这是一个DIV元素</div>
    <div>
      <button type="button" @click="count++">
        更新 {{ count }}, 触发组件更新
      </button>
    </div>
    <div>
      <div>这是通过 v-for 渲染的子元素数组</div>
      <span v-for="i in count">{{ i }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

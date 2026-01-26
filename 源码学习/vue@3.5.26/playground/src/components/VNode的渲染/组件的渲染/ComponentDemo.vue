<script setup lang="ts">
import { ref } from 'vue';
import './组件的渲染';
import ComponentParentUpdate from './ComponentParentUpdate.vue';

defineProps<{ msg: string }>();

const count = ref(0);

defineExpose({
  count,
});
</script>

<template>
  <div>
    <h1>{{ msg }}</h1>

    <div>
      <button type="button" @click="count++">
        更新 {{ count }}, 触发组件更新
      </button>
    </div>

    <component-parent-update v-if="count < 2" :count="count" />

    <slot></slot>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
:slotted(div) {
  color: red;
}
</style>

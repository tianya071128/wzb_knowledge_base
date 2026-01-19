<script setup lang="ts">
import { ref, watch } from 'vue';

defineProps<{ msg: string }>();

const count = ref(0);

watch(count, () => {
  console.log('测试');
});

defineExpose({
  count,
});
</script>

<template>
  <div>
    <h1>{{ msg }}</h1>

    <!-- 这是一个注释节点222 -->
    <div class="card">
      <button type="button" @click="count++">count is {{ count }}</button>
      <p>
        Edit{{ count }}
        <code>components/HelloWorld.vue</code>
        to test HMR
      </p>
    </div>
    <p v-if="count > 2">
      Check out
      <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">
        create-vue
      </a>
      , the official Vue + Vite starter
    </p>
    <p>
      Learn more about IDE Support for Vue in the
      <a
        href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
        target="_blank">
        Vue Docs Scaling up Guide
      </a>
      .
    </p>
    <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
    <div>
      <slot></slot>
    </div>
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

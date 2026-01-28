<script setup lang="ts">
import { useAttrs, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    msg: string;
    test?: number;
  }>(),
  {
    test: 10,
  }
);

const attrs = useAttrs();

watch(
  () => attrs.attr,
  () => {
    console.log('是否为响应式');
  }
);

watch(
  () => {
    console.log('会触发吗?');
    return props.msg;
  },
  () => {
    console.log('响应式 prop');
  }
);
</script>

<template>
  <div>
    <!-- <span>{{ msg }}</span> -->
    <span>{{ $attrs }}</span>
  </div>
</template>

<style lang="scss" scoped></style>

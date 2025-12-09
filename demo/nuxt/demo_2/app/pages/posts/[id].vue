<script setup lang="ts">
const route = useRoute();

definePageMeta({
  validate: async (route) => {
    // 检查 id 是否由数字组成
    return typeof route.params.id === 'string' && /^\d+$/.test(route.params.id);
  },
});
</script>

<template>
  <div>{{ route.params.id }}</div>
</template>

<style lang="scss" scoped></style>

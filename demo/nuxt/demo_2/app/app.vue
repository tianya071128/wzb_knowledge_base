<script setup lang="ts">
import { zhCn } from 'element-plus/es/locales.mjs';

const activityStore = useActivityStore();
</script>

<template>
  <div>
    <el-config-provider :locale="zhCn">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </el-config-provider>
  </div>
</template>

<style lang="scss" scoped>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>

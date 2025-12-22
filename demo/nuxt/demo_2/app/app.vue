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

<style lang="scss" scoped></style>

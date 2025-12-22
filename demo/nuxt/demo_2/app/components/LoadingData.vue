<script setup lang="ts">
import { type AsyncDataRequestStatus } from '#app/composables/asyncData';

const props = defineProps<{
  /** 状态 */
  status: AsyncDataRequestStatus;
}>();
const emit = defineEmits<{
  /** 刷新 */
  refresh: [];
}>();
</script>

<template>
  <div class="loading_data">
    <!-- 加载中 -->
    <template v-if="status === 'idle' || status === 'pending'">
      <slot name="loading">
        <div v-loading="true" class="loading_data--block-loading"></div>
      </slot>
    </template>

    <!-- 成功 -->
    <template v-else-if="status === 'success'">
      <slot></slot>
    </template>

    <!-- 失败 -->
    <template v-else-if="status === 'error'">
      <slot name="error">
        <el-button
          @click="emit('refresh')"
          class="loading_data--block-error"
          type="danger"
          link>
          加载失败, 点击重试
        </el-button>
      </slot>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.loading_data {
  .loading_data--block-loading {
    min-height: 50px;
  }
  .loading_data--block-error {
    text-align: center;
  }
}
</style>

<script setup lang="ts">
import { withBase } from 'vitepress';
import { computed, ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  src: string;
}>();

const src = computed(() => withBase(props.src));
</script>

<template>
  <div class="show_video">
    <video style="" :src="src" controls preload="metadata"></video>
  </div>
</template>

<style scoped>
.show_video video {
  max-width: 100%;
  height: auto;
}
</style>

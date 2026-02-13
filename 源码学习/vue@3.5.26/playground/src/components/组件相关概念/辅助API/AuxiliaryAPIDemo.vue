<script setup lang="ts">
import { useAttrs, useId, useModel, useSlots, useTemplateRef } from 'vue';

const props = defineProps<{
  count: number;
}>();

const attrs = useAttrs();
const slots = useSlots();
const msg = useModel(props, 'count');
const inputRef = useTemplateRef('input');
const id = useId();
</script>

<template>
  <div>
    <input ref="input" />
  </div>
</template>

<style lang="scss" scoped></style>

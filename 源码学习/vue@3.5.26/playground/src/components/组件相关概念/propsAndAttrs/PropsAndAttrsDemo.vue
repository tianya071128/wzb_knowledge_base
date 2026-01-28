<script setup lang="ts">
import { ref } from 'vue';
import PropsAndAttrsSonDemo from './PropsAndAttrsSonDemo.vue';
import './Props和Attrs';

const attrText = ref(0);
const msgText = ref('这是一个 Props');
</script>

<template>
  <div>
    <PropsAndAttrsSonDemo :msg="msgText" :attr="attrText" />
  </div>
</template>

<style lang="scss" scoped></style>

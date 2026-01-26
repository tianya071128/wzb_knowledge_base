<script setup lang="ts">
import './文本和注释节点的渲染';
</script>

<template>
  <div>
    <div>
      这是一个文本节点, 当与其他节点在同层级时，会以文本节点的方式处理
      <span>123</span>

      <!-- 这是一个注释节点 -->
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

<script setup lang="ts">
import './Teleport';
</script>

<template>
  <Teleport to="body">
    <div class="teleport_demo">A</div>
  </Teleport>
</template>

<style scoped>
.teleport_demo {
  color: red;
}
</style>

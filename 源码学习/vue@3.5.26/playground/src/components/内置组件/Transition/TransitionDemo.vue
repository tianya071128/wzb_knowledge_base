<script setup lang="ts">
import { ref } from 'vue';
import TransitionSonDemo from './TransitionSonDemo.vue';

const show = ref(true);
</script>

<template>
  <div>
    <button @click="show = !show">切换</button>

    <Transition name="bounce">
      <p v-show="show" style="text-align: center">
        你好，这里有一些有弹性的文字!
      </p>
      <!-- <p v-else style="text-align: center">你好，这里有一些有弹性222的文字!</p> -->
    </Transition>
  </div>
</template>

<style scoped>
/* .bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
} */

.bounce-enter-active,
.bounce-leave-active {
  transition: opacity 2s ease;
}

.bounce-enter-from,
.bounce-leave-to {
  opacity: 0;
}
</style>

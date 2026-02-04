<script setup lang="ts">
import { createElementVNode, ref } from 'vue';
import './内置指令';
import InternalDirectivesDemSon from './InternalDirectivesDemSon.vue';
const count = ref(0);

const handleClick = () => {
  count.value++;
};
</script>

<template>
  <div>
    <div v-if="count < 2">v-if 指令</div>
    <div v-else-if="count < 10">v-else-if 指令</div>
    <div v-else>
      v-else 指令: 如果不加 v-else, 那么会自动添加一个 v-if 注释VNode 占位
    </div>

    <div v-text="'v-text 指令, 会将子节点覆盖'"></div>

    <div v-html="'v-html 指令, 会将子节点覆盖'"></div>

    <div v-for="(item, index) in 5" :key="index">{{ item }}</div>

    <div
      v-bind="{ id: 'hello', 'other-attr': 'words' }"
      :someProperty.prop="{ test: 1 }">
      v-bind 指令
    </div>

    <div @click.stop="handleClick" @blur.once.capture="handleClick">
      v-on 指令
    </div>
    <InternalDirectivesDemSon @find.stop="1" />

    <div v-pre>
      <span :id="count">{{ this will not be compiled }}</span>
    </div>

    <div v-once>
      <div>Comment</div>
      <p>{{ count }}</p>
    </div>

    <h1 v-show="count">v-show 指令</h1>

    <input type="text" v-model="count" />
    <InternalDirectivesDemSon v-model="count" />
  </div>
</template>

<style lang="scss" scoped></style>

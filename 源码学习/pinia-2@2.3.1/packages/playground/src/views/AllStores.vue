<template>
  <p>
    我有一家商店 "{{ userStore.name }}". 我有
    {{ cartStore.items.length }} 购物车中的物品.
  </p>
  <div>
    <p>计数器: {{ counterStore.double }} = 2 x {{ counterStore.n }}</p>
    <button @click="counterStore.increment(10)">增量</button>
    <button @click="counterStore.fail()">失败</button>
    <button @click="counterStore.decrementToZero(300)">倒数!</button>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/user'
import { useCartStore } from '../stores/cart'
import { useCounter } from '../stores/counter'

const userStore = useUserStore()
const cartStore = useCartStore()
const counterStore = useCounter()
</script>

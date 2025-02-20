<template>
  <h2>计数器 Store</h2>

  <p>计数器 :{{ counter.n }}. 双倍: {{ counter.double }}</p>

  <button @click="counter.n++">增量</button>

  <hr />

  <p><code>counter.$state</code>:</p>

  <pre>{{ counter.$state }}</pre>
</template>

<script lang="ts" setup>
import { useCounter } from '../stores/demo-counter'

const counter = useCounter()
</script>

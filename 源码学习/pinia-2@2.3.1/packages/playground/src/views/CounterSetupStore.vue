<script lang="ts" setup>
import { ref, inject } from 'vue'
import { useCounter } from '../stores/counterSetup'

console.log(
  '(1) injected (within component should be from component)',
  inject('hello')
)

const counter = useCounter()

console.log(
  '(2) injected (within component should be from component)',
  inject('hello')
)
const n = ref(0)
</script>

<template>
  <h2>本地变量</h2>

  <button @click="n++">递增本地: {{ n }}</button>

  <h2>计数器 Store</h2>

  <p>计数器 :{{ counter.n }}. 加倍: {{ counter.double }}</p>

  <p>
    增加 Store <br />

    <button @click="counter.increment()">+1</button>
    <button @click="counter.increment(10)">+10</button>
    <button @click="counter.increment(100)">+100</button>
    <button @click="counter.n++">直接增量</button>
    <button
      @click="
        counter.$patch((state) => {
          state.n++
          state.incrementedTimes++
        })
      "
    >
      直接 $patch 修改
    </button>
  </p>

  <p>
    其他 actions <br />

    <button @click="counter.fail">失败</button>
    <button @click="counter.decrementToZero(300)">减少到零</button>
    <button @click="counter.changeMe()"><code>counter.changeMe()</code></button>
  </p>

  <hr />

  <p><code>counter.$state</code>:</p>

  <pre>{{ counter.$state }}</pre>
</template>

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

    <label> <input type="checkbox" v-model="usePatch" /> 减少补丁 </label>
    <br />

    <button @click="counter.fail">失败</button>
    <button @click="counter.decrementToZero(300, usePatch)">减少到零</button>
    <button @click="counter.changeMe()"><code>counter.changeMe()</code></button>
  </p>

  <hr />

  <p><code>counter.$state</code>:</p>

  <pre>{{ counter.$state }}</pre>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useCounter } from '../stores/counter'

const counter = useCounter()
const usePatch = ref(true)
const n = ref(0)
</script>

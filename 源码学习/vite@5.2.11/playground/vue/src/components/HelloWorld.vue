<script setup>
import { ref } from 'vue'
import './test.js'

defineProps({
  msg: String,
})

const count = ref(5)
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      编辑
      <code>components/HelloWorld.vue</code>
      测试 HMR
    </p>
  </div>

  <p>
    检测
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">
      create-vue
    </a>
    , the official Vue + Vite 开始6666
  </p>
  <p>
    安装
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">单击 Vite 和 Vue 徽标了解更多信息</p>
</template>

<style scoped lang="scss">
.card {
  button {
    width: 400px;
  }
}
.read-the-docs {
  color: #999;
}
</style>

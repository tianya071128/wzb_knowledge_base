<script setup lang="ts"></script>

<template>
  <div class="home">
    <h1>欢迎来到首页</h1>
    <AppAlert>这是一个自动导入的组件</AppAlert>
    <div><NuxtLink to="/about">关于</NuxtLink></div>
    <div><NuxtLink to="/posts/test">id</NuxtLink></div>
    <img src="/img/default-avatar.png" alt="探索 Nuxt" />
    <img src="~/assets/img/batch.png" alt="探索 Nuxt" />
  </div>
</template>

<style lang="scss" scoped>
.home {
  text-align: center;
  h1 {
    font-size: 3rem;
  }
}
</style>

<template>
  <p>选择其中一个页面 ⤵️</p>

  <ul>
    <li v-for="page in pages">
      <router-link :to="page">{{ page.name }}</router-link>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const pages = router
  .getRoutes()
  .filter((route) => !route.meta.hide)
  .map((route) => ({ name: route.name }))
</script>

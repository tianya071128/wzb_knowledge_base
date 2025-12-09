<script setup lang="ts">
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css',
    },
  ],
});
</script>

<template>
  <section class="about">
    <p>此页面将在 /about 路由下显示。</p>
  </section>
</template>
<style lang="scss" scoped>
.about {
  text-align: center;
  p {
    font-size: 3rem;
  }
}
</style>

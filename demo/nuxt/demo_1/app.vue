<script setup lang="ts">
const route = useRoute();
console.log('重新启动', route);

useHead({
  // or as a function
  titleTemplate: (productCategory) => {
    console.log(productCategory);
    return productCategory ? `${productCategory} - Site Title` : 'Site Title';
  },
});
</script>

<template>
  <div>
    <!-- <h1>Hello World</h1>
    <AppAlert>123</AppAlert>
    <img src="/img/01.png" alt="1" />
    <img src="~/assets/img/01.png" alt="Discover Nuxt 3" /> -->
    <header>
      <nav>
        <ul>
          <li><NuxtLink to="/about">About</NuxtLink></li>
          <li><NuxtLink to="/login">Login</NuxtLink></li>
        </ul>
      </nav>
    </header>

    <NuxtPage />
  </div>
</template>

<style lang="scss" scoped></style>

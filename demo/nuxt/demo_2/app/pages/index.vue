<script setup lang="ts">
import { getHomeCarouselList } from '~/api';

// #region ------------ 轮播图 ------------
// 获取轮播图数据
const { data: homeCarouseList } = await useAsyncData('home-banner', () =>
  getHomeCarouselList()
);

// #endregion
</script>

<template>
  <div class="home">
    <div class="home_banner">
      <el-carousel height="auto" :autoplay="false">
        <el-carousel-item v-for="item in homeCarouseList ?? []" :key="item.id">
          <img
            class="home_banner--image"
            :src="item.imageUrl"
            :alt="item.seoKey" />
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<style lang="scss">
.home {
  .home_banner {
    .home_banner--image {
      width: 100%;
      object-fit: cover;
    }
  }
}
</style>

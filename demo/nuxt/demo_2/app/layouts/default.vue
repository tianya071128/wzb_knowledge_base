<script setup lang="ts">
// #region ------------ 导航栏 ------------
const { y } = useWindowScroll();
// 背景颜色
const headerBg = computed(() => {
  return `rgba(0,0,0,${0.85 * Math.min(1, y.value / 20)})`;
});
// 菜单
const menu = [{ name: '资讯', path: '/news', id: 'news' }];

// 获取活动等相关信息
const activityStore = useActivityStore();
const dictUrlStore = useDictUrlStore();
const progjectInfoStore = useProjectInfoStore();
await Promise.all([
  activityStore.init(),
  dictUrlStore.init(),
  progjectInfoStore.init(),
]);
// #endregion
</script>

<template>
  <div class="layout">
    <!-- 导航栏 -->
    <div
      class="layout_header"
      :style="{
        backgroundColor: headerBg,
      }">
      <NuxtLink to="/">
        <img
          class="layout_header--img"
          src="https://www.esa2000.com/images/logo-1.png"
          alt="logo" />
      </NuxtLink>

      <div class="layout_menu">
        <template v-for="item in menu" :key="item.id">
          <!-- 如果是路由 则使用 NuxtLink -->
          <NuxtLink v-if="item.path" :to="item.path" class="layout_menu--item">
            {{ item.name }}
          </NuxtLink>
        </template>
      </div>

      <!-- 活动 -->
      <div class="layout_activity">
        <template v-for="item in activityStore.activity" :key="item.id">
          <NuxtLink
            :to="item.url"
            class="layout_activity--item"
            target="_blank"
            external>
            <img :src="item.imageUrl" alt="" />
            <el-button type="primary" round>{{ item.buttonName }}</el-button>
          </NuxtLink>
        </template>
      </div>

      <!-- 登录和注册 -->
      <div class="layout_login">
        <NuxtLink
          v-if="dictUrlStore.loginUrl"
          class="layout_login--item"
          :to="dictUrlStore.loginUrl"
          target="_blank"
          external>
          <el-button type="primary" round>登录</el-button>
        </NuxtLink>
        <NuxtLink
          v-if="dictUrlStore.registerUrl"
          class="layout_login--item"
          :to="dictUrlStore.registerUrl"
          target="_blank"
          external>
          <el-button round>注册</el-button>
        </NuxtLink>
      </div>
    </div>
    <slot />
    <!-- 底部 -->
    <div class="layout_footer"></div>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  display: flex;
  flex-direction: column;

  .layout_header {
    position: fixed;
    width: 100vw;
    top: 0;
    height: var(--w-header-height);
    z-index: 10;
    color: var(--w-header-color);
    padding: 0 20px;
    display: flex;
    align-items: center;
    .layout_header--img {
      width: 120px;
    }
    .layout_menu {
      width: 10px;
      height: 100%;
      margin: 0 20px;
      flex: 1 0 0;
      display: flex;
      .layout_menu--item {
        padding: 0 20px;
        height: 100%;
        display: flex;
        align-items: center;
        &:hover {
          color: var(--el-color-primary);
          background-color: var(--el-color-primary-light-9);
        }
      }
    }
    .layout_activity {
      display: flex;
      .layout_activity--item {
        display: flex;
        align-items: center;
        margin-right: 20px;
        img {
          width: 110px;
          height: 45px;
          margin-right: 8px;
        }
      }
    }
    .layout_login {
      .layout_login--item + .layout_login--item {
        margin-left: 10px;
      }
    }
  }
  .layout_footer {
    height: 200vh;
  }
}
</style>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const activeName = ref('0');
</script>

<template>
  <div class="news">
    <div class="news_header">
      <img
        class="news_header--image"
        src="https://www.esa2000.com/images/contact/header-bg.png"
        alt="" />
      <div class="news_header--title">
        <div class="news_header--title-text">新闻中心</div>
        <div class="news_header--title-des">第一时间了解安证通最新动态</div>
      </div>
    </div>
    <el-tabs v-model="activeName" stretch class="news_tab">
      <el-tab-pane label="企业动态" name="0">
        <news-table columnId="201"></news-table>
      </el-tab-pane>
      <el-tab-pane label="行业资讯" name="1" lazy>
        <news-table columnId="202"></news-table>
      </el-tab-pane>
      <el-tab-pane label="政策法规" name="2" lazy>
        <news-table columnId="203"></news-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
.news {
  .news_header {
    display: flex;
    position: relative;
    .news_header--image {
      width: 100%;
      height: 460px;
      object-fit: cover;
    }
    .news_header--title {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      .news_header--title-text {
        font-size: 44px;
        color: #fff;
        font-weight: 800;
      }
      .news_header--title-des {
        font-size: 24px;
        color: #fff;
        margin-top: 10px;
      }
    }
  }
  .news_tab {
    :deep() {
      > .el-tabs__header {
        .el-tabs__nav-scroll {
          width: 1200px;
          margin: 0 auto;
          --el-font-size-base: 18px;
          --el-tabs-header-height: 55px;
        }
      }
    }
  }
}
</style>

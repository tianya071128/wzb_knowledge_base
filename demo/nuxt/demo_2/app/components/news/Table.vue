<script setup lang="ts">
import { getNewsList } from '~/api';

const props = defineProps<{
  columnId: '201' | '202' | '203';
}>();

const searchName = ref('');
const currentPage = ref(1);
const { data, status, execute } = await useLazyAsyncData(
  `get-news-${props.columnId}`,
  () =>
    getNewsList({
      columnId: props.columnId,
      pageNum: currentPage.value,
      pageSize: 6,
      seoKey: searchName.value,
    }),
  {
    watch: [currentPage],
  }
);
const handleSearch = () => {
  currentPage.value = 1;
  execute();
};
</script>

<template>
  <div class="news_table">
    <!-- 搜索 -->
    <div class="news_table--search">
      <el-input
        v-model="searchName"
        style="max-width: 600px"
        size="large"
        placeholder="请输入您想要了解的资讯关键字"
        class="input-with-select"
        clearable
        @clear="handleSearch">
        <template #append>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </template>
      </el-input>
    </div>

    <!-- 内容 -->
    <LoadingData class="news_table--loader" :status="status" @refresh="execute">
      <template #loading>
        <el-skeleton class="new_table--skeleton" animated :count="4">
          <template #template>
            <el-skeleton-item variant="p" class="new_table--skeleton-item" />
          </template>
        </el-skeleton>
      </template>

      <template #default>
        <div class="news_table--content">
          <NuxtLink
            class="news_table--content-item"
            v-for="item in data?.records"
            :key="item.id"
            :to="`https://www.esa2000.com/pages/${item.staticPath}`"
            target="_blank">
            <img
              class="news_table--content-item-image"
              :src="item.imgUrl"
              alt="" />
            <div class="news_table--content-item-right">
              <div class="news_table--content-item-title">{{ item.title }}</div>
              <div class="news_table--content-item-time">
                <span>{{ item.publishTime }}</span>
                <span>阅读更多 ></span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <el-empty v-if="!data?.records.length" description="无数据" />
      </template>
    </LoadingData>

    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="currentPage"
      class="news_table--pagination"
      background
      layout="total, prev, pager, next, jumper"
      :total="data?.total ?? 0" />
  </div>
</template>

<style lang="scss" scoped>
.news_table {
  width: 1200px;
  margin: 0 auto;
  padding: 60px 0;
  .news_table--search {
    display: flex;
    justify-content: center;
  }
  .news_table--loader {
    min-height: 150px;
    margin: 60px 0;
    .new_table--skeleton {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      .new_table--skeleton-item {
        flex: 0 0 calc((100% - 20px) / 2);
        height: 170px;
      }
    }
    .news_table--content {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }
    .news_table--content-item {
      flex: 0 0 calc((100% - 20px) / 2);
      height: 170px;
      box-shadow: var(--el-box-shadow);
      border-radius: 4px;
      display: flex;
      cursor: pointer;
      padding: 20px;
      .news_table--content-item-image {
        width: 200px;
        height: 134px;
        margin-right: 16px;
      }
      .news_table--content-item-right {
        flex: 1 0 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 10px 0;
        .news_table--content-item-title {
          font-size: 16px;
          font-weight: 500;
        }
        .news_table--content-item-time {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }
    }
  }
  .news_table--pagination {
    justify-content: center;
  }
}
</style>

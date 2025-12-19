<script setup lang="ts">
import { getHomeCarouselList } from '~/api';
import img1 from '~/assets/img/course-1.png';
import img2 from '~/assets/img/course-2.png';
import img3 from '~/assets/img/course-3.png';
import img4 from '~/assets/img/course-4.png';
import img5 from '~/assets/img/course-5.png';
import {
  AI_SERVICE_LIST,
  CLOUND_SERVICE_LIST,
  NUMBER_SERVICE_LIST,
  SERVICE_CONTENT_LIST,
  SERVICE_TAB_LIST,
} from '~/assets/js/constant';

// #region ------------ 轮播图 ------------
// 获取轮播图数据
const { data: homeCarouseList } = await useAsyncData('home-banner', () =>
  getHomeCarouselList()
);
// #endregion

// #region ------------ 历程 ------------
const courseList = [
  {
    title: '20年',
    subtitle: '电子签章行业经验',
    imgUrl: img1,
  },
  {
    title: '150+',
    subtitle: '著作权及专利',
    imgUrl: img2,
  },
  {
    title: '30万+',
    subtitle: '企业付费用户',
    imgUrl: img3,
  },
  {
    title: '1000万次',
    subtitle: '日均签署量',
    imgUrl: img4,
  },
  {
    title: '98%',
    subtitle: '平台续费率',
    imgUrl: img5,
  },
];
// #endregion

// #region ------------ 产品 ------------
const productActiveName = ref(0);
// #endregion
</script>

<template>
  <div class="home">
    <!-- 轮播图 -->
    <div class="home_banner">
      <el-carousel height="520px" :autoplay="false">
        <el-carousel-item
          class="home_banner--item"
          v-for="item in homeCarouseList ?? []"
          :key="item.id">
          <img
            class="home_banner--image"
            :src="item.imageUrl"
            :alt="item.seoKey" />
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 历程 -->
    <div class="home_course">
      <div class="home_course--content">
        <div
          class="home_course--item"
          v-for="item in courseList"
          :key="item.title">
          <img class="home_course--image" :src="item.imgUrl" />
          <div class="home_course--description">
            <div class="home_course--title">{{ item.title }}</div>
            <div class="home_course--subtitle">{{ item.subtitle }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 产品 -->
    <div class="home_product">
      <div class="home_module--header">
        <div class="home_module--header-title">数字信任与电子签系列产品</div>
        <div class="home_module--header-description">
          为政府机构、企业提供数字信任、电子签章、电子合同、版式文件与云文档等全系列产品，共筑安全可信的数字未来
        </div>
      </div>

      <div class="home_product--tabs">
        <!-- 左侧 tab -->
        <div class="home_product--tabList">
          <div
            v-for="(item, index) in SERVICE_TAB_LIST"
            class="home_product--tab-item"
            :class="{
              'is-active': productActiveName === index,
            }"
            @click="productActiveName = index"
            :key="index">
            <div class="home_product--tab-title">{{ item.title }}</div>

            <!-- 激活时显示内容 -->
            <div class="active-content">
              <!-- 标题 -->
              <div class="active-title">{{ item.title }}</div>
              <!-- 描述 -->
              <div class="active-description">{{ item.content }}</div>

              <!-- 使用场景 -->
              <div class="active-scene">
                <div class="active-scene-title">{{ item.subtitle }}</div>
                <div class="active-scene-content">
                  <ul>
                    <li v-for="item2 in item.subList">{{ item2 }}</li>
                  </ul>
                </div>
              </div>

              <!-- 图片 -->
              <img class="active-image" :src="item.imgUrl" alt="" />
            </div>
          </div>
        </div>
        <!-- 右侧内容 -->
        <div class="home_product--content">
          <div class="content--header">产品推荐</div>
          <!-- 产品推荐 -->
          <div class="content--body">
            <div
              v-for="item in SERVICE_CONTENT_LIST[productActiveName]?.list ??
              []"
              class="content--product-block"
              :key="item.title">
              <div class="content--product-type">{{ item.title }}</div>
              <div class="content--product-body">
                <div
                  v-for="item2 in item.subList"
                  class="content--product-item"
                  :style="{
                    'background-image': `url(${item2.imgUrl})`,
                  }"
                  :key="item2.title">
                  <div class="content--product-title">{{ item2.title }}</div>
                  <div class="content--product-description">
                    {{ item2.content.join(';') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 生命周期 -->
    <div class="home_lifecycle">
      <div class="home_module--header home_lifecycle--header">
        <div class="home_module--header-title">印章全生命周期合规管控</div>
        <div class="home_module--header-description">
          电子印章、实物印章与智能印章（印控仪）一体化高效管控，全面覆盖印章的认证、制发、管理、查询等服务，让用印更安全
        </div>
      </div>
      <div class="home_lifecycle--content">
        <img
          class="home_lifecycle--content-image home_lifecycle--content-image-1"
          src="https://www.esa2000.com/images/home/sealPeriod/fun-1.png"
          alt="" />
        <img
          class="home_lifecycle--content-image"
          src="https://www.esa2000.com/images/home/sealPeriod/fun-2.png"
          alt="" />
      </div>
    </div>

    <!-- 云与SaaS服务 -->
    <div class="home_cloud">
      <div class="home_module--header">
        <div class="home_module--header-title">云与SaaS服务</div>
        <div class="home_module--header-description">
          提供电子签名全生态圈服务，涵盖身份认证、电子签章、电子签约、印章管控、存证出证等服务，轻松享受便捷高效的电子签体验
        </div>
      </div>

      <img
        class="home_module-image"
        src="https://www.esa2000.com/images/home/cloundService/fun-1.png" />

      <!-- 服务列表 -->
      <div class="home_module--service-list">
        <div
          class="home_module--service-item"
          v-for="(item, index) in CLOUND_SERVICE_LIST"
          :key="index">
          <div class="service-title">{{ item.title }}</div>
          <div class="service-description">{{ item.content }}</div>
          <img class="service-image" :src="item.imgUrl" alt="" />
        </div>
      </div>
    </div>

    <!-- 数字化文档处理服务 -->
    <div class="home_docs">
      <div class="home_module--header">
        <div class="home_module--header-title">数字化文档处理服务</div>
        <div class="home_module--header-description">
          精确呈现文档内容，结合云技术实现高效存储、便捷共享与无缝协作，守护格式之美，共创协作之智
        </div>
      </div>

      <img
        class="home_module-image"
        src="https://www.esa2000.com/images/home/numberService/fun-1.png" />

      <!-- 服务列表 -->
      <div class="home_module--service-list">
        <div
          class="home_module--service-item"
          v-for="(item, index) in NUMBER_SERVICE_LIST"
          :key="index">
          <div class="service-title">{{ item.title }}</div>
          <div class="service-description">{{ item.content }}</div>
          <img class="service-image" :src="item.imgUrl" alt="" />
        </div>
      </div>
    </div>

    <!-- AI智能服务 -->
    <div class="home_AI">
      <div class="home_module--header">
        <div class="home_module--header-title">AI智能服务</div>
        <div class="home_module--header-description">
          提供OCR识别、内容提取、文档比对等AI开放能力和智能应用，打造极致智能体验
        </div>
      </div>

      <img
        style="height: 215px"
        class="home_module-image"
        src="https://www.esa2000.com/images/home/aiService/fun-1.png" />

      <!-- 服务列表 -->
      <div class="home_module--service-list">
        <div
          class="home_module--service-item row-4"
          v-for="(item, index) in AI_SERVICE_LIST"
          :key="index">
          <div class="service-title">{{ item.title }}</div>
          <div class="service-description">{{ item.content }}</div>
          <img class="service-image" :src="item.imgUrl" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.home {
  .home_banner {
    .home_banner--item {
      display: flex;
      justify-content: center;
    }
    .home_banner--image {
      height: 520px;
      object-fit: cover;
    }
  }

  .home_course {
    height: 60px;
    position: relative;
    .home_course--content {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 1200px;
      height: 120px;
      box-shadow: var(--el-box-shadow);
      background-color: var(--el-bg-color);
      display: flex;
      padding: 10px 20px;
      border-radius: 4px;
      .home_course--item {
        display: flex;
        align-items: center;
        flex: 1 0 auto;
        padding-left: 10px;
        &:not(:last-of-type) {
          border-right: 1px solid var(--el-border-color);
        }
        .home_course--image {
          width: 80px;
          height: 80px;
          margin-right: 10px;
        }
        .home_course--description {
          display: flex;
          flex-direction: column;
          justify-content: center;
          .home_course--title {
            font-size: 18px;
            font-weight: 700;
            line-height: 1.5;
          }
          .home_course--subtitle {
            color: var(--el-text-color-regular);
            font-size: 14px;
          }
        }
      }
    }
  }

  .home_product {
    margin-top: 80px;
    .home_product--tabs {
      width: 1200px;
      height: 657px;
      margin: 0 auto;
      border: 1px solid var(--el-border-color);
      display: flex;
      margin-top: 30px;
      .home_product--tabList {
        flex: 0 0 264px;
        width: 264px;
        height: 100%;
        display: flex;
        flex-direction: column;
        .home_product--tab-item {
          height: 96px;
          max-height: 96px;
          padding: 24px;
          background: linear-gradient(
            90deg,
            rgba(246, 249, 255, 0.5) 0%,
            #eaf0fc 100%
          );
          cursor: pointer;
          transition: max-height 0.5s;
          .home_product--tab-title {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
          }
          .active-content {
            display: none;
          }
          &.is-active {
            flex: 1 0 auto;
            max-height: 400px;
            background: linear-gradient(356deg, #f36262 0%, #de0522 100%);
            cursor: initial;
            color: #fff;
            position: relative;
            .home_product--tab-title {
              display: none;
            }
            .active-content {
              display: block;

              .active-title {
                font-size: 20px;
                line-height: 1.5;
                font-weight: bold;
              }
              .active-description {
                font-size: 12px;
                opacity: 0.9;
              }
              .active-scene {
                margin-top: 24px;
                .active-scene-content {
                  ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    li {
                      font-size: 12px;
                      opacity: 0.9;
                      margin-top: 8px;
                      &::before {
                        content: '•';

                        margin-right: 2px;
                      }
                    }
                  }
                }
              }
              .active-image {
                position: absolute;
                right: 0;
                bottom: 0;
                width: 112px;
              }
            }
          }
          &:not(:last-of-type) {
            margin-bottom: 2px;
          }
        }
      }
    }
    .home_product--content {
      flex: 1 0 0;
      .content--header {
        padding: 16px;
        font-size: 20px;
        font-weight: 700;
        border-bottom: 1px solid var(--el-border-color);
      }
      .content--body {
        padding: 16px;
        .content--product-block {
          &:not(:last-of-type) {
            margin-bottom: 24px;
          }
          .content--product-type {
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 10px;
          }
          .content--product-body {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            .content--product-item {
              width: calc((100% - 20px) / 3);
              height: 140px;
              padding: 30px 80px 0 18px;
              cursor: pointer;
              .content--product-title {
                font-size: 14px;
                margin-bottom: 8px;
                font-weight: bold;
              }
              .content--product-description {
                font-size: 12px;
              }

              &:hover {
                box-shadow: var(--el-box-shadow);
              }
            }
          }
        }
      }
    }
  }

  .home_lifecycle {
    margin-top: 120px;
    .home_lifecycle--header {
      background: #f3f3f3;
    }
    .home_lifecycle--content {
      padding: 60px 0 100px;
      background-image: linear-gradient(
        to left,
        rgba(254, 210, 210, 0),
        rgba(204, 204, 204, 0.3) 50%,
        rgba(254, 210, 210, 0)
      );
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .home_lifecycle--content-image-1 {
        margin-bottom: 60px;
      }
    }
  }

  // 通用样式
  .home_module--header {
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .home_module--header-title {
      font-size: 24px;
      font-weight: 800;
      line-height: 1.8;
    }
    .home_module--header-description {
      font-size: 16px;
      font-weight: 400;
      color: var(--el-text-color-regular);
    }
  }

  .home_module-image {
    display: block;
    width: 1200px;
    height: 155px;
    margin: 0 auto;
  }

  .home_module--service-list {
    width: 1200px;
    margin: 30px auto 0;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    .home_module--service-item {
      width: calc((100% - 80px) / 5);
      margin-bottom: 25px;
      padding-top: 30px;
      box-shadow: var(--el-box-shadow-light);
      display: flex;
      flex-direction: column;
      &.row-4 {
        width: calc((100% - 80px) / 4);
      }
      .service-title {
        font-size: 16px;
        font-weight: 400;
        color: var(--el-color-primary);
        margin-bottom: 10px;
        padding: 0 27px;
      }
      .service-description {
        font-size: 12px;
        line-height: 1.5;
        padding: 0 27px;
      }
      .service-image {
        margin-top: auto;
      }
    }
  }
}
</style>

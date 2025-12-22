<script setup lang="ts">
import { Coffee, PriceTag, Apple } from '@element-plus/icons-vue';

// #region ------------ 导航栏 ------------
const { y } = useWindowScroll();
// 背景颜色
const headerBg = computed(() => {
  return `rgba(0,0,0,${0.85 * Math.min(1, y.value / 20)})`;
});
// 菜单
const menu = [
  {
    name: '方案',
    id: 'program',
    prefixPath: '/program',
    children: [
      { name: '政务服务', path: '/program/govService', id: 'govService' },
    ],
  },
  { name: '资讯', path: '/news', id: 'news' },
];
const route = useRoute();

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
    <el-backtop :right="10" :bottom="100" />

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
          <NuxtLink
            v-if="item.path"
            :to="item.path"
            class="layout_menu--item"
            :class="{
              'layout_menu--active': route.path === item.path,
            }">
            {{ item.name }}
          </NuxtLink>
          <!-- 嵌套 -->
          <el-popover
            v-else
            placement="bottom-start"
            width="auto"
            transition="el-zoom-in-top">
            <template #reference>
              <div
                class="layout_menu--item"
                :class="{
                  'layout_menu--active': route.path.startsWith(
                    item.prefixPath ?? ''
                  ),
                }">
                {{ item.name }}
              </div>
            </template>

            <template v-for="child in item.children" :key="child.id">
              <div class="layout_menu--child">
                <NuxtLink
                  :to="child.path"
                  class="layout_menu--child-item"
                  :class="{
                    'layout_menu--child-active': route.path === child.path,
                  }">
                  {{ child.name }}
                </NuxtLink>
              </div>
            </template>
          </el-popover>
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
    <div class="layout_footer">
      <!-- 注册 -->
      <div class="layout_footer--register">
        <div class="layout_footer--register-title">
          即刻注册，开启电子合同新时代
        </div>
        <div class="layout_footer--register-desc">一章通用 安全可信</div>
        <el-button
          type="primary"
          round
          style="padding-left: 34px; padding-right: 34px">
          立即注册
        </el-button>
      </div>

      <!-- 内容 -->
      <div class="layout_footer--content">
        <div class="layout_footer--content-wrapper">
          <div class="layout_footer--service">
            <div class="layout_footer--service-item">
              <div class="layout_footer--service-item-title">快速入口</div>
              <el-icon class="layout_footer--service-item-icon">
                <PriceTag />
              </el-icon>
              <NuxtLink
                to="https://www.esa2000.com/bottomNavigation/documentInspection.html"
                target="_blank">
                <el-button
                  class="layout_footer--service-item-btn"
                  link
                  color="#fff">
                  文件查验
                </el-button>
              </NuxtLink>
              <NuxtLink
                to="https://www.esa2000.com/bottomNavigation/documentInspection.html"
                target="_blank">
                <el-button
                  type="primary"
                  class="layout_footer--service-item-btn2"
                  round
                  color="#f0dbbc">
                  人民签
                </el-button>
              </NuxtLink>
            </div>
            <div class="layout_footer--service-item">
              <div class="layout_footer--service-item-title">产品体验</div>
              <el-icon class="layout_footer--service-item-icon">
                <Coffee />
              </el-icon>
              <NuxtLink
                to="https://www.esa2000.com/bottomNavigation/documentInspection.html"
                target="_blank">
                <el-button
                  class="layout_footer--service-item-btn"
                  link
                  color="#fff">
                  实操入口
                </el-button>
              </NuxtLink>
              <NuxtLink
                to="https://www.esa2000.com/bottomNavigation/documentInspection.html"
                target="_blank">
                <el-button
                  type="primary"
                  class="layout_footer--service-item-btn2"
                  round
                  color="#f0dbbc">
                  操作视频
                </el-button>
              </NuxtLink>
            </div>
            <div class="layout_footer--service-item">
              <div class="layout_footer--service-item-title">支撑服务</div>
              <el-icon class="layout_footer--service-item-icon">
                <Apple />
              </el-icon>
              <NuxtLink
                to="https://www.esa2000.com/bottomNavigation/documentInspection.html"
                target="_blank">
                <el-button
                  class="layout_footer--service-item-btn"
                  link
                  color="#fff">
                  法律解读
                </el-button>
              </NuxtLink>
              <NuxtLink
                to="https://www.esa2000.com/bottomNavigation/documentInspection.html"
                target="_blank">
                <el-button
                  type="primary"
                  class="layout_footer--service-item-btn2"
                  round
                  color="#f0dbbc">
                  司法出证
                </el-button>
              </NuxtLink>
            </div>
            <div class="layout_footer--service-item layout_footer--contact">
              <div class="layout_footer--service-item-title">联系我们</div>
              <div class="layout_footer--contact-hotline">
                服务热线
                <span class="layout_footer--contact-phone">400-871-9666</span>
              </div>
              <div class="layout_footer--contact-time">
                ( 每日 9：00-18：00 )
              </div>
              <el-divider />
              <div class="contact-address">公司地址</div>
              <div class="contact-address-title">
                北京市海淀区上地三街9号金隅嘉华大厦B1001
              </div>
            </div>
          </div>
          <div class="layout_footer--qr">
            <div class="layout_footer-qr-wrapper">
              <div class="layout_footer--logo">
                <img src="https://www.esa2000.com/images/logo-1.png" alt="" />
              </div>
              <div class="layout_footer--qr-content">
                <div class="layout_footer--qr-item">
                  <img
                    src="https://www.esa2000.com/images/home/qr-img1.png"
                    alt="" />
                  <span>安证通订阅号</span>
                </div>
                <div class="layout_footer--qr-item">
                  <img
                    src="https://www.esa2000.com/images/home/qr-img2.png"
                    alt="" />
                  <span>一签通服务号</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 版权号 -->
        <div class="layout_footer--copyright">
          Copyright © 2013 ESA2000.COM. All rights reserved.
          北京安证通信息科技股份有限公司 版权所有 京ICP备05053630号-1
          京公网安备11010802025278号
        </div>
      </div>
    </div>
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
        &.layout_menu--active {
          color: var(--el-color-primary);
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
    .layout_footer--register {
      background: url(https://www.esa2000.com/images/home/register-bg.png)
        no-repeat center 0px;
      height: 260px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .layout_footer--register-title {
        font-size: 28px;
        color: #fff;
      }
      .layout_footer--register-desc {
        color: #929da8;
        margin-bottom: 20px;
      }
    }
    .layout_footer--content {
      background: #222f37;
      padding: 60px 0 20px;
      .layout_footer--content-wrapper {
        width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .layout_footer--service {
        width: 100%;
        display: flex;
        gap: 30px;
        .layout_footer--service-item {
          width: 240px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: #2b363f;
          color: #fff;
          border-radius: 6px;
          .layout_footer--service-item-title {
            /* 基础字体样式（按需调整） */
            font-size: 28px;
            font-weight: 700;
            /* 关键：让文字透明，显示背景渐变 */
            color: transparent;
            /* 核心：背景渐变（包含默认+hover两种渐变） */
            background-image: linear-gradient(
              to right,
              #b8860b,
              #d4af37,
              #ffd700
            );
            /* 裁剪背景到文字区域（核心属性，模拟color渐变） */
            -webkit-background-clip: text;
            background-clip: text;
            /* 渐变宽度翻倍，容纳两种渐变效果 */
            background-size: 200% 100%;
            /* 默认显示左半段：暗金→中金 */
            background-position: left;
            /* 平滑过渡hover效果 */
            transition: background-position 0.4s ease;
          }
          .layout_footer--service-item-icon {
            font-size: 32px;
            margin-top: 10px;
          }
          .layout_footer--service-item-btn {
            margin-top: 10px;
            font-size: 16px;
            color: #fff;
            &:hover {
              color: var(--el-color-primary);
            }
          }
          .layout_footer--service-item-btn2 {
            padding-left: 24px;
            padding-right: 24px;
            margin-top: 10px;
          }
          &:hover {
            .layout_footer--service-item-title {
              background-position: right;
            }
          }
        }
        .layout_footer--contact {
          flex: 1 0 0;
          align-items: flex-start;
        }
        .layout_footer--contact-hotline {
          .layout_footer--contact-phone {
            font-size: 24px;
          }
        }
        .layout_footer--contact-time {
          font-size: 12px;
        }
      }
      .layout_footer--qr {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        margin-top: 40px;
        .layout_footer-qr-wrapper {
          width: calc(100% - 30px * 3 - 240px * 3);
        }

        .layout_footer--logo {
          img {
            height: 30px;
          }
        }
        .layout_footer--qr-content {
          margin-top: 20px;
          display: flex;
          align-items: center;
          .layout_footer--qr-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-right: 20px;
            img {
              width: 110px;
            }
            span {
              font-size: 12px;
              color: #fff;
              margin-top: 8px;
            }
          }
        }
      }
    }
    .layout_footer--copyright {
      text-align: center;
      color: #fff;
      font-size: 12px;
      margin-top: 20px;
    }
  }
}
.layout_menu--child {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  min-width: 250px;
  .layout_menu--child-item {
    cursor: pointer;
    &:hover {
      color: var(--el-color-primary);
    }
    &.layout_menu--child-active {
      color: var(--el-color-primary);
    }
  }
}
</style>

<script setup lang="ts">
import type { ProgramModel } from '~/assets/js/program';

const props = defineProps<{
  program: ProgramModel;
}>();
</script>

<template>
  <div class="program">
    <!-- 方案 -- 头部 -->
    <div class="program_header">
      <div class="program_header--title">{{ program.header.title }}</div>
      <div class="program_header--content">{{ program.header.content }}</div>
      <div class="program_header--description">
        {{ program.header.description }}
      </div>
      <img
        class="program_header--image"
        :src="program.header.imgUrl"
        :alt="program.header.alt" />
    </div>

    <!-- 方案 -- 应用场景 -->
    <div class="program_scene">
      <div class="program_scene--title">应用场景</div>
      <div class="program_scene--list">
        <div
          class="program_scene--item"
          v-for="item in program.sceneList"
          :key="item.name"
          :style="{
            background: `url(${item.imgUrl}) no-repeat center 0px`,
          }">
          <div class="program_scene--item-name">{{ item.name }}</div>
          <div class="program_scene--item-content">{{ item.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.program {
  .program_header {
    position: relative;
    height: 460px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 280px;
    color: #fff;
    .program_header--title {
      font-size: 44px;
    }
    .program_header--content {
      font-size: 44px;
    }
    .program_header--description {
      width: 500px;
      font-size: 16px;
      color: #929da8;
    }
    .program_header--image {
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: -1;
      left: 0;
      object-fit: cover;
    }
  }

  .program_scene {
    width: 1200px;
    margin: 80px auto;

    .program_scene--title {
      text-align: center;
      margin-bottom: 30px;
      font-size: 32px;
      color: #000;
      font-weight: bold;
    }
    .program_scene--list {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      .program_scene--item {
        width: calc((100% - 20px) / 2);
        position: relative;
        border-radius: 12px;
        padding: 60px 60px 0 60px;
        height: 320px;
        .program_scene--item-image {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: -1;
          top: 0;
          left: 0;
        }
        .program_scene--item-name {
          font-weight: bold;
          font-size: 28px;
          color: #27323f;
          text-align: center;
          margin-bottom: 16px;
        }
        .program_scene--item-content {
          font-size: 16px;
          line-height: 28px;
          color: #333333;
        }
      }
    }
  }
}
</style>

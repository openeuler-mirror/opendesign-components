<script setup lang="ts">
import { OFigure } from '@components/index';

const img = 'https://www.openeuler.org/img/banners/20230418-odd.png';
const img2 = 'https://www.hikunpeng.com/_static3/7.875f5cf6.jpg';

const onVideoClick = () => {
  alert('开始播放视频');
};
</script>
<template>
  <h4>固定 宽高比/填充方式</h4>
  <OFigure style="width: 25%" :src="img" fit="contain" />
  <OFigure style="width: 25%" :src="img" :ratio="16 / 9" fit="contain" />
  <OFigure style="width: 25%" :src="img" :ratio="4 / 3" fit="cover" />
  <OFigure style="width: 25%" src="123" />
  <h4>可交互</h4>
  <OFigure style="width: 25%" hoverable :src="img" />
  <h4>图片链接</h4>
  <OFigure style="width: 25%" href="openEuler" target="__blank" :src="img" />
  <h4>图片可预览</h4>
  <OFigure style="width: 25%" :src="img" preview />
  <h4>视频</h4>
  <OFigure style="width: 25%" :src="img" video-poster @click="onVideoClick" />
  <h4>图文</h4>
  <OFigure style="width: 25%" :src="img" hoverable>
    <template #title>标题文本</template>
  </OFigure>
  <OFigure style="width: 25%; margin-left: 24px" :src="img" hoverable>
    <template #content>标题文本</template>
  </OFigure>
</template>
<style lang="scss"></style>

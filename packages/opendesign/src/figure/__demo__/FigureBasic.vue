<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import { OFigure } from '../index';
const img = 'https://www.openeuler.org/img/banners/20230418-odd.png';

const playVideo = () => {
  alert('you can play video');
};
const onload = () => {
  console.log('loaded');
};

const onerror = () => {
  console.log('error');
};
let count = 0;
const testTriggerDouble = () => {
  if (count++ >= 1) {
    console.error('失败：修复在设置 background 为 true 且未设置 ratio 属性时，load 或 error 触发两次的问题');
  } else {
    console.log('trigger', count);
  }
};
const figureDom = useTemplateRef('background-no-ratio');
onMounted(() => {
  if (figureDom.value?.$el.querySelector('img')) {
    console.error('失败：修复在设置 background 为 true 且未设置 ratio 属性时，background 失效的问题');
  } else {
    console.log('成功：修复在设置 background 为 true 且未设置 ratio 属性时，background 失效的问题');
  }
});
</script>
<template>
  <h4>基本</h4>
  <section>
    <OFigure class="img" :src="img" colorful @load="onload" />
    <OFigure class="img" :src="img" :ratio="16 / 9" fit="contain" colorful />
    <OFigure class="img" src="123" :ratio="16 / 9" fit="cover" colorful @error="onerror" />
    <OFigure class="img" :src="img" :ratio="16 / 9" fit="cover" background colorful @load="onload" />
    <OFigure class="img" hoverable :src="img" />
    <OFigure class="img" href="openEuler" target="__blank" :src="img" />
    <OFigure class="img" :src="img" video-poster @click="playVideo" />
  </section>

  <h4>background</h4>
  <div class="column">
    <OFigure class="img" :src="img" background :ratio="16 / 9" />
    <span>修复在设置 background 为 true 且未设置 ratio 属性时，background 失效的问题以及load 或 error 触发两次的问题</span>
    <OFigure
      ref="background-no-ratio"
      class="img"
      :src="img"
      background
      style="height: 200px; width: 200px"
      @load="testTriggerDouble"
      @error="testTriggerDouble"
    />
  </div>
  <h4>slot</h4>

  <section>
    <OFigure style="width: 25%" :src="img" hoverable>
      <template #title>标题文本</template>
    </OFigure>
    <OFigure style="width: 25%; margin-left: 24px" :src="img" hoverable>
      <template #content>自定义文字样式</template>
    </OFigure>
  </section>
</template>
<style lang="scss" scoped>
.column {
  > * {
    display: block;
  }
}
.img {
  width: 25%;
  border: 1px solid #ddd;
  position: relative;
}
.zoomIn {
  position: absolute;
  right: 0;
  bottom: 0;
  color: red;
  font-size: 32px;
  cursor: pointer;
}
</style>

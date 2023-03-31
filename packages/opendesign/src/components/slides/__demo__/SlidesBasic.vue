<script setup lang="ts">
import { ref } from 'vue';
import { OFigure } from '../../figure';
import '../../figure/style';
import { OSlides, OSlideItem } from '../index';
const slides = [
  'https://www.hiascend.com/p/resource/202303/95e2eec7ebe049628f402b04731b675b.png',
  'https://www.hiascend.com/p/resource/202303/2422385450af46418ca68b03b13e4494.png',
  'https://www.hiascend.com/p/resource/202303/4d94234f0bab4612883906a30d595391.png',
];

const onChange = (now: number, last: number) => {
  console.log('slides changed', now, last);
};
const onBeforeChange = (now: number, last: number) => {
  console.log('slides before changed', now, last);
};

const slidesRef = ref<InstanceType<typeof OSlides> | null>(null);
let idx = 1;
const next = () => {
  slidesRef.value?.active(++idx).then(() => {
    console.log('done', idx);
  });
};
</script>
<template>
  <div style="min-height: 200vh">
    <h4>基本</h4>
    <div class="block">
      <h2 @click="next">Next</h2>
      <div class="center"></div>
      <OSlides ref="slidesRef" loop class="gallery-slides" :auto-play="false" :active-index="idx" @change="onChange" @before-change="onBeforeChange">
        <OSlideItem v-for="s in 6" :key="s" class="gallery-slide">
          <div class="slide">{{ s - 1 }}</div>
          <div class="center red"></div>
        </OSlideItem>
      </OSlides>
    </div>
    <div class="block" style="overflow: hidden">
      <OSlides class="slides" auto-play @change="onChange">
        <OSlideItem v-for="s in slides" :key="s" class="slide-item2">
          <OFigure class="img" :src="s" />
        </OSlideItem>
      </OSlides>
    </div>
    <!-- <div class="block" style="overflow: hidden">
    <OSlides loop class="slides2" :auto-play="true" style="--slide-gap-x: 16px" :active-index="1" @change="onChange">
      <OSlideItem v-for="s in slides" :key="s" class="slide-item2">
        <OFigure class="img" :src="s" />
      </OSlideItem>
    </OSlides>
  </div> -->
  </div>
</template>
<style lang="scss">
.block {
  position: relative;
  overflow: hidden;
}
.center {
  position: absolute;
  border: 1px solid blue;
  height: 100%;
  left: 50%;
  top: 0;
  z-index: 10;
  // margin-left: -1px;
  &.red {
    border-color: red;
  }
}
.slides {
  height: 200px;
  width: 80%;
  margin: auto;
}
.slides2 {
  width: 50%;
  margin: auto;
  height: 200px;
  overflow: hidden;
  // background-color: red;
}
.slide-item2 {
  width: 100%;
  height: 100%;
  padding: 0 8px;
}
.img {
  border-radius: 16px;
  overflow: hidden;
  height: 100%;
  width: 100%;
}

.gallery-slides {
  height: 100px;
  background-color: #eee;
}
.gallery-slide {
  width: 500px;
  height: 100px;
}

.slide {
  height: 100%;
  border: 2px solid red;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  margin: 0 16px;
  background-color: #333;
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import { OFigure } from '../../figure';
import '../../figure/style';
import { OCarousel, OCarouselItem } from '../index';
const carousel = [
  'https://www.hiascend.com/p/resource/202303/95e2eec7ebe049628f402b04731b675b.png',
  'https://www.hiascend.com/p/resource/202303/2422385450af46418ca68b03b13e4494.png',
  'https://www.hiascend.com/p/resource/202303/4d94234f0bab4612883906a30d595391.png',
];

const onChange = (now: number, last: number) => {
  console.log('[1] changed', now, last);
};
const onBeforeChange = (now: number, last: number) => {
  console.log('[1] before changed', now, last);
};
const onChange2 = (now: number, last: number) => {
  console.log('[2] changed', now, last);
};
const onBeforeChange2 = (now: number, last: number) => {
  console.log('[2] before changed', now, last);
};

const slidesRef = ref<InstanceType<typeof OCarousel> | null>(null);
let idx = 1;
const next = () => {
  slidesRef.value?.active(++idx).then(() => {
    console.log('done', idx);
  });
};
const active1 = () => {
  slidesRef.value?.active(1).then(() => {
    console.log('done', 1);
  });
};
const startPlay = () => {
  slidesRef.value?.play();
};
const stopPlay = () => {
  slidesRef.value?.pause();
};

const slidesRef2 = ref<InstanceType<typeof OCarousel> | null>(null);
const initSlides = () => {
  slidesRef2.value?.init();
};
</script>
<template>
  <div style="min-height: 200vh">
    <h4>gallery</h4>
    <div class="block">
      <div class="btn" @click="next">Next</div>
      <div class="btn" @click="active1">slide 1</div>
      <div class="btn" @click="startPlay">Start</div>
      <div class="btn" @click="stopPlay">Pause</div>
      <div class="center"></div>
      <OCarousel
        ref="slidesRef"
        v-model:active-index="idx"
        indicator-click
        loop
        class="gallery-carousel"
        :auto-play="false"
        click-to-switch
        pause-on-hover
        @change="onChange"
        @before-change="onBeforeChange"
      >
        <OCarouselItem v-for="s in 6" :key="s" class="gallery-carousel-item">
          <div class="slide">{{ s - 1 }}</div>
          <div class="center red"></div>
        </OCarouselItem>
      </OCarousel>
    </div>
    <div class="block" style="overflow: hidden">
      <OCarousel class="carousel" indicator-click click-to-switch @change="onChange2" @before-change="onBeforeChange2">
        <OCarouselItem v-for="s in carousel" :key="s" class="slide-item2">
          <OFigure class="img" :src="s" />
        </OCarouselItem>
      </OCarousel>
    </div>
    <div class="block" style="overflow: hidden">
      <div class="btn" @click="initSlides">延迟初始化</div>
      <OCarousel ref="slidesRef2" manual-init class="slides2" :active-index="1" @change="onChange" indicator-wrap-class="arrow-white" indicator-click>
        <OCarouselItem v-for="s in carousel" :key="s" class="slide-item2">
          <OFigure class="img" :src="s" />
        </OCarouselItem>
      </OCarousel>
    </div>
    <h4>Fade</h4>
    <div class="block" style="overflow: hidden">
      <OCarousel
        class="slides2"
        effect="toggle"
        indicator-click
        active-class="current-slide"
        data-o-theme="dark"
        auto-play
        @change="onChange"
        @before-change="onBeforeChange"
      >
        <OCarouselItem v-for="(s, idx) in carousel" :key="s">
          <OFigure class="img-bg" :src="s" />
          <div class="slide2-slide-content">
            <div class="title">this is title {{ idx }}</div>
            <div class="desc">{{ idx }}this is description, this is description</div>
          </div>
        </OCarouselItem>
      </OCarousel>
    </div>
  </div>
</template>
<style lang="scss" scoped>
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
.carousel {
  height: 200px;
  width: 50%;
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

.gallery-carousel {
  height: 100px;
  background-color: #eee;
}
.gallery-carousel-item {
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
  background-color: #999;
}

.slides2 {
  .img-bg {
    position: absolute;
    z-index: -1;
  }
}
.slide2-slide-content {
  width: 100%;
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
}
@keyframes fade-up {
  from {
    transform: translateY(var(--d));
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.title {
  font-size: 24px;
  color: #fff;
  font-weight: bold;
  --d: 10px;
}
.desc {
  margin-top: 12px;
  font-size: 16px;
  color: #bbb;
  --d: 20px;
}
.current-slide {
  .title {
    animation: fade-up 400ms ease-in;
  }
  .desc {
    animation: fade-up 400ms ease-in;
  }
}
:deep(.arrow-white) {
  background-color: #eee;
}
</style>

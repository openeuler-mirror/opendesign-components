<script setup lang="ts">
import { ref } from 'vue';
import { OFigure, OCarousel, OCarouselItem } from '@components/index';

const carouselInfo2 = [
  'https://www.hiascend.com/p/resource/202306/98acd0e9a49245d296514896464dca8d.jpg',
  'https://www.hiascend.com/p/resource/202306/0f6b8aa6ada140458bc7a484f4c1c14b.jpg',
  'https://www.hiascend.com/s/ascendstatic/lst/as3.0/dev/fang.jpg',
];
const carouselInfo3 = [
  'https://www.hiascend.com/p/resource/202303/95e2eec7ebe049628f402b04731b675b.png',
  'https://www.hiascend.com/p/resource/202303/2422385450af46418ca68b03b13e4494.png',
  'https://www.hiascend.com/p/resource/202303/4d94234f0bab4612883906a30d595391.png',
];

const onChange2 = (now: number, last: number) => {
  console.log('[2] changed', now, last);
};
const onBeforeChange2 = (now: number, last: number) => {
  console.log('[2] before changed', now, last);
};
const onChange3 = (now: number, last: number) => {
  console.log('[3] changed', now, last);
};
const onBeforeChange3 = (now: number, last: number) => {
  console.log('[3] before changed', now, last);
};
</script>
<template>
  <div style="min-height: 200vh">
    <h3>首页轮播为自定义</h3>
    <h4>内页轮播</h4>
    <div class="block" style="overflow: hidden">
      <OCarousel class="slides2" effect="toggle" indicator-click active-class="current-slide" auto-play @change="onChange2" @before-change="onBeforeChange2">
        <OCarouselItem v-for="(s, idx) in carouselInfo2" :key="s">
          <OFigure class="img2" :src="s" />
          <div class="slide2-slide-content">
            <div class="title">this is title {{ idx }}</div>
            <div class="desc">{{ idx }}this is description, this is description</div>
          </div>
        </OCarouselItem>
      </OCarousel>
    </div>
    <h4>楼层轮播</h4>
    <div class="block" style="overflow: hidden">
      <OCarousel class="carousel-floor slide3" indicator-click click-to-switch data-o-theme="a.dark" @change="onChange3" @before-change="onBeforeChange3">
        <OCarouselItem v-for="s in carouselInfo3" :key="s" class="slide-item3">
          <OFigure class="img3" :src="s" />
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

.slides2 {
  width: 100%;
  margin: auto;
  height: 600px;
  overflow: hidden;
}

.slide2-slide-content {
  width: 100%;
  height: 100%;
  padding: 200px;
  box-sizing: border-box;
}
.title {
  font-size: 24px;
  color: var(--o-color-info1);
  font-weight: bold;
  --d: 10px;
}
.desc {
  margin-top: 12px;
  font-size: 16px;
  color: var(--o-color-info1);
  --d: 20px;
}

.img2 {
  overflow: hidden;
  height: 100%;
  width: 100%;
}

.slides2 {
  .img2 {
    position: absolute;
    z-index: -1;
  }
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

.current-slide {
  .title {
    animation: fade-up 400ms ease-in;
  }
  .desc {
    animation: fade-up 400ms ease-in;
  }
}

.slide3 {
  height: 200px;
  width: 50%;
  margin: auto;
  border-radius: 16px;
}
.slide-item3 {
  border-radius: 16px;
  width: 100%;
  height: 100%;
  padding-left: 8px;
  padding-right: 8px;
}

.img3 {
  border-radius: 16px;
  overflow: hidden;
  height: 100%;
  width: 100%;
  img {
    border-radius: 16px;
  }
}
</style>

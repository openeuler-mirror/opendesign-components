<script setup lang="ts">
import { OFigure } from '../../figure';
import '../../figure/style';
import { OSlides, OSlideItem } from '../index';
const slides = [
  'https://www.hiascend.com/p/resource/202303/95e2eec7ebe049628f402b04731b675b.png',
  'https://www.hiascend.com/p/resource/202303/2422385450af46418ca68b03b13e4494.png',
  'https://www.hiascend.com/p/resource/202303/4d94234f0bab4612883906a30d595391.png',
];

const onChange = (now: number, last: number) => {
  console.log(now, last);
};
</script>
<template>
  <h4>基本</h4>
  <section>
    <OSlides class="slides" auto-play @change="onChange">
      <OSlideItem v-for="s in slides" :key="s">
        <OFigure class="img" :src="s" />
      </OSlideItem>
    </OSlides>
  </section>
  <section style="overflow: hidden">
    <OSlides class="slides2" type="carousel" :auto-play="false" style="--slide-gap-x: 16px" @change="onChange">
      <OSlideItem v-for="s in slides" :key="s" class="slide-item2">
        <OFigure class="img" :src="s" />
      </OSlideItem>
    </OSlides>
  </section>
</template>
<style lang="scss">
.slides {
  height: 300px;
  width: 100%;
}
.slides2 {
  width: 50%;
  margin: auto;
  height: 200px;
  overflow: visible;
  // background-color: red;
}
.img {
  border-radius: 16px;
  height: 100%;
  width: 100%;
}
</style>

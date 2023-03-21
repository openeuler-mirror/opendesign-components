<script setup lang="ts">
import { OFigure } from '../../figure';
import '../../figure/style';
import { OSlides, OSlideItem } from '../index';
const slides = [
  'https://www.hiascend.com/p/resource/202303/95e2eec7ebe049628f402b04731b675b.png',
  'https://www.hiascend.com/p/resource/202303/2422385450af46418ca68b03b13e4494.png',
  'https://www.hiascend.com/p/resource/202303/4d94234f0bab4612883906a30d595391.png',
];
</script>
<template>
  <h4>基本</h4>
  <section>
    <OSlides class="slides">
      <OSlideItem v-for="s in slides" :key="s">
        <OFigure class="img" :src="s" />
      </OSlideItem>
    </OSlides>
  </section>
</template>
<style lang="scss">
.slides {
  height: 300px;
  width: 500px;
}
.img {
  width: 100%;
  height: 100%;
}
</style>

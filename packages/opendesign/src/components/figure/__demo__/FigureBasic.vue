<script setup lang="ts">
import { OFigure } from '../index';
const img = 'https://www.openeuler.org/img/banners/20230418-odd.png';
</script>
<template>
  <h4>基本</h4>
  <section>
    <OFigure class="img" :src="img" colorful />
    <OFigure class="img" :src="img" :ratio="16 / 9" fit="contain" colorful />
    <OFigure class="img" src="123" :ratio="16 / 9" fit="cover" colorful />
    <OFigure class="img" :src="img" :ratio="16 / 9" fit="cover" background colorful />
    <OFigure class="img" hoverable :src="img" />
    <OFigure class="img" href="openEuler" target="__blank" :src="img" />
  </section>
</template>
<style lang="scss">
.dlg-action {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
}
.img {
  width: 25%;
  border: 1px solid #ddd;
}
</style>

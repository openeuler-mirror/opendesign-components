<script setup lang="ts">
import { OFigure } from '../index';
const img = 'https://www.hiascend.com/p/resource/202303/0a66367d573f4369a6d160909c33fa6e.png';
</script>
<template>
  <h4>基本</h4>
  <section>
    <OFigure class="img" :src="img" />
    <OFigure class="img" :src="img" :ratio="16 / 9" fit="contain" />
    <OFigure class="img" src="123" :ratio="16 / 9" fit="cover" />
    <OFigure class="img" :src="img" :ratio="16 / 9" fit="cover" background />
    <OFigure class="img" hoverable :src="img" />
    <OFigure class="img" href="https://hiascend.com" target="__blank" :src="img" />
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
}
</style>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import { OFigure } from '../index';
const img1 = 'https://www.openeuler.org/assets/computing-arch_zh_pc.Bn12UMeP.jpg';
const img2 = 'https://www.openeuler.org/assets/blog-bg1.CWrw5LH1.jpg';
const img3 = 'https://www.openeuler.org/assets/finance.Bg8z3_B5.png';
const img4 = 'https://www.openeuler.org/img/banners/20241113-s3.png';
const img5 = 'https://www.openeuler.org/assets/404.Cx3U9-ep.png';
const img6 = 'https://www.openeuler.org/assets/blog-bg2.CNvN-qbF.jpg';

const onload = (key: string) => {
  console.log(key, 'loaded');
};

const onerror = (key: string) => {
  console.log(key, 'error');
};

const lazyOption = {
  rootMargin: '400px 0px 400px 0px',
};
const figureDom = useTemplateRef('keep-ratio-before-load');
onMounted(() => {
  const height = figureDom.value?.$el.getBoundingClientRect().height;
  if (height && height > 10) {
    console.log('成功：当 background 为真时 figure 懒加载完成前不能通过 ratio 属性保持宽高比的问题, height: ', height);
  } else {
    console.error('失败：当 background 为真时 figure 懒加载完成前不能通过 ratio 属性保持宽高比的问题, height: ', height);
  }
});
</script>
<template>
  <div style="margin-top: 400vh"></div>
  <h4>正常加载</h4>
  <section>
    <OFigure class="img" :src="img1" colorful @load="() => onload('img1')" @error="() => onerror('img1')" />
    <OFigure class="img" :src="img2" :ratio="16 / 9" fit="cover" background colorful @load="() => onload('img2')" @error="() => onerror('img2')" />
  </section>
  <h4>懒加载 lazy</h4>
  <section>
    <OFigure class="img" :src="img3" colorful @load="() => onload('img3')" lazy @error="() => onerror('img3')" preview />
    <OFigure class="img" :src="img4" :ratio="16 / 9" fit="cover" background colorful @load="() => onload('img4')" lazy @error="() => onerror('img4')" preview />
  </section>
  <h4>测试当 background 为真时 figure 懒加载完成前不能通过 ratio 属性保持宽高比的问题</h4>
  <OFigure ref="keep-ratio-before-load" class="img" :src="img4" :ratio="16 / 9" lazy background />

  <h4>懒加载 lazy= { rootMargin: '400px 0px 400px 0px' }</h4>
  <section>
    <OFigure class="img" :src="img5" colorful @load="() => onload('img5')" :lazy="lazyOption" @error="() => onerror('img5')" preview />
    <OFigure
      class="img"
      :src="img6"
      :ratio="16 / 9"
      fit="cover"
      background
      colorful
      @load="() => onload('img6')"
      :lazy="lazyOption"
      @error="() => onerror('img6')"
      preview
    />
    <img alt="" onerror="console.log('error')" />
  </section>
</template>
<style lang="scss" scoped>
.img {
  width: 45%;
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
#lazy-preview-ratio-check {
  border: 5px solid red;
}
</style>

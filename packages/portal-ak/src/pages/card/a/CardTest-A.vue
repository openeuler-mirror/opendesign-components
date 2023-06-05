<script setup lang="ts">
import { OCard } from '@components/index';

const cardInfo = {
  href: 'https://www.hiascend.com/',
  cover: 'https://www.hiascend.com/_static3/img_learning_ai.eddae00e.jpg',
  title: '这是卡片标题',
  detail: '内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本',
};
</script>

<template>
  <h3>测试</h3>
  <section>
    <OCard class="card-test is-bg" hoverable :cover="cardInfo.cover" :cover-ratio="1.32203" />

    <OCard class="card-test" hoverable :cover="cardInfo.cover" :cover-ratio="1.5" />
  </section>
</template>

<style lang="scss" scoped>
section {
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: nowrap;
}

.card-test {
  width: 30%;
}
</style>

<style lang="scss">
.is-bg {
  &.o-card {
    height: 200px;
  }
  .o-card-cover {
    position: relative;
  }

  .o-card-cover-img {
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>

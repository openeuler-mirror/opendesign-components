<script setup lang="ts">
import { OButton } from '../../button';
import '../../button/style';
import { OFigure } from '../../figure';
import '../../figure/style';
import { OResult } from '../index';
const img = 'https://www.openeuler.org/assets/404.6b1a0d2f.png';
</script>

<template>
  <h4>插槽</h4>
  <section>
    <OResult description="请修改配置项" status="danger">
      <template #icon>
        <OFigure class="img" :src="img" />
      </template>
      <template #title> 404 </template>
      <template #description> 页面走丢了 </template>
      <template #extra>
        <OButton>返回</OButton>
      </template>
    </OResult>
  </section>
</template>

<style lang="scss" scoped>
.img {
  width: 50%;
}
</style>

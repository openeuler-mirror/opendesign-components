<script setup lang="ts">
import { ref } from 'vue';
import { OLink } from '../index';
import { IconAdd, IconDone } from '../../icons';

const link = 'https://www.hiascend.com';

const onLinkClick = (e: MouseEvent) => {
  alert(`浮层${(e.target as HTMLElement).innerHTML}`);
};

const loading = ref(true);
const onLinkClick2 = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 3000);
};
</script>
<template>
  <section>
    <div>
      这是一段文本中，掺杂了一些
      <OLink :href="link">普通链接</OLink>和<OLink :href="link" type="primary">高亮链接</OLink>，可以使用
      <OLink :href="link" target="_blank">新页签打开的链接</OLink>
      ，当然也有
      <OLink :href="link" icon type="primary">图标链接1</OLink>和 <OLink :href="link" icon-arrow>图标链接2</OLink>，以及
      <OLink :href="link">
        <template #icon><IconDone /></template>自定义图标链接1 </OLink
      >和
      <OLink :href="link">
        自定义图标链接2<template #iconSuffix><IconAdd /></template> </OLink
      >，这个 <OLink :loading="loading" type="primary" @click="onLinkClick2"> 链接 </OLink>点击有loading效果，这个<OLink type="primary" @click="onLinkClick">
        链接 </OLink
      >点击会弹出弹窗。<OLink :href="link" disabled>禁用的链接</OLink>长这样，
    </div>
  </section>
</template>
<style lang="scss"></style>

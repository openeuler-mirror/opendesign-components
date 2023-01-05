<script setup lang="ts">
import { ref } from 'vue';
import { OLink } from '../index';
import { IconAdd, IconDone } from '../../icons';

const link = '#/link';

const onLinkClick = (e: MouseEvent) => {
  alert(`浮层${(e.target as HTMLElement).innerHTML}`);
};

const loading = ref(false);
const onLinkClick2 = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 3000);
};
</script>
<template>
  <h4>基本</h4>
  <section>
    <OLink :href="link">普通链接</OLink>
    <OLink :href="link" type="primary">高亮链接</OLink>
    <OLink :href="link" target="_blank">新页签打开的链接</OLink>
    <OLink :href="link" disabled>禁用链接</OLink>
  </section>

  <h4>图标</h4>
  <section>
    <OLink :href="link" icon-prefix type="primary">图标链接1</OLink>
    <OLink :href="link" icon-arrow>图标链接2</OLink>
    <OLink :href="link">
      <template #icon><IconDone /></template>自定义图标链接1
    </OLink>
    <OLink :href="link">
      自定义图标链接2<template #iconSuffix><IconAdd /></template>
    </OLink>
  </section>
  <h4>样式</h4>
  <section>
    <OLink :href="link">普通链接</OLink>
    <OLink :href="link" hoverable>hoverable链接</OLink>
    <OLink type="primary">primary链接</OLink>
    <OLink type="primary" hoverable>hoverable</OLink>
    <OLink type="warning">warning链接</OLink>
    <OLink type="warning" hoverable>hoverable</OLink>
    <OLink type="danger">danger链接</OLink>
    <OLink type="danger" hoverable>hoverable</OLink>
    <OLink type="success">success链接</OLink>
    <OLink type="success" hoverable>hoverable</OLink>
  </section>
  <h4>点击事件</h4>
  <section>
    <OLink :loading="!loading">loading</OLink>
    <OLink :loading="loading" type="primary" @click="onLinkClick2">点击Loading</OLink>
    <OLink type="primary" @click="onLinkClick">点击弹窗</OLink>
  </section>
</template>
<style lang="scss"></style>

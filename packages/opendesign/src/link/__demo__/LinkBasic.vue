<script setup lang="ts">
import { ref } from 'vue';
import { OLink } from '../index';
import { OIconAdd, OIconDone, OIconLink } from '../../icon-components';

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
    <OLink :href="link" target="_blank">新页签打开的链接</OLink>
    <OLink :href="link" disabled>禁用链接</OLink>
  </section>
  <h4>样式</h4>
  <section>
    <div class="row">
      <OLink :href="link">普通链接</OLink>
      <OLink :href="link" hover-bg>hover-bg</OLink>
      <OLink hover-underline>hover-underline</OLink>
      <OLink :href="link" disabled>禁用链接</OLink>
    </div>
    <div class="row">
      <OLink color="success">success链接</OLink>
      <OLink color="success" hover-bg>hover-bg</OLink>
      <OLink color="success" hover-underline>hover-underline</OLink>
      <OLink color="success" :href="link" disabled>禁用链接</OLink>
    </div>
    <div class="row">
      <OLink color="primary">primary链接</OLink>
      <OLink color="primary" hover-bg>hover-bg</OLink>
      <OLink color="primary" hover-underline>hover-underline</OLink>
      <OLink color="primary" :href="link" disabled>禁用链接</OLink>
    </div>
    <div class="row">
      <OLink color="warning">warning链接</OLink>
      <OLink color="warning" hover-bg>hover-bg</OLink>
      <OLink color="warning" hover-underline>hover-underline</OLink>
      <OLink color="warning" :href="link" disabled>禁用链接</OLink>
    </div>
    <div class="row">
      <OLink color="danger">danger链接</OLink>
      <OLink color="danger" hover-bg>hover-bg</OLink>
      <OLink color="danger" hover-underline>hover-underline</OLink>
      <OLink color="danger" :href="link" disabled>禁用链接</OLink>
    </div>
  </section>
  <h4>图标</h4>
  <section>
    <OLink :href="link" :icon="OIconLink" status="primary">icon-prefix</OLink>
    <OLink :href="link" suffix>icon-suffix</OLink>
    <OLink :href="link">
      <template #iconPrefix><OIconDone /></template>自定义图标链接slot:iconPrefix
    </OLink>
    <OLink :href="link">
      自定义图标链接slot:iconSuffix<template #iconSuffix><OIconAdd /></template>
    </OLink>
  </section>
  <h4>点击事件</h4>
  <section>
    <OLink :loading="!loading">loading</OLink>
    <OLink :loading="loading" status="primary" @click="onLinkClick2">点击Loading</OLink>
    <OLink status="primary" @click="onLinkClick">点击弹窗</OLink>
  </section>
</template>
<style lang="scss"></style>

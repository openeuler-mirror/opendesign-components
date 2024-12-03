<script setup lang="ts">
import { ref } from 'vue';
import { OLink } from '../index';
import { OIconAdd, OIconDone, OIconLink } from '../../icon-components';
import { OConfigProvider, LinkConfigT } from '../../config-provider';

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

const linkConfig: LinkConfigT = {
  click: (e, params, attrs) => {
    console.log(e, params, attrs);
  },
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
    <OLink :href="link" :icon="OIconLink" status="primary" size="large" hover-underline>icon-prefix</OLink>
    <OLink :href="link" suffix hover-underline>icon-suffix</OLink>
    <OLink :href="link">
      <template #icon><OIconDone /></template>自定义图标链接slot:iconPrefix
    </OLink>
    <OLink :href="link" hover-underline>
      自定义图标链接slot:iconSuffix<template #suffix><OIconAdd /></template>
    </OLink>
  </section>
  <h4>点击事件</h4>
  <section>
    <OLink :loading="!loading">loading</OLink>
    <OLink :loading="loading" status="primary" @click="onLinkClick2">点击Loading</OLink>
    <OLink status="primary" @click="onLinkClick">点击弹窗</OLink>
  </section>
  <h4>自定义标签</h4>
  <section>
    <OLink tag="button" :href="link">button标签</OLink>
    <OLink tag="span" :href="link" target="_blank">span标签</OLink>
    <OLink tag="button" :href="link" disabled>禁用button标签</OLink>
  </section>
  <h4>全局配置</h4>
  <section>
    <OConfigProvider :link="linkConfig">
      <OLink :loading="!loading">loading</OLink>
      <OLink :loading="loading" status="primary" @click="onLinkClick2" diy="123">点击Loading</OLink>
      <OLink status="primary" @click="onLinkClick">点击弹窗</OLink>
    </OConfigProvider>
  </section>
  <h4>换行</h4>
  <section>
    <div style="width: 200px">
      <OLink color="success" suffix hover-underline>
        The Forum gathered experts from various industries, who offered their insight into the smart manufacturing of today and tomorrow and presented success
        cases.
      </OLink>
    </div>
  </section>
</template>
<style lang="scss"></style>

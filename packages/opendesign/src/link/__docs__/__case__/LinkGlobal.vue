<docs lang="md">
<!-- zh-CN -->

### 全局配置

可以通过`global`属性来控制链接点击之后是否在全局生效。该属性需要搭配OConfigProvider组件使用，当`global`为true时（默认为true），链接点击之后，会触发全局配置的link回调。

<!-- en-US -->

### Global configuration

The `global` attribute can be used to control whether a link takes effect globally after being clicked. This attribute needs to be used in conjunction with the OConfigProvider component. When `global` is true (the default is true), a global configuration link callback will be triggered after the link is clicked.
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OLink, OConfigProvider, LinkConfigT } from '@opensig/opendesign';

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
  <div class="row">
    <OConfigProvider :link="linkConfig">
      <OLink :loading="!loading">loading</OLink>
      <OLink :loading="loading" status="primary" @click="onLinkClick2" diy="123">点击Loading</OLink>
      <OLink status="primary" @click="onLinkClick">点击弹窗</OLink>
    </OConfigProvider>
  </div>
</template>
<style scoped lang="scss"></style>

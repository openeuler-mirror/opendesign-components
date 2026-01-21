<docs lang="md">
<!-- zh-CN -->

### 加载中

加载中的链接，通过`loading`属性控制链接的加载状态。当`loading`为`true`时，链接会显示加载中的状态，同时`icon`插槽会被替换为加载中的图标。

<!-- en-US -->

### Loading

A link that is loading, controlled by the `loading` property. When `loading` is `true`, the link will display the loading state. The `icon` slot will be replaced with the loading icon.
</docs>
<script setup lang="ts">
import { reactive } from 'vue';
import { OIconEye } from '@opensig/opendesign';
import { OLink } from '@opensig/opendesign';
const rlt = reactive({
  loading1: false,
  loading2: false,
});
const showLoading = (key: keyof typeof rlt, val: boolean) => {
  rlt[key] = val;
  setTimeout(() => {
    rlt[key] = !val;
  }, 1000);
};
</script>
<template>
  <div class="row">
    <OLink color="primary" :loading="rlt.loading1" @click="showLoading('loading1', true)">查看更多</OLink>
    <OLink color="primary" :loading="rlt.loading2" @click="showLoading('loading2', true)">
      <template #icon><OIconEye /></template>
      点击icon替换成loading
    </OLink>
  </div>
</template>

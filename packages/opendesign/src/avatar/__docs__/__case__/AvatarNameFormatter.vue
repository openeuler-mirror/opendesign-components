<docs lang="md">
<!-- zh-CN -->

### 名称格式化

使用 `nameFormatter` 属性自定义名称渲染，接收包含 `name` 的对象，返回 VNode。

<!-- en-US -->

### Name Formatter

Use `nameFormatter` prop to customize name rendering, receives an object containing `name` and returns VNode.
</docs>
<script setup lang="ts">
import { h } from 'vue';

import { OAvatar, OAvatarGroup } from '@opensig/opendesign';

const customFormatter = ({ name }: { name?: string }) => {
  return h('div', { style: { color: '#fff', fontWeight: 'bold' } }, name);
};

const customFormatter2 = ({ name }: { name?: string }) => {
  return h('span', { style: { fontSize: '12px' } }, name?.slice(0, 2));
};

const urlList = [{ name: 'User 1' }, { name: 'Long Name' }, { name: 'Test' }];
</script>
<template>
  <div class="row">
    <OAvatar :size="56" name="Alice" :name-formatter="customFormatter" />
    <OAvatar :size="56" name="Bob" :name-formatter="customFormatter2" />
    <OAvatar :size="56" name="Charlie" />
    <OAvatarGroup :size="56" :url-list="urlList" :name-formatter="customFormatter2" />
  </div>
</template>

<docs lang="md">
<!-- zh-CN -->

### 评分提示

通过 `ORate` 组件的 `labels` 属性，可以设置评分提示文案。`labels` 属性接受一个数组，数组长度必须和 `count` 属性一致。

<!-- en-US -->

### Rating Tips

The `labels` prop of the `ORate` component can be used to set rating tip text. The `labels` prop accepts an array whose length must match the `count` prop.
</docs>

<script setup lang="ts">
import { ORate } from '@opensig/opendesign';

const labels = ['非常不满意', '不满意', ' 一般', '满意', '非常满意'];
</script>
<template>
  <ORate :labels="labels" size="large" color="primary" :count="labels.length" />
</template>

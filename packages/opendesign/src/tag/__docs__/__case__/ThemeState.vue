<docs lang="md">
<!-- zh-CN -->

#### 状态标签

<!-- en-US -->

#### State Tags
</docs>
<script setup lang="ts">
import { OTag } from '@opensig/opendesign';
</script>

<template>
  <div class="col">
    <OTag round="pill" color="success">已完成</OTag>
    <OTag round="pill" class="c-tag-unstart">未开始</OTag>
    <OTag round="pill" class="c-tag-processing">处理中</OTag>
    <OTag round="pill" color="danger">未通过</OTag>
  </div>
</template>

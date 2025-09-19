<docs lang="md">
<!-- zh-CN -->

#### 异常态

<!-- en-US -->

#### Abnormal state
</docs>
<script setup lang="ts">
import { OResult, OButton } from '@opensig/opendesign';
import imgSrc from '../../../../icons/svgs/fill/image-error.svg';

const title = '暂无工单';
const description = '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容';
</script>
<template>
  <div class="demo-result-wrap">
    <OResult :title="title" :description="description">
      <template #image>
        <img :src="imgSrc" alt="" />
      </template>
      <template #extra>
        <OButton size="large" color="primary" variant="solid" round="pill">在线提单</OButton>
      </template>
    </OResult>
  </div>
</template>

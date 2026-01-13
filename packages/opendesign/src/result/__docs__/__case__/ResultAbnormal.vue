<docs lang="md">
<!-- zh-CN -->

#### 异常态

<!-- en-US -->

#### Abnormal state
</docs>
<script setup lang="ts">
import { OResult, OButton, OIconWarning } from '@opensig/opendesign';

const title = '暂无工单';
const description = '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容';
</script>
<template>
  <div class="demo-result-wrap">
    <OResult :title="title" :description="description">
      <template #image>
        <OIconWarning style="color: var(--o-color-warning1)" />
      </template>
      <template #extra>
        <OButton size="large" color="primary" variant="solid" round="pill">在线提单</OButton>
      </template>
    </OResult>
  </div>
</template>

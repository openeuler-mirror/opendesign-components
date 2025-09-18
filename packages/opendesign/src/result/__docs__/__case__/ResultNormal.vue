<docs lang="md">
<!-- zh-CN -->

#### 结果态

<!-- en-US -->

#### Result state
</docs>
<script setup lang="ts">
import { OResult, OButton } from '@opensig/opendesign';

const title = '提交成功';
const description = '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容';
const status = 'success';
</script>
<template>
  <div class="demo-result-wrap">
    <OResult :title="title" :description="description" :status="status">
      <template #extra>
        <OButton class="extra-btn" size="large" variant="outline" color="primary" round="pill">返回首页</OButton>
        <OButton class="extra-btn" size="large" variant="outline" color="primary" round="pill">我的计划</OButton>
      </template>
    </OResult>
  </div>
</template>
<style lang="scss">
@use '../../../_styles/mixin.scss';
.demo-result-wrap {
  .extra-btn {
    margin: 0 8px;
    @include respond-to('<=pad') {
      margin: 0 6px;
    }
  }
}
</style>

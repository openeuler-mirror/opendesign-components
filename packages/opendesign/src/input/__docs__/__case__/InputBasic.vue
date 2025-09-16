<docs lang="md">
<!-- zh-CN -->

#### 基础输入框

<!-- en-US -->

#### Basic input box
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OInput } from '@opensig/opendesign';

const noTextInputVal = ref('');
const hasTextInputVal = ref('Hint');
</script>
<template>
  <div class="demo-input-basic-wrap">
    <div class="no-text">
      <h2 class="size-label no-text-label">无文本</h2>
      <div class="input-wrap">
        <span class="status-label"> Enabled </span>
        <OInput v-model="noTextInputVal" class="input-medium" size="large" round="pill" placeholder="Hint" />
      </div>
      <div class="input-wrap">
        <span class="status-label"> Disabled </span>
        <OInput v-model="noTextInputVal" class="input-medium" size="large" round="pill" placeholder="Hint" disabled />
      </div>
      <div class="input-wrap">
        <span class="status-label"> Error </span>
        <div class="error-wrap">
          <OInput v-model="noTextInputVal" class="input-medium" size="large" round="pill" placeholder="Hint" color="danger" />
          <div class="error-tip">输入内容有误，请重新输入正确内容</div>
        </div>
      </div>
    </div>
    <div class="has-text">
      <h2 class="size-label">有文本</h2>
      <div class="input-wrap"><OInput v-model="hasTextInputVal" class="input-medium" size="large" round="pill" :clearable="true" /></div>
      <div class="input-wrap"><OInput v-model="hasTextInputVal" class="input-medium" size="large" round="pill" :clearable="true" disabled /></div>
      <div class="input-wrap">
        <div class="error-wrap">
          <OInput v-model="hasTextInputVal" class="input-medium" size="large" round="pill" :clearable="true" color="danger" />
          <div class="error-tip">输入内容有误，请重新输入正确内容</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@use '../../../_styles/mixin.scss';

.demo-input-basic-wrap {
  display: flex;
  @include respond-to('<=pad_v') {
    flex-direction: column;
  }
  .size-label {
    margin-bottom: 32px;
    font-size: var(--o3-font_size-h1);
    line-height: var(--o3-line_height-h1);
    font-weight: normal;
    @include respond-to('<=pad_v') {
      margin-bottom: 16px;
    }
  }
  .no-text-label {
    padding-left: 140px;
    @include respond-to('<=laptop') {
      padding-left: 116px;
    }
    @include respond-to('<=pad_v') {
      margin-right: 0;
      padding-left: 0;
    }
  }
  .input-wrap {
    display: flex;
  }
  .status-label {
    flex-shrink: 0;
    width: 100px;
    margin-right: 40px;
    font-size: var(--o3-font_size-h2);
    line-height: var(--o3-line_height-h2);
    @include respond-to('<=laptop') {
      margin-right: 16px;
    }
    @include respond-to('<=pad_v') {
      display: none;
    }
  }
  .no-text {
    margin-right: 80px;
    @include respond-to('<=laptop') {
      margin-right: 16px;
    }
    @include respond-to('<=pad_v') {
      margin-right: 0;
      margin-bottom: 16px;
    }
  }
  .has-text {
    display: flex;
    flex-direction: column;
  }
  .input-medium {
    max-width: 320px;
    width: 320px;
    margin-bottom: 24px;
    @include respond-to('<=laptop') {
      width: 100%;
    }
    @include respond-to('<=pad_v') {
      flex: 1;
    }
  }
  .error-wrap {
    .input-medium {
      margin-bottom: 0;
    }
    @include respond-to('<=pad_v') {
      flex: 1;
    }
  }
  .error-tip {
    margin-top: 4px;
    padding-left: 16px;
    font-size: var(--o3-font_size-tip2);
    line-height: var(--o3-line_height-tip2);
    color: var(--o-color-danger1);
  }
}
</style>

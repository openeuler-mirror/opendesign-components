<docs lang="md">
<!-- zh-CN -->

#### 密码输入框

<!-- en-US -->

#### Password input box
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OInput } from '@opensig/opendesign';

const inputVal = ref('');
</script>
<template>
  <div class="demo-input-password-wrap">
    <OInput v-model="inputVal" class="input-medium" size="large" round="pill" placeholder="请输入密码" type="password" />
  </div>
</template>
<style scoped lang="scss">
@use '../../../_styles/mixin.scss';

.demo-input-password-wrap {
  .input-medium {
    width: 320px;
    @include respond-to('<=pad_v') {
      max-width: 320px;
      width: 100%;
    }
  }
}
</style>

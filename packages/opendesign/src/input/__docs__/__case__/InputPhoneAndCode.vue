<docs lang="md">
<!-- zh-CN -->

#### 手机与验证码输入框

<!-- en-US -->

#### Mobile phone and verification code input box.
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OInput, OIconChevronDown, OLink, OIconSuccess } from '@opensig/opendesign';

const inputVal = ref('');
const codeValue = ref('');
const verifingCode = ref(false);
const codeValid = ref(false);

const TIME = 20;
const sendLabel = ref('发送验证码');
const countdown = ref(TIME);
let countHandler = -1;

const doRequestSendCode = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};
const endCounting = () => {
  if (countHandler > -1) {
    clearInterval(countHandler);
    countHandler = -1;
    countdown.value = TIME;
    verifingCode.value = false;
    sendLabel.value = '发送验证码';
  }
};

const startCounting = () => {
  const run = () => {
    if (countdown.value === 0) {
      endCounting();
      sendLabel.value = '再次发送';
      return;
    } else {
      sendLabel.value = `重新获取(${countdown.value})`;
    }
    countdown.value--;
  };
  run();
  countHandler = window.setInterval(run, 1000);
};

const sendingCodeRequest = ref(false);
const sendCode = async () => {
  codeValue.value = '';
  codeValid.value = false;
  sendingCodeRequest.value = true;
  await doRequestSendCode();
  sendingCodeRequest.value = false;
  startCounting();
  verifingCode.value = true;
};
const verifyCode = (code: string) => {
  return code.length === 4 && code === '1234';
};
const onInput = (_e: Event, value: string) => {
  if (!verifingCode.value) {
    return;
  }
  codeValid.value = verifyCode(value);
};
</script>
<template>
  <div class="demo-input-phone-wrap">
    <OInput v-model="inputVal" class="input-medium" size="large" round="pill" placeholder="请输入手机号">
      <template #prefix>
        <span class="international-area-code">+86（中国）</span>
        <OIconChevronDown class="input-icon" />
      </template>
    </OInput>
    <div class="code-wrap">
      <OInput v-model="codeValue" class="input-medium code-input" size="large" round="pill" placeholder="请输入验证码" @input="onInput">
        <template #suffix>
          <OLink
            tag="button"
            :color="verifingCode ? 'normal' : 'primary'"
            :loading="sendingCodeRequest"
            :disabled="verifingCode || sendingCodeRequest"
            @click="sendCode"
          >
            {{ sendLabel }}
          </OLink>
        </template>
      </OInput>
      <div class="code-verify-result" v-if="codeValid"><OIconSuccess class="icon-success" />验证通过</div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@use '../../../_styles/mixin.scss';

.demo-input-phone-wrap {
  display: flex;
  @include respond-to('<=pad_v') {
    flex-direction: column;
  }
  .code-wrap {
    margin-left: var(--o-gap-4);
    @include respond-to('<=pad_v') {
      margin-left: 0;
      margin-top: var(--o-gap-4);
    }
  }
  .input-medium {
    width: 320px;
    @include respond-to('<=pad_v') {
      max-width: 320px;
      width: 100%;
    }
  }
  .code-input {
    width: 220px;
    @include respond-to('<=pad_v') {
      max-width: 320px;
      width: 100%;
    }
  }
  :deep(.o_input-prefix) {
    flex-shrink: 0;
    padding-right: var(--o-gap-2);
    border-right: 1px solid rgba(0, 0, 0, 0.15);
  }
  .code-verify-result {
    margin-top: 4px;
    margin-left: 16px;
    font-size: var(--o-font_size-tip2);
    line-height: var(--o-line_height-tip2);
  }
  .icon-success {
    color: var(--o-color-success1);
    font-size: var(--o-font_size-text1);
    margin-right: 2px;
  }
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import { OInput } from '../index';
import { OLink } from '../../link/index';
import { IconSuccess } from '../../_utils/icons';
import '../../link/style';

function doRequestSendCode() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
}

const codeValue = ref('');
const verifingCode = ref(false);
const codeValid = ref(false);

const TIME = 20;
const sendLabel = ref('发送验证码');
const countdown = ref(TIME);
let countHandler = -1;
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
const endCounting = () => {
  if (countHandler > -1) {
    clearInterval(countHandler);
    countHandler = -1;
    countdown.value = TIME;
    verifingCode.value = false;
    sendLabel.value = '发送验证码';
  }
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
  <h4>验证码输入框</h4>
  <div>验证码: 1234</div>
  <div class="block">
    <div>
      <OInput v-model="codeValue" @input="onInput" style="width: 200px">
        <template #suffix>
          <span
            :color="verifingCode ? 'normal' : 'primary'"
            :loading="sendingCodeRequest"
            tag="button"
            :disabled="verifingCode || sendingCodeRequest"
            @click="sendCode"
          >
            {{ sendLabel }}
          </span>
        </template>
      </OInput>
      <div class="code-verify-result" v-if="codeValid"><IconSuccess class="icon-success" />验证通过</div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
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
</style>

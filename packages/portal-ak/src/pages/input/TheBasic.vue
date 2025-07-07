<script setup lang="ts">
import { OInput, OLink, OIconLoading, OSelect, OOption } from '@opendesign-src/index';
import { computed, ref } from 'vue';
const val = ref('This is detail');
const val2 = ref('This is detail');

/**
 * 电话号码
 */
const tel = ref('');
// 电话号码是否合法
const isTelLegal = computed(() => {
  console.log(/^\d{11}$/.test(tel.value));

  return /^\d{11}$/.test(tel.value);
});
const areaCode = ref('86');
const areaCodeList = [
  { value: '86', label: '+86(中国)' },
  { value: '853', label: '+853(中国澳门)' },
  { value: '886', label: '+853(中国台湾)' },
  { value: '852', label: '+853(中国香港)' },
  { value: '33', label: '+33(法国)' },
];

/**
 * 验证码收发
 */
const verification = {
  getCode: '获取验证码',
  retryCode: '重新获取({{time}})',
};

const code = ref('');
const retryLabel = ref('');
const isGettingCode = ref(-1); // -1: 未发送； 0: 正在请求发送； 1：已完成请求发送

const retryText = (total: number) => {
  let time = total;
  retryLabel.value = verification.retryCode.replace('{{time}}', `${time}`);
  const timer = setInterval(() => {
    time--;
    if (time === 0) {
      retryLabel.value = '';
      isGettingCode.value = -1;
      clearInterval(timer);
    } else {
      retryLabel.value = verification.retryCode.replace('{{time}}', `${time}`);
    }
  }, 1000);
};
const startGettingCode = () => {
  // request to send code ....

  isGettingCode.value = 0;
  setTimeout(() => {
    isGettingCode.value = 1;
    retryText(60);
  }, 500);
};
</script>
<template>
  <h3>类型 & 尺寸</h3>
  <section>
    <span style="width: 40px"> M:</span>
    <OInput style="width: 240px" placeholder="hint" />
    <OInput v-model="val" style="width: 240px" placeholder="hint" />
    <OInput style="width: 240px" type="password" placeholder="请输入密码" />
    <OInput v-model="val2" style="width: 240px" type="password" placeholder="请输入密码" />
    <OInput v-model="val2" style="width: 240px" type="password" placeholder="请输入密码" />
  </section>
  <section>
    <span style="width: 40px"> L:</span>
    <OInput style="width: 240px" size="large" placeholder="hint" />
    <OInput v-model="val" style="width: 240px" size="large" placeholder="hint" />
    <OInput style="width: 240px" type="password" size="large" placeholder="请输入密码" />
    <OInput v-model="val2" style="width: 240px" type="password" size="large" placeholder="请输入密码" />
  </section>
  <h3>禁用</h3>
  <section>
    <OInput style="width: 240px" placeholder="hint" disabled />
    <OInput v-model="val" style="width: 240px" placeholder="hint" disabled />
    <OInput style="width: 240px" type="password" placeholder="请输入密码" disabled />
    <OInput v-model="val2" style="width: 240px" type="password" placeholder="请输入密码" disabled />
  </section>
  <h3>Error</h3>
  <section>
    <OInput style="width: 240px" placeholder="hint" color="danger" />
    <OInput v-model="val" style="width: 240px" placeholder="hint" color="danger" />
    <OInput style="width: 240px" size="large" placeholder="hint" color="danger" />
    <OInput v-model="val2" style="width: 240px" size="large" placeholder="hint" color="danger" disabled />
  </section>
  <h3>其他组合</h3>
  <section>
    <span style="width: 80px"> 密码框:</span>
    <OInput v-model="val2" style="width: 240px" type="password" placeholder="请输入密码" size="large" :clearable="false" />
  </section>
  <section>
    <span style="width: 80px"> 验证码:</span>

    <OInput v-model="tel" size="large" class="tel-input" placeholder="请输入11位手机号" :clearable="false" style="width: 320px">
      <template #prepend>
        <OSelect v-model="areaCode" variant="text" class="area-select" style="width: 150px; padding-right: 8px">
          <OOption v-for="item in areaCodeList" :key="item.value" :value="item.value" :label="item.label" />
        </OSelect>
      </template>
    </OInput>
    <OInput v-model="code" size="large" class="code-input" :clearable="false" style="width: 220px">
      <template #suffix>
        <div class="c-input-verify-code">
          <OLink v-if="isGettingCode === -1" :disabled="!isTelLegal" @click="startGettingCode">{{ verification.getCode }}</OLink>
          <OIconLoading v-else-if="isGettingCode === 0" class="o-rotating code-loading" />
          <span v-else-if="isGettingCode === 1" class="retry-tip">{{ retryLabel }}</span>
        </div>
      </template>
    </OInput>
  </section>
</template>
<style lang="scss"></style>

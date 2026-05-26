<docs lang="md">
<!-- zh-CN -->

### 插槽 & 方法 & 事件(打开控制台查看)

`focus(open?)` 方法支持传入 `open` 参数（默认 `true`），控制调用时是否同时打开面板。切换开关后点击 **focus** 按钮观察效果。

<!-- en-US -->

### Slots & Methods & Events(open console to observe)

`focus(open?)` accepts an optional `open` parameter (default `true`) to control whether the panel opens when called. Toggle the switch then click **focus** to observe.
</docs>
<script setup lang="ts">
import { nextTick, ref } from 'vue';
import { OTimePicker, OButton, OLink, OSwitch } from '@opensig/opendesign';

const timePickerRef = ref<InstanceType<typeof OTimePicker>>();
const val1 = ref('');
const openOnFocus = ref(true);

const handleChange = (newVal: string | undefined, oldVal: string | undefined) => {
  console.log('changed', { newVal, oldVal });
};
const handleFocus = () => {
  console.log('focused!');
};
const handleBlur = () => {
  console.log('blurred!');
};
const handleClear = () => {
  console.log('cleared!');
};
const handlePressEnter = () => {
  console.log('enter pressed!');
};

const handleNowClick = async ({ setValue, emitChange }: { setValue?: (value?: string) => void; emitChange: () => void }) => {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  setValue?.(`${h}:${m}:${s}`);
  await nextTick();
  emitChange();
};
</script>
<template>
  <div class="demo-time-picker-wrap">
    <div class="operations">
      <span>调用 focus 时打开面板</span><OSwitch v-model="openOnFocus" />
      <OButton color="primary" variant="solid" @click="() => timePickerRef?.focus(openOnFocus)">focus</OButton>
      <OButton color="primary" variant="solid" @click="() => timePickerRef?.blur()">blur</OButton>
      <OButton color="primary" variant="solid" @click="() => timePickerRef?.clear()">clear</OButton>
    </div>
    <OTimePicker
      ref="timePickerRef"
      v-model="val1"
      size="large"
      clearable
      @focus="handleFocus"
      @blur="handleBlur"
      @clear="handleClear"
      @press-enter="handlePressEnter"
      @change="handleChange"
    >
      <template #shortcut="{ setValue, emitChange }">
        <OLink :hover-underline="false" @click="handleNowClick({ setValue, emitChange })">此刻</OLink>
      </template>
    </OTimePicker>
  </div>
</template>
<style lang="scss">
.demo-time-picker-wrap {
  .operations {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
  }
}
</style>

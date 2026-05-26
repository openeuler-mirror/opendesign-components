<docs lang="md">
<!-- zh-CN -->

### 事件

`ODateTimePicker` 支持以下事件：

- `change(newVal, oldVal)` — 值变更时触发
- `focus(evt)` — 输入框聚焦时触发
- `blur` — 输入框失焦时触发
- `clear(evt)` — 点击清除按钮时触发
- `press-enter` — 按下回车键时触发

所有事件均会在浏览器 console 中打印。

<!-- en-US -->

### Events

`ODateTimePicker` supports the following events:

- `change(newVal, oldVal)` — fires when the value changes
- `focus(evt)` — fires when the input is focused
- `blur` — fires when the input loses focus
- `clear(evt)` — fires when the clear button is clicked
- `press-enter` — fires when Enter key is pressed

All events are logged to the browser console.
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import dayjs from 'dayjs';
import { ODateTimePicker, OForm, OFormItem } from '@opensig/opendesign';
import { useScreen } from '@/utils/useScreen';

const { lePadV } = useScreen();

const val = ref<number>();

const onFocus = (evt: FocusEvent) => {
  console.log('[datetime-picker] focus', evt);
};
const onBlur = () => {
  console.log('[datetime-picker] blur');
};
const onChange = (newVal: number | undefined, oldVal: number | undefined) => {
  console.log('[datetime-picker] change', { newVal, oldVal });
};
const onClear = (evt?: Event) => {
  console.log('[datetime-picker] clear', evt);
};
const onPressEnter = () => {
  console.log('[datetime-picker] pressEnter');
};
</script>
<template>
  <OForm :layout="lePadV ? 'v' : 'h'" label-width="120px">
    <OFormItem label="日期时间">
      <ODateTimePicker v-model="val" clearable @focus="onFocus" @blur="onBlur" @change="onChange" @clear="onClear" @press-enter="onPressEnter" />
      <template #extra>
        modelValue: {{ val }} <u v-if="val">{{ dayjs(val).format('YYYY-MM-DD HH:mm:ss') }}</u>
      </template>
    </OFormItem>
  </OForm>
</template>

<docs lang="md">
<!-- zh-CN -->

### 事件

`ODateRangePicker` 支持以下事件：

- `change(start, end)` — 值变更时触发（选择结束日期或清空时触发）
- `focus(evt)` — 输入框聚焦时触发
- `blur` — 输入框失焦时触发
- `clear(evt)` — 点击清除按钮时触发

所有事件均会在浏览器 console 中打印。

移动端提示：建议使用两个独立的选择器分别设置开始和结束时间，并通过 `minDate` / `maxDate` 约束来保证时间顺序，以获得更好的交互体验。

<!-- en-US -->

### Events

`ODateRangePicker` supports the following events:

- `change(start, end)` — fires when value changes (when end date selected or cleared)
- `focus(evt)` — fires when input is focused
- `blur` — fires when input loses focus
- `clear(evt)` — fires when clear button is clicked

All events are logged to the browser console.

Mobile Tip: We recommend using two separate pickers for start and end times, using `minDate` / `maxDate` constraints to ensure chronological order, for better interaction experience.
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import dayjs from 'dayjs';
import { ODateRangePicker, ODatePicker, OForm, OFormItem } from '@opensig/opendesign';
import { useScreen } from '@/utils/useScreen';

const { lePadV } = useScreen();

const start = ref<number>();
const end = ref<number>();

const onFocus = (evt: FocusEvent) => {
  console.log('[date-range-picker] focus', evt);
};
const onBlur = () => {
  console.log('[date-range-picker] blur');
};
const onChange = (newStart: number | undefined, newEnd: number | undefined) => {
  console.log('[date-range-picker] change', { newStart, newEnd });
};
const onClear = (evt?: Event) => {
  console.log('[date-range-picker] clear', evt);
};
const onStartChange = (v: number | undefined) => {
  console.log('[date-range-picker] change', { newStart: v, newEnd: end.value });
};
const onEndChange = (v: number | undefined) => {
  console.log('[date-range-picker] change', { newStart: start.value, newEnd: v });
};
</script>
<template>
  <OForm :layout="lePadV ? 'v' : 'h'" label-width="120px">
    <template v-if="!lePadV">
      <OFormItem label="日期范围">
        <ODateRangePicker v-model:start="start" v-model:end="end" clearable @focus="onFocus" @blur="onBlur" @change="onChange" @clear="onClear" />
        <template #extra>
          start: {{ start }} <u v-if="start">{{ dayjs(start).format('YYYY-MM-DD HH:mm:ss') }}</u> &nbsp; end: {{ end }}
          <u v-if="end">{{ dayjs(end).format('YYYY-MM-DD HH:mm:ss') }}</u>
        </template>
      </OFormItem>
    </template>
    <template v-else>
      <OFormItem label="开始">
        <ODatePicker v-model="start" :max-date="end" clearable @focus="onFocus" @blur="onBlur" @change="onStartChange" @clear="onClear" />
        <template #extra
          >{{ start }} <u v-if="start">{{ dayjs(start).format('YYYY-MM-DD HH:mm:ss') }}</u></template
        >
      </OFormItem>
      <OFormItem label="结束">
        <ODatePicker v-model="end" :min-date="start" clearable @focus="onFocus" @blur="onBlur" @change="onEndChange" @clear="onClear" />
        <template #extra
          >{{ end }} <u v-if="end">{{ dayjs(end).format('YYYY-MM-DD HH:mm:ss') }}</u></template
        >
      </OFormItem>
    </template>
  </OForm>
</template>

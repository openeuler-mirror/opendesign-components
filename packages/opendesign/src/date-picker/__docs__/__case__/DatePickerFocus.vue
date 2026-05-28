<docs lang="md">
<!-- zh-CN -->

### focus 方法参数

所有日期 / 时间选择器系列均支持 `focus(open?)` 方法：

- `open` 默认为 `true`，调用 `focus()` 时同时打开面板
- 传入 `false` 时仅聚焦输入框，不打开面板

切换下方开关后点击 **focus** 按钮观察效果。

<!-- en-US -->

### focus method parameter

All date/time picker variants support `focus(open?)`:

- `open` defaults to `true` — calling `focus()` also opens the panel
- Pass `false` to focus the input without opening the panel

Toggle the switch below then click **focus** to observe.
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { ODatePicker, ODateRangePicker, OSwitch, OButton, OForm, OFormItem } from '@opensig/opendesign';
import { useScreen } from '@/utils/useScreen';

const { lePadV } = useScreen();

const openOnFocus = ref(true);

const datePickerRef = ref<InstanceType<typeof ODatePicker>>();
const rangePickerRef = ref<InstanceType<typeof ODateRangePicker>>();
const startPickerRef = ref<InstanceType<typeof ODatePicker>>();

const val = ref<number>();
const start = ref<number>();
const end = ref<number>();
</script>
<template>
  <div class="demo-picker-focus">
    <div class="demo-picker-focus-bar">
      <span>调用 focus 时打开面板</span><OSwitch v-model="openOnFocus" />
      <OButton @click="datePickerRef?.focus(openOnFocus)">focus 日期选择器</OButton>
      <OButton @click="lePadV ? startPickerRef?.focus(openOnFocus) : rangePickerRef?.focus(openOnFocus)">focus 范围选择器</OButton>
    </div>
    <OForm :layout="lePadV ? 'v' : 'h'" label-width="80px">
      <OFormItem label="日期">
        <ODatePicker ref="datePickerRef" v-model="val" />
      </OFormItem>
      <template v-if="!lePadV">
        <OFormItem label="日期范围">
          <ODateRangePicker ref="rangePickerRef" v-model:start="start" v-model:end="end" />
        </OFormItem>
      </template>
      <template v-else>
        <OFormItem label="开始">
          <ODatePicker ref="startPickerRef" v-model="start" :max-date="end" />
        </OFormItem>
        <OFormItem label="结束">
          <ODatePicker v-model="end" :min-date="start" />
        </OFormItem>
      </template>
    </OForm>
  </div>
</template>
<style lang="scss">
.demo-picker-focus {
  .demo-picker-focus-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }
}
</style>

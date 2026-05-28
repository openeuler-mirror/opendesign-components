<docs lang="md">
<!-- zh-CN -->

### 限制日期范围

通过 `disabledDate` 回调函数精确禁用特定日期，或通过 `minDate` / `maxDate` 快速限定可选日期范围。

移动端提示：建议使用两个独立的选择器分别设置开始和结束时间，并通过 `minDate` / `maxDate` 约束来保证时间顺序，以获得更好的交互体验。

<!-- en-US -->

### Disabled Date Range

Use `disabledDate` callback to disable specific dates, or use `minDate` / `maxDate` for quick date range constraints.

Mobile Tip: We recommend using two separate pickers for start and end times, using `minDate` / `maxDate` constraints to ensure chronological order, for better interaction experience.
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import dayjs from 'dayjs';
import { ODateRangePicker, ODateTimeRangePicker, ODatePicker, ODateTimePicker, OForm, OFormItem } from '@opensig/opendesign';
import { useScreen } from '@/utils/useScreen';

const { lePadV } = useScreen();

const start1 = ref<number>();
const end1 = ref<number>();
const start2 = ref<number>();
const end2 = ref<number>();
const start3 = ref<number>();
const end3 = ref<number>();

const disabledDate = ({ date }: { date: Date }) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

const thisWeekStart = dayjs().startOf('week').valueOf();
const thisWeekEnd = dayjs().endOf('week').valueOf();
const thisMonthStart = dayjs().startOf('month').valueOf();
</script>
<template>
  <OForm :layout="lePadV ? 'v' : 'h'" label-width="220px">
    <!-- disabledDate（禁用周末） -->
    <template v-if="!lePadV">
      <OFormItem label="disabledDate（禁用周末）">
        <ODateRangePicker v-model:start="start1" v-model:end="end1" :disabled-date="disabledDate" clearable />
        <template #extra>
          start: {{ start1 }} <u v-if="start1">{{ dayjs(start1).format('YYYY-MM-DD HH:mm:ss') }}</u> &nbsp; end: {{ end1 }}
          <u v-if="end1">{{ dayjs(end1).format('YYYY-MM-DD HH:mm:ss') }}</u>
        </template>
      </OFormItem>
    </template>
    <template v-else>
      <OFormItem label="开始">
        <ODatePicker v-model="start1" :disabled-date="disabledDate" :max-date="end1" clearable />
        <template #extra
          >{{ start1 }} <u v-if="start1">{{ dayjs(start1).format('YYYY-MM-DD HH:mm:ss') }}</u></template
        >
      </OFormItem>
      <OFormItem label="结束">
        <ODatePicker v-model="end1" :disabled-date="disabledDate" :min-date="start1" clearable />
        <template #extra
          >{{ end1 }} <u v-if="end1">{{ dayjs(end1).format('YYYY-MM-DD HH:mm:ss') }}</u></template
        >
      </OFormItem>
    </template>

    <!-- minDate / maxDate（本周） -->
    <template v-if="!lePadV">
      <OFormItem label="minDate / maxDate（本周）">
        <ODateRangePicker v-model:start="start2" v-model:end="end2" :min-date="thisWeekStart" :max-date="thisWeekEnd" clearable />
        <template #extra>
          start: {{ start2 }} <u v-if="start2">{{ dayjs(start2).format('YYYY-MM-DD HH:mm:ss') }}</u> &nbsp; end: {{ end2 }}
          <u v-if="end2">{{ dayjs(end2).format('YYYY-MM-DD HH:mm:ss') }}</u>
        </template>
      </OFormItem>
    </template>
    <template v-else>
      <OFormItem label="开始">
        <ODatePicker v-model="start2" :min-date="thisWeekStart" :max-date="end2 ?? thisWeekEnd" clearable />
        <template #extra
          >{{ start2 }} <u v-if="start2">{{ dayjs(start2).format('YYYY-MM-DD HH:mm:ss') }}</u></template
        >
      </OFormItem>
      <OFormItem label="结束">
        <ODatePicker v-model="end2" :min-date="start2 ?? thisWeekStart" :max-date="thisWeekEnd" clearable />
        <template #extra
          >{{ end2 }} <u v-if="end2">{{ dayjs(end2).format('YYYY-MM-DD HH:mm:ss') }}</u></template
        >
      </OFormItem>
    </template>

    <!-- minDate only（本月起） -->
    <template v-if="!lePadV">
      <OFormItem label="minDate only（本月起）">
        <ODateTimeRangePicker v-model:start="start3" v-model:end="end3" :min-date="thisMonthStart" clearable />
        <template #extra>
          start: {{ start3 }} <u v-if="start3">{{ dayjs(start3).format('YYYY-MM-DD HH:mm:ss') }}</u> &nbsp; end: {{ end3 }}
          <u v-if="end3">{{ dayjs(end3).format('YYYY-MM-DD HH:mm:ss') }}</u>
        </template>
      </OFormItem>
    </template>
    <template v-else>
      <OFormItem label="开始">
        <ODateTimePicker v-model="start3" :min-date="thisMonthStart" :max-date="end3" clearable />
        <template #extra
          >{{ start3 }} <u v-if="start3">{{ dayjs(start3).format('YYYY-MM-DD HH:mm:ss') }}</u></template
        >
      </OFormItem>
      <OFormItem label="结束">
        <ODateTimePicker v-model="end3" :min-date="start3 ?? thisMonthStart" clearable />
        <template #extra
          >{{ end3 }} <u v-if="end3">{{ dayjs(end3).format('YYYY-MM-DD HH:mm:ss') }}</u></template
        >
      </OFormItem>
    </template>
  </OForm>
</template>

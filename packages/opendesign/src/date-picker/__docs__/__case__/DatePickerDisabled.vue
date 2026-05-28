<docs lang="md">
<!-- zh-CN -->

### 限制日期选择范围

通过 `disabledDate` 回调函数精确禁用特定日期；通过 `disabledMonth` 禁用特定月份；通过 `disabledYear` 禁用特定年份。

回调参数中的 `month` 为 0-indexed（0 = 一月，11 = 十二月），与 JavaScript `Date.prototype.getMonth()` 一致。

也可以通过 `min-date`、`max-date` 快速限定可选日期范围。

<!-- en-US -->

### Disabled Dates

Use `disabledDate` callback to disable specific dates; use `disabledMonth` to disable specific months; use `disabledYear` to disable specific years.

The `month` in callback params is 0-indexed (0 = January, 11 = December), consistent with JavaScript's `Date.prototype.getMonth()`.

Or use `min-date` / `max-date` for quick date range constraints.
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { ODatePicker, OMonthPicker, OYearPicker, OForm, OFormItem } from '@opensig/opendesign';
import dayjs from 'dayjs';
import { useScreen } from '@/utils/useScreen';

const formatTimestamp = (val?: number | string) => {
  return val ? dayjs(val).format('YYYY-MM-DD HH:mm:ss') : '';
};

const { lePadV } = useScreen();

const val1 = ref<number>();
const val2 = ref<number>();
const val3 = ref<number>();
const val4 = ref<number>();
const val5 = ref<number>();

const disabledDate = ({ date }: { date: Date }) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

// 禁用偶数月（month 为 0-indexed，0=一月；month % 2 === 1 即禁用 2、4、6、8、10、12月）
const disabledMonth = ({ month }: { month: number }) => {
  return month % 2 === 1;
};

// 禁用过去的年份
const disabledYear = ({ year }: { year: number }) => {
  return year < new Date().getFullYear();
};

const thisWeekStart = dayjs().startOf('week').valueOf();
const thisWeekEnd = dayjs().endOf('week').valueOf();
const thisMonthStart = dayjs().startOf('month').valueOf();
</script>
<template>
  <OForm :layout="lePadV ? 'v' : 'h'" label-width="220px">
    <OFormItem label="disabledDate（禁用周末）">
      <ODatePicker v-model="val1" clearable :disabled-date="disabledDate" />
      <template #extra>
        {{ val1 }} <u v-if="val1">{{ formatTimestamp(val1) }}</u>
      </template>
    </OFormItem>
    <OFormItem label="disabledMonth（禁用偶数月）">
      <OMonthPicker v-model="val2" clearable :disabled-month="disabledMonth" />
      <template #extra>
        {{ val2 }} <u v-if="val2">{{ formatTimestamp(val2) }}</u>
      </template>
    </OFormItem>
    <OFormItem label="disabledYear（禁用过去年份）">
      <OYearPicker v-model="val3" clearable :disabled-year="disabledYear" />
      <template #extra>
        {{ val3 }} <u v-if="val3">{{ formatTimestamp(val3) }}</u>
      </template>
    </OFormItem>
    <OFormItem label="min-date / max-date">
      <ODatePicker v-model="val4" clearable :min-date="thisWeekStart" :max-date="thisWeekEnd" />
      <template #extra>
        {{ val4 }} <u v-if="val4">{{ formatTimestamp(val4) }}</u>
      </template>
    </OFormItem>
    <OFormItem label="min-date only">
      <ODatePicker v-model="val5" clearable :min-date="thisMonthStart" />
      <template #extra>
        {{ val5 }} <u v-if="val5">{{ formatTimestamp(val5) }}</u>
      </template>
    </OFormItem>
  </OForm>
</template>

<docs lang="md">
<!-- zh-CN -->

### 时间约束

通过 `hourStep` / `minuteStep` / `secondStep` 设置时间步长；通过 `disabledHours` / `disabledMinutes` / `disabledSeconds` 回调函数精确禁用特定时间；通过 `minTime` / `maxTime` 快速限定可选时间范围。

当设置了 `minDate` / `maxDate` 时，选择边界日期时时间范围会自动受限（如选择 minDate 当天，时间只能在 minTime 之后）。

<!-- en-US -->

### Time Constraints

Use `hourStep` / `minuteStep` / `secondStep` to set time steps; use `disabledHours` / `disabledMinutes` / `disabledSeconds` callback to disable specific times; use `minTime` / `maxTime` for quick time range constraints.

When `minDate` / `maxDate` is set, the time range is automatically constrained when selecting boundary dates (e.g., when selecting minDate day, time must be after minTime).
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import dayjs from 'dayjs';
import { ODateTimePicker, OForm, OFormItem } from '@opensig/opendesign';
import { useScreen } from '@/utils/useScreen';

const { lePadV } = useScreen();

const val1 = ref<number>();
const val2 = ref<number>();
const val3 = ref<number>();
const val4 = ref<number>();
const val5 = ref<number>();

const disabledHours = () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const disabledMinutes = (hour: number) => {
  if (hour === 12) return [0, 15, 30, 45];
  return [];
};
const disabledSeconds = () => [0, 10, 20, 30, 40, 50];

const todayStart = dayjs().startOf('day').valueOf();
const todayEnd = dayjs().endOf('day').valueOf();
</script>
<template>
  <OForm :layout="lePadV ? 'v' : 'h'" label-width="220px">
    <OFormItem label="hourStep / minuteStep / secondStep">
      <ODateTimePicker v-model="val1" :hour-step="2" :minute-step="15" :second-step="10" clearable />
      <template #extra>
        {{ val1 }} <u v-if="val1">{{ dayjs(val1).format('YYYY-MM-DD HH:mm:ss') }}</u>
      </template>
    </OFormItem>
    <OFormItem label="disabledHours / disabledMinutes / disabledSeconds">
      <ODateTimePicker v-model="val2" :disabled-hours="disabledHours" :disabled-minutes="disabledMinutes" :disabled-seconds="disabledSeconds" clearable />
      <template #extra>
        {{ val2 }} <u v-if="val2">{{ dayjs(val2).format('YYYY-MM-DD HH:mm:ss') }}</u>
      </template>
    </OFormItem>
    <OFormItem label="minTime='09:00:00' / maxTime='18:00:00'">
      <ODateTimePicker v-model="val3" min-time="09:00:00" max-time="18:00:00" clearable />
      <template #extra>
        {{ val3 }} <u v-if="val3">{{ dayjs(val3).format('YYYY-MM-DD HH:mm:ss') }}</u>
      </template>
    </OFormItem>
    <OFormItem label="minDate + minTime（今天 09:00 后）">
      <ODateTimePicker v-model="val4" :min-date="todayStart" min-time="09:00:00" clearable />
      <template #extra>
        {{ val4 }} <u v-if="val4">{{ dayjs(val4).format('YYYY-MM-DD HH:mm:ss') }}</u>
      </template>
    </OFormItem>
    <OFormItem label="maxDate + maxTime（今天 18:00 前）">
      <ODateTimePicker v-model="val5" :max-date="todayEnd" max-time="18:00:00" clearable />
      <template #extra>
        {{ val5 }} <u v-if="val5">{{ dayjs(val5).format('YYYY-MM-DD HH:mm:ss') }}</u>
      </template>
    </OFormItem>
  </OForm>
</template>

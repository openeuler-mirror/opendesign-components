<docs lang="md">
<!-- zh-CN -->

### 选择器类型

根据业务需要选择对应的选择器组件：

- `OYearPicker` — 仅选年份
- `OMonthPicker` — 选年+月
- `ODatePicker` — 选年+月+日（默认）
- `ODateTimePicker` — 选日期+时间

<!-- en-US -->

### Picker Types

Choose the appropriate picker component based on your needs:

- `OYearPicker` — year only
- `OMonthPicker` — year + month
- `ODatePicker` — year + month + day (default)
- `ODateTimePicker` — date + time
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import dayjs from 'dayjs';
import { OYearPicker, OMonthPicker, ODatePicker, ODateTimePicker, OForm, OFormItem } from '@opensig/opendesign';
import { useScreen } from '@/utils/useScreen';

const { lePadV } = useScreen();

const val1 = ref<number>();
const val2 = ref<number>();
const val3 = ref<number>();
const val4 = ref<number>();
</script>
<template>
  <OForm :layout="lePadV ? 'v' : 'h'" label-width="140px">
    <OFormItem label="OYearPicker">
      <OYearPicker v-model="val1" clearable />
      <template #extra>
        {{ val1 }} <u v-if="val1">{{ dayjs(val1).format('YYYY-MM-DD HH:mm:ss') }}</u>
      </template>
    </OFormItem>
    <OFormItem label="OMonthPicker">
      <OMonthPicker v-model="val2" clearable />
      <template #extra>
        {{ val2 }} <u v-if="val2">{{ dayjs(val2).format('YYYY-MM-DD HH:mm:ss') }}</u>
      </template>
    </OFormItem>
    <OFormItem label="ODatePicker">
      <ODatePicker v-model="val3" clearable />
      <template #extra>
        {{ val3 }} <u v-if="val3">{{ dayjs(val3).format('YYYY-MM-DD HH:mm:ss') }}</u>
      </template>
    </OFormItem>
    <OFormItem label="ODateTimePicker">
      <ODateTimePicker v-model="val4" clearable />
      <template #extra>
        {{ val4 }} <u v-if="val4">{{ dayjs(val4).format('YYYY-MM-DD HH:mm:ss') }}</u>
      </template>
    </OFormItem>
  </OForm>
</template>

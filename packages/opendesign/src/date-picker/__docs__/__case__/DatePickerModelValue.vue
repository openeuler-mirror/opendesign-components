<docs lang="md">
<!-- zh-CN -->

### 绑定值格式

`modelValue` 支持多种输入格式（格式化字符串、毫秒时间戳数字、日期对象），均会被正确解析。

输出格式由 `valueFormat` 控制：`'x'`（默认）输出毫秒时间戳；也可指定日期格式字符串如 `'YYYY-MM-DD'` 输出格式化字符串。

<!-- en-US -->

### Bound Value Format

`modelValue` accepts multiple input formats (formatted string, millisecond timestamp, Date object), all parsed correctly.

Output format is controlled by `valueFormat`: `'x'` (default) outputs a millisecond timestamp; a format string like `'YYYY-MM-DD'` outputs a formatted string.
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import dayjs from 'dayjs';
import { ODatePicker, OForm, OFormItem } from '@opensig/opendesign';
import { useScreen } from '@/utils/useScreen';

const { lePadV } = useScreen();

const val1 = ref<number>();
const val2 = ref<string>();
const val3 = ref<string | number>('2024-08-01');
</script>
<template>
  <OForm :layout="lePadV ? 'v' : 'h'" label-width="220px">
    <OFormItem label="valueFormat='x'（默认）">
      <ODatePicker v-model="val1" clearable />
      <template #extra>
        {{ val1 }} <u v-if="val1">{{ dayjs(val1).format('YYYY-MM-DD HH:mm:ss') }}</u>
      </template>
    </OFormItem>
    <OFormItem label="valueFormat='YYYY-MM-DD'">
      <ODatePicker v-model="val2" value-format="YYYY-MM-DD" clearable />
      <template #extra>
        {{ val2 }} <u v-if="val2">{{ dayjs(val2).format('YYYY-MM-DD HH:mm:ss') }}</u>
      </template>
    </OFormItem>
    <OFormItem label="字符串初始值 '2024-08-01'">
      <ODatePicker v-model="val3" clearable />
      <template #extra>
        {{ val3 }} <u v-if="val3">{{ dayjs(val3).format('YYYY-MM-DD HH:mm:ss') }}</u>
      </template>
    </OFormItem>
  </OForm>
</template>

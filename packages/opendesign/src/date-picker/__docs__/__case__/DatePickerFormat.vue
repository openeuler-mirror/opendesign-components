<docs lang="md">
<!-- zh-CN -->

### 日期格式

通过 `format` 控制显示和输入格式（不影响面板行为），通过 `valueFormat` 控制绑定值格式。`valueFormat='x'`（默认）输出毫秒时间戳，也可指定格式化字符串如 `'YYYY-MM-DD'`。

<!-- en-US -->

### Date Format

Use `format` to control display and input format (does not affect panel behavior). Use `valueFormat` to control the bound value format. `valueFormat='x'` (default) outputs a millisecond timestamp; you can also specify a format string like `'YYYY-MM-DD'`.
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import dayjs from 'dayjs';
import { OLink, ODatePicker, OForm, OFormItem, type DatePickerShortcutSlotProps } from '@opensig/opendesign';
import { useScreen } from '@/utils/useScreen';

const { lePadV } = useScreen();

const val1 = ref<number>();
const val2 = ref<number>();
const val3 = ref<string>();

const handleTodayClick = ({ setValue, emitChange }: DatePickerShortcutSlotProps) => {
  setValue(dayjs().startOf('day').valueOf());
  emitChange();
};
</script>
<template>
  <OForm :layout="lePadV ? 'v' : 'h'" label-width="220px">
    <OFormItem label="format='YYYY-MM-DD'">
      <ODatePicker v-model="val1" format="YYYY-MM-DD" clearable>
        <template #shortcut="{ setValue, emitChange }">
          <OLink :hover-underline="false" @click="handleTodayClick({ setValue, emitChange })">今天</OLink>
        </template>
      </ODatePicker>
      <template #extra>
        {{ val1 }} <u v-if="val1">{{ dayjs(val1).format('YYYY-MM-DD HH:mm:ss') }}</u>
      </template>
    </OFormItem>
    <OFormItem label="format='YYYY/MM/DD'">
      <ODatePicker v-model="val2" format="YYYY/MM/DD" clearable />
      <template #extra>
        {{ val2 }} <u v-if="val2">{{ dayjs(val2).format('YYYY-MM-DD HH:mm:ss') }}</u>
      </template>
    </OFormItem>
    <OFormItem label="valueFormat='YYYY-MM-DD'">
      <ODatePicker v-model="val3" value-format="YYYY-MM-DD" clearable />
      <template #extra>
        {{ val3 }} <u v-if="val3">{{ dayjs(val3).format('YYYY-MM-DD HH:mm:ss') }}</u>
      </template>
    </OFormItem>
  </OForm>
</template>

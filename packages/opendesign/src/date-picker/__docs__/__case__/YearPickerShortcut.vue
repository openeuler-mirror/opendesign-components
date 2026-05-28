<docs lang="md">
<!-- zh-CN -->

### 快捷选项

通过 `shortcut` slot 提供快捷年份入口，slot 提供 `setValue(value)` 和 `emitChange()` 方法。

<!-- en-US -->

### Shortcuts

Use the `shortcut` slot to add preset year options. The slot exposes `setValue(value)` and `emitChange()`.
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import dayjs from 'dayjs';
import { OYearPicker, OLink, OForm, OFormItem, type DatePickerShortcutSlotProps } from '@opensig/opendesign';
import { useScreen } from '@/utils/useScreen';

const { lePadV } = useScreen();

const val = ref<number>();

const shortcuts: { label: string; handler: (slot: DatePickerShortcutSlotProps) => void }[] = [
  {
    label: '今年',
    handler: ({ setValue, emitChange }) => {
      setValue(dayjs().startOf('year').valueOf());
      emitChange();
    },
  },
  {
    label: '去年',
    handler: ({ setValue, emitChange }) => {
      setValue(dayjs().subtract(1, 'year').startOf('year').valueOf());
      emitChange();
    },
  },
];
</script>
<template>
  <OForm :layout="lePadV ? 'v' : 'h'" label-width="160px">
    <OFormItem label="shortcut">
      <OYearPicker v-model="val" clearable>
        <template #shortcut="{ setValue, emitChange }">
          <OLink v-for="item in shortcuts" :key="item.label" :hover-underline="false" @click="item.handler({ setValue, emitChange })">{{ item.label }}</OLink>
        </template>
      </OYearPicker>
      <template #extra>
        {{ val }} <u v-if="val">{{ dayjs(val).format('YYYY-MM-DD HH:mm:ss') }}</u>
      </template>
    </OFormItem>
  </OForm>
</template>

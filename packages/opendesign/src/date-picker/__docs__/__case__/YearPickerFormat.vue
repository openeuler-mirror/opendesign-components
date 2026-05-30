<docs lang="md">
<!-- zh-CN -->

### 格式化

使用 `valueFormat` 控制绑定值格式，`'x'` 为时间戳（默认），也可以指定字符串格式。

<!-- en-US -->

### Format

Use `valueFormat` to control the bound value format. `'x'` is timestamp (default).
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import dayjs from 'dayjs';
import { OYearPicker, OForm, OFormItem } from '@opensig/opendesign';
import { useScreen } from '@/utils/useScreen';

const { lePadV } = useScreen();

const val1 = ref<number>();
const val2 = ref<string>();
</script>
<template>
  <OForm :layout="lePadV ? 'v' : 'h'" label-width="200px">
    <OFormItem label="valueFormat='x'（默认时间戳）">
      <OYearPicker v-model="val1" clearable />
      <template #extra>
        {{ val1 }} <u v-if="val1">{{ dayjs(val1).format('YYYY-MM-DD HH:mm:ss') }}</u>
      </template>
    </OFormItem>
    <OFormItem label="valueFormat='YYYY'">
      <OYearPicker v-model="val2" value-format="YYYY" clearable />
      <template #extra>
        {{ val2 }} <u v-if="val2">{{ dayjs(val2).format('YYYY-MM-DD HH:mm:ss') }}</u>
      </template>
    </OFormItem>
  </OForm>
</template>

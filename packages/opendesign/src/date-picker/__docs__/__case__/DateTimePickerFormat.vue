<docs lang="md">
<!-- zh-CN -->

### 格式化

<!-- en-US -->

### Format
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import dayjs from 'dayjs';
import { ODateTimePicker, OForm, OFormItem } from '@opensig/opendesign';
import { useScreen } from '@/utils/useScreen';

const { lePadV } = useScreen();

const val1 = ref<number>();
const val2 = ref<string>();
</script>
<template>
  <OForm :layout="lePadV ? 'v' : 'h'" label-width="220px">
    <OFormItem label="valueFormat='x'（默认时间戳）">
      <ODateTimePicker v-model="val1" clearable />
      <template #extra>
        {{ val1 }} <u v-if="val1">{{ dayjs(val1).format('YYYY-MM-DD HH:mm:ss') }}</u>
      </template>
    </OFormItem>
    <OFormItem label="valueFormat='YYYY-MM-DD HH:mm:ss'">
      <ODateTimePicker v-model="val2" value-format="YYYY-MM-DD HH:mm:ss" clearable />
      <template #extra>
        {{ val2 }} <u v-if="val2">{{ dayjs(val2).format('YYYY-MM-DD HH:mm:ss') }}</u>
      </template>
    </OFormItem>
  </OForm>
</template>

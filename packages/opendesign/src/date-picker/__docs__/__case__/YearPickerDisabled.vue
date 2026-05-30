<docs lang="md">
<!-- zh-CN -->

### 禁用与只读

<!-- en-US -->

### Disabled & Readonly
</docs>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import dayjs from 'dayjs';
import { OYearPicker, OForm, OFormItem } from '@opensig/opendesign';
import { useScreen } from '@/utils/useScreen';

const { lePadV } = useScreen();

const val = ref<number | undefined>(undefined);
onMounted(() => {
  val.value = Date.now();
});
</script>
<template>
  <OForm :layout="lePadV ? 'v' : 'h'" label-width="100px">
    <OFormItem label="disabled">
      <OYearPicker v-model="val" disabled />
      <template #extra>
        {{ val }} <u v-if="val">{{ dayjs(val).format('YYYY-MM-DD HH:mm:ss') }}</u>
      </template>
    </OFormItem>
    <OFormItem label="readonly">
      <OYearPicker v-model="val" readonly />
      <template #extra>
        {{ val }} <u v-if="val">{{ dayjs(val).format('YYYY-MM-DD HH:mm:ss') }}</u>
      </template>
    </OFormItem>
  </OForm>
</template>

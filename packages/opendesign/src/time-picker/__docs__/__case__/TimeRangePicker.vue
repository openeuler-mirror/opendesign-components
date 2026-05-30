<docs lang="md">
<!-- zh-CN -->

### 时间范围选择器

移动端提示：建议使用两个独立的选择器分别设置开始和结束时间，并通过 `minTime` / `maxTime` 约束来保证时间顺序，以获得更好的交互体验。

<!-- en-US -->

### Time range picker

Mobile Tip: We recommend using two separate pickers for start and end times, using `minTime` / `maxTime` constraints to ensure chronological order, for better interaction experience.
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OTimeRangePicker, OTimePicker, OForm, OFormItem } from '@opensig/opendesign';
import { useScreen } from '@/utils/useScreen';

const { lePadV } = useScreen();

const start = ref<string>();
const end = ref<string>();
</script>

<template>
  <template v-if="!lePadV">
    <div>start: "{{ start }}" &nbsp; end: "{{ end }}"</div>
    <OTimeRangePicker v-model:start="start" v-model:end="end" clearable size="large" class="range-picker-demo" />
  </template>
  <OForm v-else layout="v">
    <OFormItem label="开始">
      <OTimePicker v-model="start" :max-time="end" clearable size="large" />
      <template #extra
        ><u v-if="start">{{ start }}</u></template
      >
    </OFormItem>
    <OFormItem label="结束">
      <OTimePicker v-model="end" :min-time="start" clearable size="large" />
      <template #extra
        ><u v-if="end">{{ end }}</u></template
      >
    </OFormItem>
  </OForm>
</template>

<style scoped lang="scss">
.range-picker-demo {
  max-width: 320px;
}
</style>

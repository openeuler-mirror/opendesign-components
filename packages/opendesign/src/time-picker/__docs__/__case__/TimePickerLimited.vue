<docs lang="md">
<!-- zh-CN -->

### 限制时间选择范围

通过 `disabledHours`、`disabledMinutes`、`disabledSeconds` 回调函数精确禁用特定时间项；

也可以通过 `min-time`、`max-time` 快速限定可选时间范围（设置后 `disabledHours`、`disabledMinutes`、`disabledSeconds` 不生效）。

<!-- en-US -->

### Time limited

Use `disabledHours`, `disabledMinutes`, `disabledSeconds` callbacks to disable specific time options;

Or use `min-time` / `max-time` for quick time range constraints (when set, `disabledHours`, `disabledMinutes`, `disabledSeconds` will not take effect).
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OTimePicker } from '@opensig/opendesign';

const val1 = ref('11:13:14');
const val2 = ref('11:13:14');
const val3 = ref('');

const disabledHours = () => [0, 1, 2, 3, 4, 5, 6, 12, 13, 22, 23];

const disabledMinutes = (hour: number) => {
  if (hour === 9) {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
  }
  return [];
};

const disabledSeconds = (hour: number, minute: number) => {
  if (hour === 10 && minute === 30) {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  }
  return [];
};
</script>
<template>
  <div class="demo-time-picker-size-wrap">
    <div class="demo-time-picker-size">
      <span class="demo-label-text">disabledHours / disabledMinutes / disabledSeconds</span>
      <OTimePicker
        v-model="val1"
        size="medium"
        clearable
        :disabled-hours="disabledHours"
        :disabled-minutes="disabledMinutes"
        :disabled-seconds="disabledSeconds"
      />
    </div>
    <div class="demo-time-picker-size">
      <span class="demo-label-text">min-time / max-time</span>
      <OTimePicker v-model="val2" size="medium" clearable min-time="09:30:00" max-time="18:30:00" />
    </div>
    <div class="demo-time-picker-size">
      <span class="demo-label-text">min-time only</span>
      <OTimePicker v-model="val3" size="medium" clearable min-time="08:00:00" />
    </div>
  </div>
</template>
<style lang="scss">
.demo-time-picker-size-wrap {
  .demo-time-picker-size {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }
  .demo-label-text {
    flex-shrink: 0;
    width: 360px;
    margin-right: 16px;
    font-size: 14px;
  }
}
</style>

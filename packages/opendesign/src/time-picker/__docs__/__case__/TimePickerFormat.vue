<docs lang="md">
<!-- zh-CN -->

### 时间格式

通过 `format` 属性控制时间格式，支持 `HH:mm:ss`（默认）与 `HH:mm` 两种格式。

<!-- en-US -->

### Time Format

Use the `format` prop to control the time format. Supports `HH:mm:ss` (default) and `HH:mm`.
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OTimePicker } from '@opensig/opendesign';

const val1 = ref('');
const val2 = ref('');
</script>
<template>
  <div class="demo-time-picker-format-wrap">
    <div class="demo-time-picker-format">
      <span class="demo-format-label">HH:mm:ss</span>
      <OTimePicker v-model="val1" format="HH:mm:ss" clearable style="width: 200px" />
    </div>
    <div class="demo-time-picker-format">
      <span class="demo-format-label">HH:mm</span>
      <OTimePicker v-model="val2" format="HH:mm" clearable style="width: 200px" />
    </div>
  </div>
</template>
<style lang="scss">
.demo-time-picker-format-wrap {
  .demo-time-picker-format {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }
  .demo-format-label {
    flex-shrink: 0;
    width: 80px;
    margin-right: 16px;
    font-size: 14px;
  }
}
</style>

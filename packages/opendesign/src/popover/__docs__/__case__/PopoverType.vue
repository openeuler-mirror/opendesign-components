<docs lang="md">
<!-- zh-CN -->

### 气泡类型

<!-- en-US -->

### Popover type
</docs>
<script setup lang="ts">
import { ref } from 'vue';
const text = '内容文本内容文本内容文本内容文本内容文本';
const title = '内容标题';
const gotIt = '知道了';
const popoverTarget = ref();
const onBtnClick = () => {
  popoverTarget?.value?.$el?.click();
};
</script>
<template>
  <div class="demo-popover-wrap">
    <div class="demo-popover">
      <OPopover position="top" trigger="click">
        <div style="width: 200px">{{ text }}</div>
        <template #target>
          <OButton round="pill"> demo-popover </OButton>
        </template>
      </OPopover>
    </div>
    <div class="demo-popover">
      <OButton ref="popoverTarget" round="pill"> demo-popover </OButton>
      <OPopover :target="popoverTarget" position="top" trigger="click" wrap-class="demo-popover-large">
        <div style="max-width: 200px">
          <div style="font-size: 16px; margin-bottom: 4px">{{ title }}</div>
          <div style="margin-bottom: 8px">{{ text }}</div>
          <div style="display: flex; justify-content: end">
            <div style="width: fit-content; cursor: pointer" @click="onBtnClick">{{ gotIt }}</div>
          </div>
        </div>
      </OPopover>
    </div>
  </div>
</template>
<style lang="scss">
.demo-popover-wrap {
  display: flex;
  .demo-popover:first-child {
    margin-right: 40px;
  }
}
.demo-popover-large {
  --popup-padding: 16px;
}
</style>

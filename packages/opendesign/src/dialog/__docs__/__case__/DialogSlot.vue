<docs lang="md">
<!-- zh-CN -->

### 插槽

对话框有四个插槽：

- `header`: 头部，用于放置标题
- `default`: 主体，用于放置内容。**注**：`default` 插槽中的内容有溢出滚动的功能（可通过 `scrollbar` 参数调整滚动条，参数类型[BaseScrollerPropsT](#base-scroller-props-t)），其余插槽位置固定不能滚动；
- `actions`: 按钮，用于自定义底部按钮
- `footer`: 底部，用于防止底部内容。**注**：`footer` 插槽会覆盖 `actions` 插槽。

<!-- en-US -->

### Slots

The dialog has four slots:

- `header`: Header, used to place the title.
- `default`: Body, used to place content. **Note**: Content in the `default` slot supports overflow scrolling
  (the scrollbar can be adjusted via the `scrollbar` parameter; for the parameter type, see [BaseScrollerPropsT](#base-scroller-props-t)),
  while other slots have fixed positions and cannot scroll.
- `actions`: Buttons, used to customize the bottom buttons.
</docs>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { ODialog, OButton, OTextarea, ORate, ODivider } from '@opensig/opendesign';

const visible = ref(false);
const rateVal = ref(0);
const feedback = ref('');
const openRatingDialog = () => {
  visible.value = true;
};
const cancel = () => {
  visible.value = false;
};
const submit = () => {
  visible.value = false;
};
const labels = ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'];
const title = computed(() => {
  if (rateVal.value === 0) {
    return 'Please rate your experience';
  } else {
    return labels[rateVal.value - 1];
  }
});
</script>

<template>
  <OButton @click="openRatingDialog">Open rating dialog</OButton>
  <ODialog v-model:visible="visible" size="auto">
    <template #header>{{ title }}</template>
    <div class="body-wrapper">
      <ORate v-model="rateVal" size="large" />
      <OTextarea v-model="feedback" placeholder="Please enter your feedback" :max-length="200" resize="none" class="textarea" />
      <div>Thanks for your feedback!</div>
    </div>
    <template #actions="{ isPhonePad }">
      <OButton :variant="isPhonePad ? 'text' : 'outline'" :disabled="isPhonePad" @click="cancel">Cancel</OButton>
      <ODivider direction="v" :class="{ pc: !isPhonePad }" />
      <OButton :variant="isPhonePad ? 'text' : 'outline'" color="primary" @click="submit">Submit</OButton>
    </template>
  </ODialog>
</template>
<style lang="scss" scoped>
.body-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.textarea {
  margin-top: var(--o-gap-3);
  margin-bottom: var(--o-gap-2);
  width: 312px;
  height: 116px;
}
.pc {
  --o-divider-bd-color: transparent;
}
</style>

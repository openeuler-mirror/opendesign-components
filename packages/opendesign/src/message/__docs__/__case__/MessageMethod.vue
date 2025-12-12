<docs lang="md">
<!-- zh-CN -->

#### 设置消息位置

- 调用 `useMessage` 时，可传入 `target` 参数，用于指定消息显示在哪个元素附近。
- 每种消息方法（如 `info`、`success` 等）都支持传入配置对象，其中可设置以下位置属性：
  - `position`：指定消息出现在目标元素的 `top`（顶部）或 `bottom`（底部）。
  - `targetAlign`：设置消息框与目标元素的对齐方式，支持 `center`（居中）、`left`（左对齐）和 `right`（右对齐）。
  - **注意**：仅当指定了 `target` 元素时，`targetAlign` 才会生效。

<!-- en-US -->

#### Set Message Position

- When calling `useMessage`, you can pass a `target` parameter to specify which element the message should appear near.
- Each message method (e.g., `info`, `success`, etc.) supports passing a configuration object, which can include the following positioning properties:
  - `position`: Specifies whether the message appears at the `top` or `bottom` of the target element.
  - `targetAlign`: Sets the alignment of the message box relative to the target element, supporting `center`, `left`, and `right`.
  - **Note**: `targetAlign` will only take effect when a `target` element is specified.
</docs>
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { OTextarea, OButton, useMessage } from '@opensig/opendesign';

const container = useTemplateRef('feedback-container');
const message = useMessage(container);
const submit = () => {
  message.success({
    content: 'Thanks for your feedback',
    position: 'bottom',
    targetAlign: 'right',
  });
};
</script>
<template>
  <div ref="feedback-container" class="feedback">
    <OTextarea placeholder="feedback..." class="feedback-textarea" />
    <div class="operations">
      <OButton @click="submit">Submit</OButton>
    </div>
  </div>
</template>
<style scoped lang="scss">
.feedback {
  width: 300px;
  padding: 12px;
  border: 1px solid var(--o-color-control1);
  background-color: var(--o-color-control5-light);
}
.feedback-textarea {
  width: 100%;
  height: 200px;
}
.operations {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>

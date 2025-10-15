<docs lang="md">
<!-- zh-CN -->

### 主题规范

鲲鹏、昇腾及欧拉主题规范中要求图标与文字顶部对齐，可给`OMessage`组件添加 `c-message-align-top` 实现该效果；要求文字左对齐，可覆盖 CSS 变量 `--message-text-align: left`。

<!-- en-US -->

### Theming Specifications

The Kunpeng, Ascend, and openEuler theming specifications require icons to be top-aligned with text.
This can be achieved by adding the `c-message-align-top` class to the `OMessage` component.
Additionally, left-aligned text is required and can be implemented by overriding the CSS variable `--message-text-align: left`.
</docs>

<script setup lang="ts">
import { OMessage } from '@opensig/opendesign';

const status = ['info', 'success', 'warning', 'danger', 'loading'] as const;
</script>
<template>
  <div class="message-group">
    <div class="global">
      <OMessage v-for="(s, index) in status" :key="s" :status="s" :duration="5000 + 1000 * index">Disappear after {{ 5 + index }} seconds</OMessage>
    </div>
    <div class="inline">
      <OMessage v-for="s in status" :key="s" :status="s" colorful>{{ s }}</OMessage>
      <OMessage status="success" closable colorful>You can close the message</OMessage>
      <OMessage status="info" colorful class="c-message-align-top text-align-left">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti vero rem quod natus incidunt quaerat quia doloremque ullam reiciendis facere porro,
        repellat beatae quas saepe consequuntur id voluptatibus exercitationem atque. Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam veritatis
        veniam tempore assumenda aperiam repudiandae voluptates enim voluptatibus nobis neque itaque quis autem, similique fuga pariatur aut ratione
        perspiciatis illum?
      </OMessage>
    </div>
  </div>
</template>
<style scoped lang="scss">
.message-group {
  display: flex;
}
.global {
  flex-shrink: 0;
}
.global:has(.o-message) {
  margin-right: 24px;
}
.global,
.inline {
  :deep(.o-message + .o-message) {
    margin-top: 16px;
  }
}
.text-align-left {
  --message-text-align: left;
}
</style>

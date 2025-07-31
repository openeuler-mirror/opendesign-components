<docs lang="md">
<!-- zh-CN -->
### 插槽

插槽示意图

![插槽](./card-slot.svg)

<!-- en-US -->

### Slot

Slot Diagram

![slot](./card-slot.svg)
</docs>
<script setup lang="ts">
import { OCard, ORate, OTag } from '@opensig/opendesign';

const cardInfo = {
  title: 'lorem ipsum dolor sit amet',
  detail:
    'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
};
</script>
<template>
  <OCard hoverable cursor="pointer" :detail="cardInfo.detail" target="_blank">
    <!-- custom header -->
    <template #header>
      <span :style="{ fontWeight: 500 }">{{ cardInfo.title }}</span>
      <div class="card-tags">
        <OTag class="card-tag">tag 1</OTag>
        <OTag class="card-tag">tag 2</OTag>
        <OTag class="card-tag">tag 3</OTag>
      </div>
    </template>
    <!-- custom footer -->
    <template #footer>
      <ORate color="primary" :default-value="1" readonly :count="1" />
      <span class="card-label">4.0</span>
    </template>
  </OCard>
</template>
<style lang="scss" scoped>
.card-tags {
  margin-top: 8px;
}

.card-tag + .card-tag {
  margin-left: 8px;
}

.card-label {
  color: var(--o-color-info2);
  font-size: var(--o-font_size-tip1);
  line-height: var(--o-line_height-tip1);
  margin-left: 8px;
}
</style>

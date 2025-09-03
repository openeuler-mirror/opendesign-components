<script setup lang="ts">
import { OCard, OLink, OButton, OIconSkill } from '@opensig/opendesign';
</script>
<template>
  <OCard title="Composite card title" detail="Composite card detail" :icon="OIconSkill" class="c-card-kunpeng">
    <template #footer>
      <OButton round="pill" color="primary" size="medium" class="row-item">Button</OButton>
      <OLink hover-underline class="row-item c-link-ascend"
        >Text Arrow Button<template #suffix><div class="c-link-ascend-arrow"></div></template
      ></OLink>
    </template>
  </OCard>
</template>
<style lang="scss" scoped>
.row-item + .row-item {
  margin-left: 16px;
}
</style>

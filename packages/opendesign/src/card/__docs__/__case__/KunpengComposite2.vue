<script setup lang="ts">
import { OCard, OLink, OButton, OIconSkill } from '@opensig/opendesign';
</script>
<template>
  <OCard title="Composite card title" detail="Composite card detail" :icon="OIconSkill" class="c-card-kunpeng">
    <template #footer>
      <OButton round="pill" color="primary" size="medium" class="row-item">Button</OButton>
      <OLink tag="span" hover-underline class="c-link-kunpeng row-item"
        >Text Button<template #suffix><OIconChevronRight /></template
      ></OLink>
    </template>
  </OCard>
</template>
<style lang="scss" scoped>
.row-item + .row-item {
  margin-left: 16px;
}
</style>

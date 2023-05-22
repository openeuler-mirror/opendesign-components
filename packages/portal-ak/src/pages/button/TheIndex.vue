<script setup lang="ts">
import { OButton, OLink, OIcon, OIconRefresh, OIconAdd, OIconChevronRight } from '@components/index';
</script>
<template>
  <div class="page-demo">
    <h3>类型 & 尺寸</h3>
    <section>
      L:
      <OButton>运营按钮</OButton>
      <OButton variant="solid" color="primary">强调按钮</OButton>
      <OButton variant="solid" color="primary" :icon="OIconAdd">强调按钮</OButton>
      <OButton variant="outline" color="primary">描边按钮</OButton>
      <OButton variant="outline" color="primary" :icon="OIconAdd">描边按钮</OButton>
      <OLink>文本按钮</OLink>
      <OLink :icon="OIconAdd">文本按钮</OLink>
      <OLink>
        文本按钮<template #suffix><OIconChevronRight /></template>
      </OLink>
      <OLink color="primary" hover-underline>链接按钮</OLink>
      <OIcon :icon="OIconRefresh" button />
    </section>
    <section>
      M:
      <OButton>运营按钮</OButton>
      <OButton variant="solid" color="primary">强调按钮</OButton>
      <OButton variant="solid" color="primary" :icon="OIconAdd">强调按钮</OButton>
      <OButton variant="outline" color="primary">描边按钮</OButton>
      <OButton variant="outline" color="primary" :icon="OIconAdd">描边按钮</OButton>
      <OLink>文本按钮</OLink>
      <OLink :icon="OIconAdd">文本按钮</OLink>
      <OLink>
        文本按钮<template #suffix><OIconChevronRight /></template>
      </OLink>
      <OLink color="primary" hover-underline>链接按钮</OLink>
      <OIcon :icon="OIconRefresh" button />
    </section>
  </div>
</template>
<style lang="scss">
.the-home {
  color: #333;
}
</style>

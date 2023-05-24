<script setup lang="ts">
import { OButton, OLink, OIcon, OIconRefresh, OIconAdd, OIconChevronRight } from '@components/index';
</script>
<template>
  <div class="page-demo">
    <h3>类型 & 尺寸</h3>
    <section>
      M:
      <OButton class="btn-ascend" variant="solid" color="primary">运营按钮</OButton>
      <OButton variant="solid" color="primary">强调按钮</OButton>
      <OButton variant="solid" color="primary" :icon="OIconAdd">强调按钮</OButton>
      <OButton variant="outline" color="primary">描边按钮</OButton>
      <OButton variant="outline" color="primary" :icon="OIconAdd">描边按钮</OButton>
      <OLink color="primary" size="medium">文本按钮</OLink>
      <OLink color="primary" size="medium" :icon="OIconAdd">文本按钮</OLink>
      <OLink color="primary" size="medium">
        文本按钮 <template #suffix><OIconChevronRight class="o-link-arrow" /></template>
      </OLink>
      <OLink hover-underline size="medium">链接按钮</OLink>
      <OIcon :icon="OIconRefresh" button />
    </section>
    <section>
      L:
      <OButton class="btn-ascend" variant="solid" color="primary" size="large">运营按钮</OButton>
      <OButton variant="solid" color="primary" size="large">强调按钮</OButton>
      <OButton variant="solid" color="primary" :icon="OIconAdd" size="large">强调按钮</OButton>
      <OButton variant="outline" color="primary" size="large">描边按钮</OButton>
      <OButton variant="outline" color="primary" :icon="OIconAdd" size="large">描边按钮</OButton>
      <OLink color="primary" size="large">文本按钮</OLink>
      <OLink color="primary" :icon="OIconAdd" size="large">文本按钮</OLink>
      <OLink color="primary" size="large">
        文本按钮 <template #suffix><OIconChevronRight class="o-link-arrow" /></template>
      </OLink>
      <OLink hover-underline size="large">链接按钮</OLink>
      <OIcon :icon="OIconRefresh" button size="large" />
    </section>
    <h3>禁用</h3>
    <section>
      <OButton disabled class="btn-ascend" variant="solid" color="primary">运营按钮</OButton>
      <OButton disabled variant="solid" color="primary">强调按钮</OButton>
      <OButton disabled variant="solid" color="primary" :icon="OIconAdd">强调按钮</OButton>
      <OButton disabled variant="outline" color="primary">描边按钮</OButton>
      <OButton disabled variant="outline" color="primary" :icon="OIconAdd">描边按钮</OButton>
      <OLink disabled color="primary">文本按钮</OLink>
      <OLink disabled color="primary" :icon="OIconAdd">文本按钮</OLink>
      <OLink disabled color="primary">
        文本按钮 <template #suffix><OIconChevronRight class="o-link-arrow" /></template>
      </OLink>
      <OLink disabled hover-underline>链接按钮</OLink>
      <OIcon disabled :icon="OIconRefresh" button />
    </section>
  </div>
</template>
<style lang="scss">
.the-home {
  color: #333;
}
</style>

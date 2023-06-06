<script setup lang="ts">
import { OButton, OLink, OIcon, OIconRefresh, OIconAdd, OIconChevronRight } from '@components/index';
</script>
<template>
  <h3>类型 & 尺寸</h3>
  <section>
    M:
    <OButton round="pill" class="c-btn-ascend" variant="solid" color="primary">运营按钮</OButton>
    <OButton round="pill" variant="solid" color="primary">强调按钮</OButton>
    <OButton round="pill" variant="solid" color="primary" :icon="OIconAdd">强调按钮</OButton>
    <OButton round="pill" variant="outline" color="primary">描边按钮</OButton>
    <OButton round="pill" variant="outline" color="primary" :icon="OIconAdd">描边按钮</OButton>
    <OLink color="primary">文本按钮</OLink>
    <OLink color="primary" :icon="OIconAdd">文本按钮</OLink>
    <OLink color="primary" class="c-link-kunpeng" hover-underline>
      文本按钮 <template #suffix><OIconChevronRight class="c-link-kunpeng-arrow" /></template>
    </OLink>
    <OLink color="primary" class="c-link-ascend">
      昇腾文本按钮 <template #suffix><div class="c-link-ascend-arrow"></div></template>
    </OLink>
    <OLink hover-underline>链接按钮</OLink>
    <OIcon :icon="OIconRefresh" button />
  </section>
  <section>
    L:
    <OButton round="pill" class="c-btn-ascend" variant="solid" color="primary" size="large">运营按钮</OButton>
    <OButton round="pill" variant="solid" color="primary" size="large">强调按钮</OButton>
    <OButton round="pill" variant="solid" color="primary" :icon="OIconAdd" size="large">强调按钮</OButton>
    <OButton round="pill" variant="outline" color="primary" size="large">描边按钮</OButton>
    <OButton round="pill" variant="outline" color="primary" :icon="OIconAdd" size="large">描边按钮</OButton>
    <OLink color="primary" size="large">文本按钮</OLink>
    <OLink color="primary" :icon="OIconAdd" size="large">文本按钮</OLink>
    <OLink color="primary" size="large" class="c-link-kunpeng" hover-underline>
      鲲鹏文本按钮 <template #suffix><OIconChevronRight class="c-link-kunpeng-arrow" /></template>
    </OLink>
    <OLink color="primary" size="large" class="c-link-ascend">
      昇腾文本按钮 <template #suffix><div class="c-link-ascend-arrow"></div></template>
    </OLink>
    <OLink hover-underline size="large">链接按钮</OLink>
    <OIcon :icon="OIconRefresh" button size="large" />
  </section>
  <h3>禁用</h3>
  <section>
    <OButton round="pill" disabled class="c-btn-ascend" variant="solid" color="primary">运营按钮</OButton>
    <OButton round="pill" disabled variant="solid" color="primary">强调按钮</OButton>
    <OButton round="pill" disabled variant="solid" color="primary" :icon="OIconAdd">强调按钮</OButton>
    <OButton round="pill" disabled variant="outline" color="primary">描边按钮</OButton>
    <OButton round="pill" disabled variant="outline" color="primary" :icon="OIconAdd">描边按钮</OButton>
    <OLink disabled color="primary">文本按钮</OLink>
    <OLink disabled color="primary" :icon="OIconAdd">文本按钮</OLink>
    <OLink disabled color="primary" class="c-link-kunpeng">
      鲲鹏文本按钮 <template #suffix><OIconChevronRight /></template>
    </OLink>
    <OLink disabled color="primary" class="c-link-ascend">
      昇腾文本按钮 <template #suffix><div class="c-link-ascend-arrow"></div></template>
    </OLink>
    <OLink disabled hover-underline>链接按钮</OLink>
    <OIcon disabled :icon="OIconRefresh" button />
  </section>
</template>
<style lang="scss"></style>

<script setup lang="ts">
import { OButton, OLink, OIcon, OIconRefresh, OIconAdd, OIconChevronRight } from '@components/index';

import { darkTheme } from '@/shared/theme';

import theme from '@/shared/theme';
import { computed } from 'vue';
console.log(theme.value);

const isAscend = computed(() => {
  return theme.value.startsWith('a');
});
</script>
<template>
  <h3>类型 & 尺寸</h3>
  <section>
    M:
    <OButton round="pill" class="c-btn-activity" variant="solid" color="primary">运营按钮</OButton>
    <OButton round="pill" variant="solid" color="primary" :icon="OIconAdd">强调按钮</OButton>
    <OButton round="pill" variant="outline" color="primary">描边按钮</OButton>
    <OButton round="pill" variant="outline" color="primary" :icon="OIconAdd">描边按钮</OButton>

    <OLink size="medium">文本按钮</OLink>
    <OLink :icon="OIconAdd" size="medium">文本按钮</OLink>

    <OLink v-if="isAscend" class="c-link-ascend" size="medium">
      昇腾文本按钮 <template #suffix><div class="c-link-ascend-arrow"></div></template>
    </OLink>
    <OLink v-else class="c-link-kunpeng" hover-underline size="medium">
      鲲鹏文本按钮 <template #suffix><OIconChevronRight class="c-link-kunpeng-arrow" /></template>
    </OLink>

    <OLink color="primary" hover-underline size="medium">链接按钮</OLink>
    <OIcon :icon="OIconRefresh" button />
  </section>
  <section>
    L:
    <OButton round="pill" class="c-btn-activity" variant="solid" color="primary" size="large">运营按钮</OButton>
    <OButton round="pill" variant="solid" color="primary" size="large">强调按钮</OButton>
    <OButton round="pill" variant="solid" color="primary" :icon="OIconAdd" size="large">强调按钮</OButton>
    <OButton round="pill" variant="outline" color="primary" size="large">描边按钮</OButton>
    <OButton round="pill" variant="outline" color="primary" :icon="OIconAdd" size="large">描边按钮</OButton>

    <OLink size="large">文本按钮</OLink>
    <OLink :icon="OIconAdd" size="large">文本按钮</OLink>

    <OLink v-if="isAscend" class="c-link-ascend" size="large">
      昇腾文本按钮 <template #suffix><div class="c-link-ascend-arrow"></div></template>
    </OLink>
    <OLink v-else class="c-link-kunpeng" hover-underline size="large">
      鲲鹏文本按钮 <template #suffix><OIconChevronRight class="c-link-kunpeng-arrow" /></template>
    </OLink>

    <OLink hover-underline color="primary" size="large">链接按钮</OLink>
    <OIcon :icon="OIconRefresh" button class="c-icon-large" />
  </section>
  <h3>加载中</h3>
  <section>
    <OButton round="pill" class="c-btn-activity" variant="solid" color="primary" loading>运营按钮</OButton>
    <OButton round="pill" variant="solid" color="primary" loading>强调按钮</OButton>
    <OButton round="pill" variant="solid" color="primary" :icon="OIconAdd" loading>强调按钮</OButton>
    <OButton round="pill" variant="outline" color="primary" loading>描边按钮</OButton>
    <OButton round="pill" variant="outline" color="primary" :icon="OIconAdd" loading>描边按钮</OButton>

    <OLink size="medium" loading>文本按钮</OLink>
    <OLink size="medium" :icon="OIconAdd" loading>文本按钮</OLink>

    <OLink v-if="isAscend" size="medium" class="c-link-ascend" loading>
      昇腾文本按钮 <template #suffix><div class="c-link-ascend-arrow"></div></template>
    </OLink>
    <OLink v-else size="medium" class="c-link-kunpeng" loading hover-underline>
      鲲鹏文本按钮 <template #suffix><OIconChevronRight /></template>
    </OLink>

    <OLink size="medium" hover-underline loading color="primary">链接按钮</OLink>
    <OIcon :icon="OIconRefresh" button loading />
  </section>
  <h3>禁用</h3>
  <section>
    <OButton round="pill" disabled class="c-btn-activity" variant="solid" color="primary">运营按钮</OButton>
    <OButton round="pill" disabled variant="solid" color="primary">强调按钮</OButton>
    <OButton round="pill" disabled variant="solid" color="primary" :icon="OIconAdd">强调按钮</OButton>
    <OButton round="pill" disabled variant="outline" color="primary">描边按钮</OButton>
    <OButton round="pill" disabled variant="outline" color="primary" :icon="OIconAdd">描边按钮</OButton>

    <OLink size="medium" disabled>文本按钮</OLink>
    <OLink size="medium" disabled :icon="OIconAdd">文本按钮</OLink>

    <OLink v-if="isAscend" size="medium" disabled class="c-link-ascend">
      昇腾文本按钮 <template #suffix><div class="c-link-ascend-arrow"></div></template>
    </OLink>
    <OLink v-else size="medium" disabled class="c-link-kunpeng">
      鲲鹏文本按钮 <template #suffix><OIconChevronRight /></template>
    </OLink>

    <OLink size="medium" disabled color="primary" hover-underline>链接按钮</OLink>
    <OIcon disabled :icon="OIconRefresh" button />
  </section>

  <h3>深色</h3>
  <div :data-o-theme="darkTheme">
    <section>
      M:
      <OButton round="pill" class="c-btn-activity" variant="solid" color="primary">运营按钮</OButton>
      <OButton round="pill" variant="solid" color="primary">强调按钮</OButton>
      <OButton round="pill" variant="solid" color="primary" :icon="OIconAdd">强调按钮</OButton>
      <OButton round="pill" variant="outline" color="primary">描边按钮</OButton>
      <OButton round="pill" variant="outline" color="primary" :icon="OIconAdd">描边按钮</OButton>

      <OLink size="medium">文本按钮</OLink>
      <OLink size="medium" :icon="OIconAdd">文本按钮</OLink>

      <OLink v-if="isAscend" size="medium" class="c-link-ascend">
        昇腾文本按钮 <template #suffix><div class="c-link-ascend-arrow"></div></template>
      </OLink>
      <OLink v-else size="medium" class="c-link-kunpeng" hover-underline>
        鲲鹏文本按钮 <template #suffix><OIconChevronRight class="c-link-kunpeng-arrow" /></template>
      </OLink>

      <OLink size="medium" color="primary" hover-underline>链接按钮</OLink>
      <OIcon size="medium" :icon="OIconRefresh" button />
    </section>
    <section>
      禁用:
      <OButton round="pill" disabled class="c-btn-activity" variant="solid" color="primary">运营按钮</OButton>
      <OButton round="pill" disabled variant="solid" color="primary">强调按钮</OButton>
      <OButton round="pill" disabled variant="solid" color="primary" :icon="OIconAdd">强调按钮</OButton>
      <OButton round="pill" disabled variant="outline" color="primary">描边按钮</OButton>
      <OButton round="pill" disabled variant="outline" color="primary" :icon="OIconAdd">描边按钮</OButton>

      <OLink size="medium" disabled>文本按钮</OLink>
      <OLink size="medium" disabled :icon="OIconAdd">文本按钮</OLink>

      <OLink v-if="isAscend" size="medium" disabled class="c-link-ascend">
        昇腾文本按钮 <template #suffix><div class="c-link-ascend-arrow"></div></template>
      </OLink>
      <OLink v-else size="medium" disabled class="c-link-kunpeng">
        鲲鹏文本按钮 <template #suffix><OIconChevronRight /></template>
      </OLink>

      <OLink size="medium" color="primary" disabled hover-underline>链接按钮</OLink>
      <OIcon disabled :icon="OIconRefresh" button />
    </section>
  </div>
</template>
<style lang="scss"></style>

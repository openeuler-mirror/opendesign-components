<docs lang="md">
<!-- zh-CN -->

### 明暗色切换

在深色背景图中往往需要使用浅色文字及控件，在浅色背景图中往往需要使用深色文字及控件。这样的明暗色切换可以通过给组件设置 `data-o-theme="ThemeValue"` 来实现。

<!-- en-US -->

### Light/Dark Theme Switching

In dark background images, light-colored text and controls are often required,
while in light background images, dark-colored text and controls are typically used.
This light/dark theme switching can be achieved by setting the `data-o-theme="ThemeValue"` attribute for the component.
</docs>
<script setup lang="ts">
import { inject, computed, ref } from 'vue';
import { OCarousel, OCarouselItem } from '@opensig/opendesign';

const pages = [
  {
    content: 'dark image',
    backgroundColor: '#730015',
    themeColor: 'dark',
  },
  {
    content: 'light image',
    backgroundColor: '#E8FFEE',
    themeColor: 'light',
  },
];
// ctx.skin: Ascend, Kunpeng, OpenEuler or OpenDesign skin
const ctx = inject('docs-config', { skin: '' });
const activeIndex = ref(0);
const getTheme = (themeColor: string) => (ctx.skin ? `${ctx.skin}.${themeColor}` : themeColor);
const controlTheme = computed(() => getTheme(pages[activeIndex.value].themeColor));
</script>
<template>
  <OCarousel v-model:active-index="activeIndex" arrow="always" :data-o-theme="controlTheme" class="switch-color">
    <OCarouselItem v-for="(item, index) in pages" :key="index" :style="{ backgroundColor: item.backgroundColor }" class="switch-color-item">
      {{ item.content }}
    </OCarouselItem>
  </OCarousel>
</template>
<style scoped lang="scss">
.switch-color {
  height: 200px;
  overflow: hidden;
}
.switch-color-item {
  width: 100%;
  height: 100%;
  color: var(--o-color-info1);
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

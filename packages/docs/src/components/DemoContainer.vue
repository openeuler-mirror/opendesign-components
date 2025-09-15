<script setup lang="ts">
import { ref, h, type Component, type PropType, computed } from 'vue';
import { OButton, useI18n } from '@opensig/opendesign';
import { DocIconCode } from '@/icon-components';
import { useThemeStore, type SkinT } from '@/stores/theme';
import DocConfigProvide from '@/components/DocConfigProvide.vue';

type DocT = Record<string, string | Component>;
type ReplaceStr<S, T, N> = S extends T ? N : S;
type ThemeKey = ReplaceStr<SkinT['value'], '', 'd'>;
export type DemoComponent = Component & {
  /** __docs__/__case__组件源的源码组件 */
  DemoSource?: Component;
  /** __docs__/__case__组件文案 */
  __docs?: DocT;
};
const props = defineProps({
  demo: {
    type: [Object, Function] as PropType<DemoComponent>,
    required: true,
  },
  activeThemes: {
    type: Array as PropType<ThemeKey[]>,
  },
});
const themeStore = useThemeStore();
const isShowCode = ref(false);
const switchShowCode = () => {
  isShowCode.value = !isShowCode.value;
};
const { locale } = useI18n();
const Docs = ({ docs, locale: _locale }: { docs?: DocT; locale: string }) => {
  if (!docs || !docs[_locale]) {
    return;
  }
  if (typeof docs[_locale] === 'string') {
    return h('div', {
      class: 'docs',
      innerHTML: docs[_locale],
    });
  }
  return h('div', { class: 'docs' }, h(docs[_locale]));
};
// 根据主题决定是否渲染
const isRender = computed(() => {
  if (!props.activeThemes?.length) {
    return true;
  }
  const currentTheme = themeStore.skinValue || 'd';
  return props.activeThemes.includes(currentTheme);
});
</script>

<template>
  <div v-if="isRender" class="demo-container">
    <Docs :docs="props.demo.__docs" :locale="locale" />
    <div class="demo">
      <Component :is="props.demo" />
    </div>
    <div v-if="!isShowCode" class="operator">
      <!-- 隐藏或显示代码块的按钮 -->
      <OButton variant="solid" size="small" @click="switchShowCode">
        <template #icon>
          <DocIconCode />
        </template>
      </OButton>
    </div>
    <!-- 代码块 -->
    <div v-show="isShowCode" v-if="props.demo.DemoSource" class="source">
      <DocConfigProvide :is-show-code="isShowCode" :switch-show-code="switchShowCode">
        <Component :is="props.demo.DemoSource" />
      </DocConfigProvide>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.demo-container {
  & + .demo-container {
    margin-top: 12px;
  }
}
.demo {
  border: 1px solid var(--o-color-control4);
  margin-top: 12px;
  padding: var(--o3-gap-5);
}
.operator {
  font-size: var(--o3-icon_size-m);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 4px;
}
.source {
  border: 1px solid var(--o-color-control4);
  border-top: none;
}
</style>

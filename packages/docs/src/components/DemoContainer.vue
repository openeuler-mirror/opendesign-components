<script setup lang="ts">
import { ref, h, type Component, type PropType } from 'vue';
import { OScroller, OButton, useI18n, OIconChevronUp } from '@opensig/opendesign';
import { DocIconCode } from '@/icon-components';

type DocT = Record<string, string | Component>;
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
});
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
</script>

<template>
  <div class="demo-container">
    <div class="operator">
      <!-- 隐藏或显示代码块的按钮 -->
      <OButton variant="solid" size="small" @click="switchShowCode">
        <template #icon>
          <DocIconCode v-if="!isShowCode" />
          <OIconChevronUp v-else />
        </template>
      </OButton>
    </div>
    <Docs :docs="props.demo.__docs" :locale="locale" />
    <div class="demo">
      <Component :is="props.demo" />
    </div>
    <!-- 代码块 -->
    <OScroller v-show="isShowCode" v-if="props.demo.DemoSource" class="source">
      <Component :is="props.demo.DemoSource" />
    </OScroller>
  </div>
</template>
<style lang="scss" scoped>
.demo-container {
  border: 1px solid var(--o-color-control1-light);
  & + .demo-container {
    margin-top: 12px;
  }
}
:deep(.docs) {
  padding: var(--o3-gap-4);
  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    &:first-child {
      margin-top: 0;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  :deep(> :first-child) {
    padding-right: calc(var(--o3-gap-4) + var(--o-control_size-s));
  }
}
.docs {
  border-bottom: 1px solid var(--o-color-control1-light);
  :deep(p) {
    color: var(--o-color-info3);
  }
}
.demo {
  padding: var(--o3-gap-2);
}
.operator {
  font-size: var(--o3-icon_size-m);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  float: right;
  transform: translate3d(calc(var(--o3-gap-4) * -1), var(--o3-gap-4), 0);
}
.source {
  border-top: 1px solid var(--o-color-control1-light);
}
.source {
  max-height: 70vh;
}
</style>

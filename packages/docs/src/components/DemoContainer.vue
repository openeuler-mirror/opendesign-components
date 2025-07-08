<script setup lang="ts">
import { ref, type Component } from 'vue';
import { OScroller, OButton, useI18n, OIconChevronUp } from '@opensig/opendesign';

type DemoComponent = Component & {
  /** __docs__/__case__组件源的源码组件 */
  DemoSource?: Component;
  /** __docs__/__case__组件文案 */
  __docs?: Record<string, string>;
};
const props = defineProps<{
  demo: DemoComponent;
}>();
const isShowCode = ref(false);
const switchShowCode = () => {
  isShowCode.value = !isShowCode.value;
};
const { locale } = useI18n();
</script>

<template>
  <div class="demo-container">
    <div v-if="props.demo.__docs" class="docs" v-html="props.demo.__docs[locale]"></div>
    <div class="demo">
      <Component :is="props.demo" />
    </div>

    <div class="operator">
      <!-- 隐藏或显示代码块的按钮 -->
      <OButton variant="solid" size="small" @click="switchShowCode">
        <template #icon>
          <svg viewBox="0 0 24 24" v-if="!isShowCode" class="o-svg-icon">
            <path
              fill="currentColor"
              d="m23 12l-7.071 7.071l-1.414-1.414L20.172 12l-5.657-5.657l1.414-1.414L23 12zM3.828 12l5.657 5.657l-1.414 1.414L1 12l7.071-7.071l1.414 1.414L3.828 12z"
            ></path>
          </svg>
          <OIconChevronUp v-else />
        </template>
      </OButton>
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
  position: relative;
  & + .demo-container {
    margin-top: 12px;
  }
}
.docs {
  padding: var(--o-gap-4);
  :deep(p),
  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4),
  :deep(h5),
  :deep(h6) {
    &:first-child {
      margin-top: 0;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  :deep(> :first-child) {
    padding-right: calc(var(--o-gap-4) + var(--o-control_size-s));
  }
}
.docs {
  border-bottom: 1px solid var(--o-color-control1-light);
  :deep(p) {
    color: var(--o-color-info3);
  }
}
.operator {
  font-size: var(--o-icon_size-m);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  right: var(--o-gap-4);
  top: var(--o-gap-4);
}
.source {
  border-top: 1px solid var(--o-color-control1-light);
}
.source {
  max-height: 80vh;
}
</style>

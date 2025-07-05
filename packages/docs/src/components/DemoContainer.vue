<script setup lang="ts">
import { ref, type Component } from 'vue';
import { OIconEye, OIconEyeOff, OScroller, OButton, useI18n } from '@opensig/opendesign';

type DemoComponent = Component & {
  DemoSource?: Component;
  __docs?: {
    title: Record<string, string>;
    description: Record<string, string>;
  };
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
    <h3 v-if="props.demo.__docs?.title" class="title">{{ props.demo.__docs.title[locale] }}</h3>
    <div class="demo-body">
      <div class="demo">
        <Component :is="props.demo" />
      </div>

      <div v-if="props.demo.__docs?.description" class="description" v-html="props.demo.__docs.description[locale]"></div>
      <div class="operator">
        <OButton variant="solid" size="small" @click="switchShowCode">
          <template #icon>
            <OIconEye v-if="!isShowCode" />
            <OIconEyeOff v-else />
          </template>
        </OButton>
      </div>
      <OScroller v-show="isShowCode" v-if="props.demo.DemoSource" class="source">
        <Component :is="props.demo.DemoSource" />
      </OScroller>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.title {
  color: var(--o-color-info1);
}
.demo-container {
  & + .demo-container {
    margin-top: 12px;
  }
}
.demo-body {
  border: 1px solid var(--o-color-control1-light);
}
.demo,
.description {
  padding: var(--o-gap-4);
  :deep(p) {
    &:first-child {
      margin-top: 0;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
}
.description {
  color: var(--o-color-info3);
}
.operator {
  padding: var(--o-gap-2) var(--o-gap-4);
  font-size: var(--o-icon_size-m);
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.description,
.source,
.operator {
  border-top: 1px solid var(--o-color-control1-light);
}
.source {
  max-height: 80vh;
}
</style>

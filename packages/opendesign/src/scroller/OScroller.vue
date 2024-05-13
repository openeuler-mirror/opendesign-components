<script lang="ts" setup>
import { ref } from 'vue';
import OScrollbar from './OScrollbar.vue';
import { scrollerProps } from './types';

const props = defineProps(scrollerProps);
const targetRef = ref<HTMLElement | null>(null);

const scrollTo = (options?: ScrollToOptions | undefined) => {
  if (!targetRef.value) {
    return;
  }
  targetRef.value.scrollTo(options);
};

defineExpose({
  scrollTo,
});
</script>

<template>
  <div class="o-scroller o-scrollbar-wrapper">
    <div
      ref="targetRef"
      class="o-scroller-container"
      :class="[
        {
          'is-x-disabled': props.disabledX,
          'is-y-disabled': props.disabledY,
        },
        props.wrapClass,
      ]"
    >
      <slot></slot>
    </div>
    <OScrollbar
      :target="targetRef"
      :disabled-x="props.disabledX"
      :disabled-y="props.disabledY"
      :duration="props.duration"
      :show-type="props.showType"
      :size="props.size"
      :auto-update-on-scroll-size="props.autoUpdateOnScrollSize"
    >
      <template #thumb><slot name="thumb"></slot></template>
      <template #track><slot name="track"></slot></template>
    </OScrollbar>
  </div>
</template>

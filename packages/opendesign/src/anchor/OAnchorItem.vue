<script setup lang="ts">
import { computed, inject, nextTick, onMounted, onUnmounted, provide, watch, ref } from 'vue';

import { OPopover } from '../popover';
import { isCurrentPageLink } from '../_utils/is.ts';
import { isEmptySlot } from '../_utils/vue-utils.ts';
import { isOverflown } from '../_utils/dom.ts';
import { anchorItemProps } from './types';
import { anchorInjectKey, anchorItemInjectKey } from './provide';

const props = defineProps(anchorItemProps);

const slots = defineSlots<{
  default(): any;
  title(): any;
}>();

const emits = defineEmits<{
  (e: 'item-click', event: MouseEvent): void;
}>();

const anchorInjection = inject(anchorInjectKey, null);
const anchorItemInjection = inject(anchorItemInjectKey, null);

const _observeHref = computed(() => props.observeHref || props.href);

const isActive = computed(() => {
  return _observeHref.value === anchorInjection?.activeLink.value;
});

const addItem = () => {
  if (!_observeHref.value) {
    return;
  }
  anchorInjection?.addLink(_observeHref.value);
};

const removeItem = () => {
  if (!_observeHref.value) {
    return;
  }
  anchorInjection?.removeLink(_observeHref.value);
};

const onClick = (event: MouseEvent) => {
  emits('item-click', event);
  if (props.disabled) {
    event.preventDefault();
    return;
  }
  if ((props.href && !isCurrentPageLink(props.href)) || (props.target && props.target !== '_self')) {
    // 如果非内部链接或target不是_self的话，采用a标签默认行为
    return;
  }
  if (!anchorInjection?.getChangeHash()) {
    event.preventDefault();
  }
  /**
   * @deprecated 兼容旧版本，计划1.2.0移除
   */
  anchorInjection?.onItemClick({
    event: event,
    link: _observeHref.value,
  });
  if (_observeHref.value) {
    anchorInjection?.scrollIntoView(_observeHref.value);
  }
};

watch(
  () => _observeHref.value,
  (newVal, oldVal) => {
    nextTick(() => {
      if (oldVal) {
        anchorInjection?.removeLink(oldVal);
      }
      if (newVal) {
        anchorInjection?.addLink(newVal);
      }
    });
  },
);

const depth = anchorItemInjection ? anchorItemInjection.depth + 1 : 1;

provide(anchorItemInjectKey, { depth });

onMounted(() => {
  addItem();
});

onUnmounted(() => {
  removeItem();
});

const popoverVisible = ref(false);
const handleMouseenter = (e: MouseEvent) => {
  if (!e.target || !isOverflown(e.target as HTMLDivElement)) {
    popoverVisible.value = false;
    return;
  }
  popoverVisible.value = true;
};
const handleMouseleave = () => {
  popoverVisible.value = false;
};
</script>

<template>
  <div
    :class="{
      'o-anchor-item': true,
      'with-children': !isEmptySlot(slots.default),
    }"
  >
    <OPopover
      :visible="popoverVisible"
      :disabled="!popoverVisible || anchorInjection?.layout.value === 'h'"
      position="right"
      wrap-class="o-anchor-link-popover-wrapper"
    >
      {{ props.title }}
      <template #target>
        <a
          :href="props.href"
          :target="props.target"
          :class="{ 'o-anchor-item-link': true, 'is-active': isActive, disabled: props.disabled, 'o-anchor-item-sub-link': depth > 1 }"
          :style="{ '--anchor-item-depth': depth - 1 }"
          :data-depth="depth - 1"
          @click="onClick"
        >
          <div v-if="anchorInjection?.layout.value === 'v'" class="o-anchor-item-lines">
            <div class="o-anchor-item-top-line"></div>
            <div class="o-anchor-item-circle"></div>
            <div class="o-anchor-item-bottom-line"></div>
          </div>
          <slot name="title">
            <div class="o-anchor-item-title" @mouseenter="handleMouseenter" @mouseleave="handleMouseleave">
              {{ props.title }}
            </div>
          </slot>
        </a>
      </template>
    </OPopover>

    <slot v-if="anchorInjection?.layout.value === 'v'"></slot>
  </div>
</template>

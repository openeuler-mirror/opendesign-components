<script setup lang="ts">
import { computed, provide, ref, useAttrs, useId, watch } from 'vue';

import { OPopup } from '../popup';
import { dropdownProps } from './types';
import { dropdownInjectKey } from './provide';
import { isUndefined } from '../_utils/is';
import { mergeClass } from '../_utils/vue-utils';

const props = defineProps(dropdownProps);

const emits = defineEmits<{
  /**
   * @zh-CN 下拉菜单显示状态更新时触发
   * @en-US Triggered when the dropdown visibility is updated
   */
  (e: 'update:visible', val: boolean): void;
  /**
   * @zh-CN 下拉菜单显示状态变化时触发
   * @en-US Triggered when the dropdown visibility changes
   */
  (e: 'visible-change', val: boolean): void;
}>();

const dropdownRef = ref<HTMLElement>();

const $attrs = useAttrs();
const generatedId = useId();

/**
 * @description 触发器与菜单共用的关联 id：消费方透传的 id 优先，保证根元素实际 DOM id 与菜单 aria-labelledby 同源；未透传时回退到 useId 生成的 SSR 友好 id
 * @returns {string} 触发器根元素 id
 */
const getTriggerId = () => String($attrs.id || generatedId);

const isVisible = ref(props.visible ?? props.defaultVisible);

/**
 * @description 镜像展开态到 aria-expanded：收起时输出 "false" 而非省略属性，让读屏始终能读到当前开合状态
 * @returns {'true' | 'false'} 展开为 "true"，收起为 "false"
 */
const ariaExpanded = computed<'true' | 'false'>(() => (isVisible.value ? 'true' : 'false'));

watch(
  () => props.visible,
  (val) => {
    if (!isUndefined(val)) {
      isVisible.value = val;
    }
  },
);

const updateVisible = (val: boolean) => {
  isVisible.value = val;
  emits('update:visible', val);
  emits('visible-change', val);
};

watch(isVisible, (val) => {
  updateVisible(val);
});

provide(dropdownInjectKey, { updateVisible });
</script>

<template>
  <div :id="getTriggerId()" ref="dropdownRef" class="o-dropdown" aria-haspopup="menu" :aria-expanded="ariaExpanded">
    <slot></slot>
    <OPopup
      v-model:visible="isVisible"
      :transition="props.transition"
      :unmount-on-hide="props.unmountOnHide"
      :position="props.optionPosition"
      :wrapper="props.optionsWrapper"
      :target="dropdownRef"
      :trigger="props.trigger"
      :offset="4"
      :adjust-min-width="props.optionWidthMode === 'min-width'"
      :adjust-width="props.optionWidthMode === 'width'"
    >
      <ul role="menu" :aria-labelledby="getTriggerId()" class="o-dropdown-list" :class="mergeClass(`o-dropdown-list-${props.size}`, props.optionWrapClass)">
        <slot name="dropdown"></slot>
      </ul>
    </OPopup>
  </div>
</template>

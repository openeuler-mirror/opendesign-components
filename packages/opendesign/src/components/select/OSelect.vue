<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue';
import { defaultSize } from '../_shared/global';
import { IconChevronDown, IconClose, IconLoading } from '../_shared/icons';
import { OPopup } from '../popup';
import { selectOptionInjectKey } from './provide';
import { SelectOptionT, selectProps } from './types';
import { getRoundClass } from '../_shared/style-class';
import ClientOnly from '../_shared/components/client-only';
import { OScroller } from '../scroller';
import { isFunction } from '../_shared/is';

const props = defineProps(selectProps);
const emits = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'change', value: string | number): void;
  (e: 'options-visible-change', value: boolean): void;
  (e: 'clear', evt: Event): void;
}>();

const Labels = {
  empty: '暂无数据',
};

const optionsRef = ref<HTMLElement | null>(null);

const round = getRoundClass(props, 'select');

const activeLabel = ref(props.modelValue || props.defaultValue);
const activeVal = ref(props.modelValue || props.defaultValue || '');

watch(
  () => props.modelValue,
  (v) => {
    activeVal.value = v || '';
  }
);

const isClearable = computed(() => props.clearable && !props.disabled);

// 清除值
const clearClick = (e: Event) => {
  e.stopPropagation();
  activeLabel.value = '';
  activeVal.value = '';
  emits('clear', e);
};

const selectRef = ref<HTMLElement>();

const isSelecting = ref(false);
provide(selectOptionInjectKey, {
  value: activeVal,
  update: async (val: SelectOptionT, userSelect?: boolean) => {
    activeLabel.value = val.label;

    if (userSelect) {
      if (isFunction(props.beforeSelect)) {
        const rlt = await props.beforeSelect(val, {
          label: activeLabel.value,
          value: activeVal.value,
        });
        if (rlt === false) {
          return;
        }
      }
      if (activeVal.value !== val.value) {
        emits('change', val.value);
        activeVal.value = val.value;
        // console.log('选中change', val.value, activeLabel.value);
      }
      emits('update:modelValue', val.value);
      isSelecting.value = false;
    }
  },
});

const updateLabel = (label: string, isVisible: boolean = false) => {
  activeLabel.value = label;
  isSelecting.value = isVisible;
};

const onOptionPopupChange = (visible: boolean) => {
  emits('options-visible-change', visible);
};

defineExpose({
  updateLabel,
});
</script>
<template>
  <div
    ref="selectRef"
    class="o-select"
    :class="[
      `o-select-${props.color}`,
      `o-select-${props.variant}`,
      `o-select-${props.size || defaultSize}`,
      round.class.value,
      {
        'is-selecting': isSelecting,
        'o-select-disabled': props.disabled,
        'o-select-clearable': isClearable && activeVal !== '',
        'o-select-is-loading': props.loading,
      },
    ]"
    :style="round.style.value"
  >
    <input :value="activeLabel" type="text" :placeholder="props.placeholder" class="o-select-input" readonly />
    <div class="o-select-suffix">
      <div class="o-select-suffix-icon">
        <div v-if="props.loading" class="o-select-loading"><IconLoading class="o-rotating" /></div>
        <div v-else-if="isClearable && activeVal !== ''" class="o-select-clear" @click="clearClick"><IconClose class="o-select-clear-icon" /></div>
        <div class="o-select-arrow" :class="{ active: isSelecting }">
          <slot name="arrow" :active="isSelecting">
            <IconChevronDown />
          </slot>
        </div>
      </div>
      <slot name="suffix" :active="isSelecting"></slot>
    </div>
    <ClientOnly>
      <teleport :to="optionsRef" :disabled="!optionsRef">
        <div v-show="optionsRef" class="o-select-option-wrap">
          <slot>
            <div class="o-select-options-empty">
              <slot name="empty">
                <span>{{ Labels.empty }}</span>
              </slot>
            </div>
          </slot>
        </div>
      </teleport>
      <OPopup
        v-if="!props.disabled"
        v-model:visible="isSelecting"
        :transition="props.transition"
        :unmount-on-hide="props.unmountOnHide"
        :position="props.optionPosition"
        :target="selectRef"
        :trigger="props.trigger"
        :offset="4"
        :adjust-min-width="props.optionWidthMode === 'min-width'"
        :adjust-width="props.optionWidthMode === 'width'"
        :before-show="props.beforeOptionsShow"
        :before-hide="props.beforeOptionsHide"
        @change="onOptionPopupChange"
      >
        <OScroller size="small" show-type="hover" :wrap-class="['o-select-options', `o-select-options-${props.size || defaultSize}`, props.optionWrapClass]">
          <div v-if="props.loading" class="o-select-options-loading"><IconLoading class="o-rotating" /></div>
          <div v-else ref="optionsRef"></div>
        </OScroller>
      </OPopup>
    </ClientOnly>
  </div>
</template>

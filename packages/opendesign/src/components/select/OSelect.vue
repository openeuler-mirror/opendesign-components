<script setup lang="ts">
import { provide, ref } from 'vue';
import { defaultSize, defaultShape } from '../_shared/global';
import type { SizeT, ShapeT } from '../_shared/global';
import { IconArrowTraingleDown } from '../icons';
import { OPopup, PopupPositionT } from '../popup';
import { selectOptionInjectKey } from './provide';
import { SelectOptionT } from './types';

interface SelectPropT {
  modelValue: string | number;
  size?: SizeT;
  shape?: ShapeT;
  placeholder?: string;
  disabled?: boolean;
  optionPosition?: PopupPositionT;
  optionWidthMode?: 'auto' | 'min-width' | 'width';
  optionWrapClass?: string;
  unmountOnClose?: boolean;
  /**
   * 默认初始值对应的label显示，不传则使用modelValue
   * 当unmountOnClose为true时，存在初始值对应label无法获取问题，可使用该属性指定初始值
   */
  defaultLabel?: string;
}
const props = withDefaults(defineProps<SelectPropT>(), {
  modelValue: '',
  size: defaultSize.value,
  shape: defaultShape.value,
  placeholder: 'please select...',
  optionPosition: 'bl',
  optionWidthMode: 'min-width',
  optionWrapClass: '',
  defaultLabel: '',
  unmountOnClose: true,
});

const activeLabel = ref(props.defaultLabel || props.modelValue);
const activeVal = ref(props.modelValue);
const emits = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'change', value: string | number): void;
}>();
const selectRef = ref<HTMLElement>();

const showOption = ref(false);
provide(selectOptionInjectKey, {
  value: activeVal,
  update: (val: SelectOptionT, emit?: boolean) => {
    activeLabel.value = val.label;
    console.log(activeLabel.value);

    if (emit) {
      emits('update:modelValue', val.value);
      emits('change', val.value);
      activeVal.value = val.value;
      showOption.value = false;
    }
  },
});
</script>
<template>
  <div
    ref="selectRef"
    class="o-select"
    :class="[`o-select-size-${props.size}`, `o-select-shape-${props.shape}`, { 'is-selecting': showOption, 'is-disabled': props.disabled }]"
  >
    <input :value="activeLabel" type="text" :placeholder="props.placeholder" class="o-select-input" readonly />
    <span class="o-select-suffix">
      <slot name="suffix">
        <span class="o-select-icon-arrow" :class="{ active: showOption }">
          <IconArrowTraingleDown />
        </span>
      </slot>
    </span>

    <OPopup
      v-model:visible="showOption"
      :unmount-on-close="props.unmountOnClose"
      :position="props.optionPosition"
      :target="selectRef"
      trigger="click"
      :offset="4"
      :adjust-min-width="props.optionWidthMode === 'min-width'"
      :adjust-width="props.optionWidthMode === 'width'"
    >
      <div class="o-select-options" :class="[`o-options-size-${props.size}`, props.optionWrapClass]">
        <slot></slot>
      </div>
    </OPopup>
  </div>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue';
import { defaultSize, defaultShape } from '../_shared/global';
import type { SizeT, ShapeT } from '../_shared/global';
import { ProvideOptionKey } from '../_shared/constant';
import type { OptionValueT } from '../_shared/global';
import { IconArrowTraingleDown } from '../icons';
import { OPopup, PopupPositionT } from '../popup';

interface SelectPropT {
  size?: SizeT;
  shape?: ShapeT;
  modelValue: string | number;
  placeholder?: string;
  disabled?: boolean;
  optionPosition?: PopupPositionT;
  optionWidthMode?: 'auto' | 'min-width' | 'width';
  optionWrapClass?: string;
}
const props = withDefaults(defineProps<SelectPropT>(), {
  modelValue: '',
  size: defaultSize.value,
  shape: defaultShape.value,
  placeholder: 'please select...',
  optionPosition: 'bl',
  optionWidthMode: 'min-width',
  optionWrapClass: '',
});

const activeLabel = ref('');
const activeVal = ref(props.modelValue);
const emits = defineEmits(['update:modelValue']);
const selectRef = ref<HTMLElement>();

const showOption = ref(false);
provide(`${OptionProvideKey}/update`, (val: OptionValueT, emit?: boolean) => {
  activeLabel.value = val.label;
  if (emit) {
    emits('update:modelValue', val.value);
    activeVal.value = val.value;
    showOption.value = false;
  }
});

provide(`${OptionProvideKey}/value`, activeVal);
const onOptionChange = (visible: boolean) => {
  if (visible) {
    console.log(selectRef.value?.clientWidth);
  }
};
</script>
<template>
  <div ref="selectRef" class="o-select" :class="[`o-select-size-${props.size}`, `o-select-shape-${props.shape}`, { 'is-selecting': showOption }]">
    <div class="o-select-wrap" :class="{ 'is-disabled': props.disabled }">
      <input :value="activeLabel" type="text" :placeholder="props.placeholder" class="o-select-input" readonly />
      <span class="o-select-suffix">
        <slot name="suffix">
          <span class="o-select-icon-arrow" :class="{ active: showOption }">
            <IconArrowTraingleDown />
          </span>
        </slot>
      </span>
    </div>
    <OPopup
      v-model:visible="showOption"
      :position="props.optionPosition"
      :target="selectRef"
      trigger="click"
      :offset="4"
      :adjust-min-width="props.optionWidthMode === 'min-width'"
      :adjust-width="props.optionWidthMode === 'width'"
      @change="onOptionChange"
    >
      <div class="o-select-options" :class="[`o-options-size-${props.size}`, props.optionWrapClass]">
        <slot></slot>
      </div>
    </OPopup>
  </div>
</template>

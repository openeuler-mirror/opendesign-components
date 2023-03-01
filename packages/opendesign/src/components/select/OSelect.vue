<script setup lang="ts">
import { provide, ref } from 'vue';
import { defaultSize } from '../_shared/global';
import { IconArrowTraingleDown } from '../icons';
import { OPopup } from '../popup';
import { selectOptionInjectKey } from './provide';
import { SelectOptionT, selectProps } from './types';
import { getRoundClass } from '../_shared/style-class';

const props = defineProps(selectProps);

const round = getRoundClass(props, 'select');

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

    if (emit) {
      if (activeVal.value !== val.value) {
        emits('change', val.value);
        activeVal.value = val.value;
        console.log('选中change', val.value, activeLabel.value);
      }
      emits('update:modelValue', val.value);
      showOption.value = false;
    }
  },
});
</script>
<template>
  <div
    ref="selectRef"
    class="o-select"
    :class="[
      `o-select-${props.color}`,
      `o-select-${props.variant}`,
      `o-select-size-${props.size || defaultSize}`,
      round.class.value,
      {
        'is-selecting': showOption,
        'o-select-disabled': props.disabled,
      },
    ]"
    :style="round.style.value"
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
      v-if="!props.disabled"
      v-model:visible="showOption"
      :transition="props.transition"
      :unmount-on-hide="props.unmountOnHide"
      :position="props.optionPosition"
      :target="selectRef"
      :trigger="props.trigger"
      :offset="4"
      :adjust-min-width="props.optionWidthMode === 'min-width'"
      :adjust-width="props.optionWidthMode === 'width'"
    >
      <div class="o-select-options" :class="[`o-select-options-size-${props.size || defaultSize}`, props.optionWrapClass]">
        <slot></slot>
      </div>
    </OPopup>
  </div>
</template>

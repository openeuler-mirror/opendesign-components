<script lang="ts">
export const OptionSlotNames = ['action', 'default', 'empty'];
</script>
<script setup lang="ts">
import { defaultSize } from '../_utils/global';
import { IconLoading } from '../_utils/icons';
import { OOptionList } from '../option';
import type { SizeT } from '../_utils/types';

interface OptionPropT {
  size?: SizeT;
  wrapClass?: string | any[];
  loading?: boolean;
  optionTitle?: string;
  multiple?: boolean;
  scroller?: boolean;
}
const props = defineProps<OptionPropT>();
</script>
<template>
  <div
    class="o-select-options"
    :class="[
      `o-select-options-${props.size || defaultSize}`,
      {
        'o-select-options-multiple': props.multiple,
      },
    ]"
  >
    <OOptionList :wrap-class="props.wrapClass" :scroller="props.scroller">
      <div v-if="props.loading" class="o-select-options-loading"><IconLoading class="o-rotating" /></div>
      <slot v-else name="option-target"> </slot>
    </OOptionList>

    <div v-if="$slots.action" class="o-select-actions">
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defaultSize } from '../_utils/global';
import { IconLoading } from '../_utils/icons';
import { OOptionList } from '../option';
import type { SizeT } from '../_utils/types';
import slot from './slot';
import { BaseScrollerPropsT } from '../scrollbar';

interface OptionPropT {
  size?: SizeT;
  wrapClass?: string | any[];
  loading?: boolean;
  optionTitle?: string;
  multiple?: boolean;
}
const props = defineProps<OptionPropT>();
const scrollbarCfg: Partial<BaseScrollerPropsT> = {
  barClass: 'o-select-options-scrollbar',
  size: 'small',
  showType: 'hover',
};
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
    <OOptionList :wrap-class="props.wrapClass" :scrollbar="scrollbarCfg">
      <div v-if="props.loading" class="o-select-options-loading">
        <IconLoading class="o-rotating" />
      </div>
      <slot v-else :name="slot.names.optionTarget"></slot>
    </OOptionList>

    <div v-if="$slots.action" class="o-select-actions">
      <slot :name="slot.option.names.action"></slot>
    </div>
  </div>
</template>

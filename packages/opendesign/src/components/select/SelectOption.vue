<script lang="ts">
export const OptionSlotNames = ['action', 'default', 'empty'];
</script>
<script setup lang="ts">
import { defaultSize } from '../_shared/global';
import { IconLoading } from '../_shared/icons';
import { OScroller } from '../scroller';
import type { SizeT } from '../_shared/types';

interface OptionPropT {
  size?: SizeT;
  wrapClass?: string | any[];
  loading?: boolean;
  optionTitle?: string;
  multiple?: boolean;
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
    <OScroller class="o-select-options-scroller" size="small" show-type="hover" :wrap-class="props.wrapClass">
      <div v-if="props.loading" class="o-select-options-loading"><IconLoading class="o-rotating" /></div>
      <template v-else>
        <div v-if="props.optionTitle" class="o-select-options-head">{{ props.optionTitle }}</div>

        <slot name="option-target">
          <div ref="optionsRef"></div>
        </slot>
      </template>
    </OScroller>
    <div class="o-select-actions">
      <slot name="action"></slot>
    </div>
  </div>
</template>

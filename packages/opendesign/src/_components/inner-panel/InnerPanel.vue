<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { innerPanelProps } from './types';
import { isPhonePad } from '../../_utils/global';
import { OPopup } from '../../popup';

const props = defineProps(innerPanelProps);

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
  (e: 'update:visible', val: boolean): void;
}>();

const isResponding = computed(() => {
  return !props.noResponsive && isPhonePad.value;
});
const updateVisible = (val: boolean) => {
  emits('update:visible', val);
};
</script>
<template>
  <!-- <ODialog
      v-model:visible="isSelecting"
      :before-show="props.beforeOptionsShow"
      :before-hide="props.beforeOptionsHide"
      hide-close
      class="o-select-dlg"
      :actions="props.multiple ? selectDlgAction : undefined"
      :mask-close="!props.multiple"
      :class="{
        'is-loading': props.loading,
      }"
      size="small"
      @change="onSelectDlgChange"
      v-if="isResponding"
    >
      <template v-if="props.optionTitle" #header>
        <div class="o-select-options-head">{{ props.optionTitle }}</div>
      </template>
      <SelectOption
        :size="props.size"
        :wrap-class="props.optionWrapClass"
        :loading="props.loading"
        class="o-select-options-dlg"
        :option-title="props.optionTitle"
        :multiple="props.multiple"
      >
        <template v-for="name in filterSlots($slots, OptionSlotNames)" #[name]="slotData">
          <slot :name="name" v-bind="slotData"></slot>
        </template>
        <template #option-target><div ref="optionsRef"></div></template>
      </SelectOption>
    </ODialog> -->
  <OPopup
    class="o-i-panel"
    :offset="props.offset"
    :edge-offset="props.edgeOffset"
    :visible="props.visible"
    :position="props.position"
    :trigger="props.trigger"
    :target="props.target"
    :wrapper="props.wrapper"
    :body-class="props.bodyClass"
    :anchor-class="props.anchor ? props.anchorClass : ''"
    :unmount-on-hide="props.unmountOnHide"
    :auto-hide="props.autoHide"
    :disabled="props.disabled"
    :transition="props.transition"
    :adjust-width="props.adjustWidth"
    :adjust-min-width="props.adjustMinWidth"
    :hide-when-target-invisible="props.hideWhenTargetInvisible"
    :hover-delay="props.hoverDelay"
    :before-hide="props.beforeHide"
    :before-show="props.beforeShow"
    @update:visible="updateVisible"
  >
    <slot></slot>
  </OPopup>
</template>

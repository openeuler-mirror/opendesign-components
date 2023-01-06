<script setup lang="ts">
import { provide, ref } from 'vue';
import { defaultSize, defaultShape } from '../_shared/global';
import type { SizeT, ShapeT } from '../_shared/global';
import { IconArrowTraingleDown } from '../icons';
import { OPopup, PopupPositionT, PopupTriggerT } from '../popup';
import { selectOptionInjectKey } from './provide';
import { SelectOptionT } from './types';

interface SelectPropT {
  /**
   * 下拉框的值
   * v-model
   */
  modelValue: string | number;
  /**
   * 大小
   */
  size?: SizeT;
  /**
   * 形状
   */
  shape?: ShapeT;
  /**
   * 提示文本
   */
  placeholder?: string;
  /**
   * 下拉选项触发方式
   */
  trigger?: PopupTriggerT;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 下拉选项位置
   */
  optionPosition?: PopupPositionT;
  /**
   * 下拉选项宽度自适应规则
   * 'auto':自动 | 'min-width':最小宽度与选择框一致 | 'width': 宽度与选择框一致
   */
  optionWidthMode?: 'auto' | 'min-width' | 'width';
  /**
   * 下拉容器自定义类
   */
  optionWrapClass?: string;
  /**
   * 是否在结束选择时，卸载下拉选项
   * v-model
   */
  unmountOnHide?: boolean;
  /**
   * 默认初始值对应的label显示，不传则使用modelValue
   * 当unmountOnClose为true时，存在初始值对应label无法获取问题，可使用该属性指定初始值
   */
  defaultLabel?: string;
  /**
   * 过渡名称
   */
  transition?: string;
}
const props = withDefaults(defineProps<SelectPropT>(), {
  modelValue: '',
  size: undefined,
  shape: undefined,
  placeholder: 'please select...',
  trigger: 'click',
  optionPosition: 'bl',
  optionWidthMode: 'min-width',
  optionWrapClass: '',
  defaultLabel: '',
  unmountOnHide: true,
  transition: undefined,
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
    :class="[
      `o-select-size-${props.size || defaultSize}`,
      `o-select-shape-${props.shape || defaultShape}`,
      { 'is-selecting': showOption, 'is-disabled': props.disabled },
    ]"
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
      :transition="props.transition"
      :unmount-on-hide="props.unmountOnHide"
      :position="props.optionPosition"
      :target="selectRef"
      :trigger="props.trigger"
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

<script setup lang="ts">
import { computed, inject, onUnmounted, ref, toRefs, toValue, watch } from 'vue';
import { selectOptionInjectKey } from '../select/provide';
import { optionProps } from './types';
import { SelectOptionData } from '../select/types';
import { OCheckbox } from '../checkbox';

const props = defineProps(optionProps);

// label增加响应式，用于支持国际化切换语言
const { label, value } = toRefs(props);

const selectInject = inject(selectOptionInjectKey, null);

const isMultiple = computed(() => toValue(selectInject?.multiple));

// renderLabel 函数（从 inject 获取，插槽优先）
const renderLabelFn = computed(() => toValue(selectInject?.renderLabelFn));

const currentVal = computed(() => {
  return selectInject?.selectValue.value;
});

const isActive = ref(false);
watch(
  [currentVal, value],
  () => {
    // 响应modelValue变化
    // 与 selectInject.select 拆分开，避免 modelValue 改变时，不必要地调用selectInject.select
    isActive.value = Boolean(currentVal.value?.includes(value.value));
  },
  // currentVal 会被 OSelect 通过数组下标及push方法修改，所以需要deep
  { immediate: true, deep: true },
);
watch(
  [value, label],
  ([newValue, newLabel]) => {
    // 初始化并同步 select 的候选项
    selectInject?.registerOption({
      label: newLabel || `${newValue}`,
      value: newValue,
    });
  },
  { immediate: true },
);

// 选项卸载时从 optionInfoMap 清理，保留 cachedOptionMap
onUnmounted(() => {
  selectInject?.unregisterOption?.({
    label: label.value || `${value.value}`,
    value: value.value,
  });
});

// limit 达到上限时，未选项变为 disabled
const isLimitReached = computed(() => {
  return selectInject?.limitReached?.value ?? false;
});

/**
 * 有效禁用状态：自身 disabled 或 limit 达上限且未被选中
 * 用于视觉禁用样式 + aria-disabled，但不禁止点击（点击由 select 回调处理 limit 逻辑）
 */
const effectiveDisabled = computed(() => {
  return props.disabled || (isLimitReached.value && !isActive.value);
});

/**
 * 构建 renderLabel 调用参数
 * @description 数据驱动模式下从 props.raw 保留所有自定义字段（icon、iconColor 等），
 * 用规范化后的 label/value/disabled 覆盖；插槽模式下 props.raw 为 undefined，等价于仅用三字段重建
 */
const optionData = computed<SelectOptionData>(() => ({
  ...(props.raw || {}),
  label: props.label || `${props.value}`,
  value: props.value,
  disabled: props.disabled,
}));

const clickOption = () => {
  // 只检查自身 disabled prop；limit 达上限时仍允许点击以触发 exceed-limit 事件
  if (!props.disabled) {
    selectInject?.select({
      label: label.value || `${value.value}`,
      value: value.value,
    });
  }
};
</script>
<template>
  <div class="o-option" role="option" :aria-selected="isActive" :aria-disabled="effectiveDisabled || undefined" @click="clickOption">
    <div
      class="o-option-item"
      :class="[
        {
          active: isActive,
          'o-option-disabled': effectiveDisabled,
          'o-option-multiple': isMultiple,
        },
      ]"
    >
      <OCheckbox
        v-if="isMultiple"
        :model-value="currentVal"
        :value="props.value"
        class="o-option-checkbox"
        :disabled="effectiveDisabled"
        :indeterminate="props.indeterminate"
      >
        <slot>
          <component :is="renderLabelFn(optionData, isActive)" v-if="renderLabelFn" />
          <template v-else>{{ props.label || `${props.value}` }}</template>
        </slot>
      </OCheckbox>
      <slot v-else>
        <component :is="renderLabelFn(optionData, isActive)" v-if="renderLabelFn" />
        <template v-else>{{ props.label || `${props.value}` }}</template>
      </slot>
    </div>
  </div>
</template>

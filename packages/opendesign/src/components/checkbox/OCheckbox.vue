<script lang="ts" setup>
import { computed, inject, nextTick, ref, watch } from 'vue';
import { checkboxGroupInjectKey } from '../checkbox-group/provide';
import { checkboxProps } from './types';
import { IconDone, IconMinus } from '../_shared/icons';
import { isArray, isUndefined } from '../_shared/is';

const props = defineProps(checkboxProps);

const emits = defineEmits<{
  (e: 'update:modelValue', val: Array<string | number>): void;
  (e: 'change', val: Array<string | number>, ev: Event): void;
}>();

const checkboxGroupInjection = inject(checkboxGroupInjectKey, null);

// 是否选中
const _checked = ref(props.defaultChecked);
const isChecked = computed(() => {
  if (isUndefined(props.value)) {
    return false;
  }
  if (checkboxGroupInjection) {
    return checkboxGroupInjection.realValue.value.includes(props.value);
  }

  if (isArray(props.modelValue)) {
    return props.modelValue.includes(props.value);
  }

  return _checked.value;
});

watch(
  isChecked,
  (val) => {
    _checked.value = val;
  },
  { immediate: true }
);

// 是否禁用
const isDisabled = computed(
  () =>
    checkboxGroupInjection?.disabled.value ||
    props.disabled ||
    (isChecked.value && checkboxGroupInjection?.isMinimum.value) ||
    (!isChecked.value && checkboxGroupInjection?.isMaximum.value)
);

const onClick = (ev: Event) => {
  ev.stopPropagation();
};

const onChange = (ev: Event) => {
  if (isUndefined(props.value)) {
    return;
  }

  const { checked } = ev.target as HTMLInputElement;

  const set = checkboxGroupInjection
    ? new Set([...checkboxGroupInjection.realValue.value])
    : isArray(props.modelValue)
    ? new Set([...props.modelValue])
    : new Set([]);
  if (checked) {
    set.add(props.value);
  } else {
    set.delete(props.value);
  }

  _checked.value = checked;
  const val = Array.from(set);
  emits('update:modelValue', val);
  checkboxGroupInjection?.updateModelValue(val);
  nextTick(() => {
    emits('change', val, ev);
    checkboxGroupInjection?.onChange(val, ev);
  });
};

defineExpose({
  checked: isChecked,
});
</script>

<template>
  <label
    class="o-checkbox"
    :class="{
      'o-checkbox-checked': isChecked,
      'o-checkbox-disabled': isDisabled,
      'o-checkbox-indeterminate': props.indeterminate,
    }"
  >
    <div class="o-checkbox-wrap">
      <input type="checkbox" :value="props.value" :disabled="isDisabled" :checked="isChecked" @click="onClick" @change="onChange" />
      <slot name="checkbox" :checked="isChecked" :disabled="isDisabled">
        <span class="o-checkbox-input">
          <IconMinus v-if="props.indeterminate" />
          <IconDone v-else-if="isChecked" />
        </span>
        <span class="o-checkbox-label">
          <slot></slot>
        </span>
      </slot>
    </div>
  </label>
</template>

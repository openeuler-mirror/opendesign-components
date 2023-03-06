<script lang="ts" setup>
import { computed, inject, nextTick, ref, watch } from 'vue';
import { checkboxGroupInjectKey } from '../checkbox-group/provide';
import { checkboxProps } from './types';
import { IconDone, IconMinus } from '../_shared/icons';
import { isArray, isUndefined } from '../_shared/is';

const props = defineProps(checkboxProps);

const emits = defineEmits<{
  (e: 'update:modelValue', val: Array<string | number>): void;
  (e: 'change', val: Array<string | number>): void;
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
    emits('change', val);
    checkboxGroupInjection?.onChange(val);
  });
};

defineExpose({
  checked: isChecked,
});
</script>

<template>
  <label class="o-checkbox" :class="{ 'is-checked': isChecked, 'is-disabled': isDisabled, 'is-indeterminate': indeterminate }">
    <div class="o-checkbox-wrapper">
      <input type="checkbox" :value="value" :disabled="isDisabled" :checked="isChecked" @click="onClick" @change="onChange" />
      <slot v-if="$slots.checkbox" name="checkbox" :checked="isChecked" :disabled="isDisabled"></slot>
      <template v-else>
        <span class="o-checkbox-input">
          <IconMinus v-if="indeterminate" />
          <IconDone v-else-if="isChecked" />
        </span>
        <span class="o-checkbox-label">
          <slot></slot>
        </span>
      </template>
    </div>
  </label>
</template>

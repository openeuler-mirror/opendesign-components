<script lang="ts" setup>
import { computed, inject, nextTick, ref, watch } from 'vue';
import { checkboxGroupInjectKey } from '../checkbox-group/provide';
import { IconDone, IconMinus } from '../_shared/icons';
import { isArray } from '../_shared/is';

interface CheckboxPropT {
  /**
   * 多选框value
   */
  value: string | number;
  /**
   * 多选框双向绑定值
   */
  modelValue?: Array<string | number>;
  /**
   * 非受控状态时，默认是否选中
   */
  defaultChecked?: boolean;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 是否为半选状态
   */
  indeterminate?: boolean;
}
const props = withDefaults(defineProps<CheckboxPropT>(), {
  modelValue: undefined,
  defaultChecked: false,
  disabled: false,
});

const emits = defineEmits<{
  (e: 'update:modelValue', val: Array<string | number>): void;
  (e: 'change', val: Array<string | number>): void;
}>();

const checkboxGroupInjection = inject(checkboxGroupInjectKey, null);
// 监听modelValue改变
const isModelValueChanged = ref(false);

watch(
  () => props.modelValue,
  () => {
    isModelValueChanged.value = true;
  },
  { deep: true }
);

// 是否选中
const _checked = ref(props.defaultChecked);
const isChecked = computed(() => {
  if (checkboxGroupInjection) {
    return isArray(checkboxGroupInjection.realValue.value) ? checkboxGroupInjection.realValue.value.includes(props.value) : false;
  }

  if (isArray(props.modelValue) || isModelValueChanged.value) {
    return isArray(props.modelValue) ? props.modelValue.includes(props.value) : false;
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
        <span class="o-checkbox-icon">
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

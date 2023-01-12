<script lang="ts" setup>
import { computed, inject, nextTick } from 'vue';
import { checkboxGroupInjectKey } from '../checkbox-group/provide';
import { IconDone } from '../icons';

interface CheckboxPropT {
  /**
   * 多选框value
   */
  value: string | number;
  /**
   * 双向绑定值
   */
  modelValue?: Array<string | number>;
  /**
   * 是否禁用
   */
  disabled?: boolean;
}
const props = withDefaults(defineProps<CheckboxPropT>(), {
  modelValue: () => [],
  disabled: false,
});

const emits = defineEmits<{
  (e: 'update:modelValue', val: Array<string | number>): void;
  (e: 'change', val: Array<string | number>): void;
}>();

const checkboxGroupInjection = inject(checkboxGroupInjectKey, null);

// 是否禁用
const isDisabled = computed(() => checkboxGroupInjection?.disabled.value || props.disabled);

// 是否选中
const isChecked = computed(() =>
  checkboxGroupInjection ? checkboxGroupInjection.modelValue.value.includes(props.value) : props.modelValue?.includes(props.value)
);

const onClick = (ev: Event) => {
  ev.stopPropagation();
};

const onChange = (ev: Event) => {
  const { checked } = ev.target as HTMLInputElement;

  const set = checkboxGroupInjection ? new Set([...checkboxGroupInjection.modelValue.value]) : new Set([...props.modelValue]);
  if (checked) {
    set.add(props.value);
  } else {
    set.delete(props.value);
  }

  const val = Array.from(set);
  emits('update:modelValue', val);
  checkboxGroupInjection?.onModelValueUpdate(val);
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
  <label class="o-checkbox" :class="{ 'is-checked': isChecked, 'is-disabled': isDisabled }">
    <input type="checkbox" :disabled="isDisabled" :checked="isChecked" @click="onClick" @change="onChange" />
    <slot v-if="$slots.checkbox" name="checkbox" :checked="isChecked" :disabled="isDisabled"></slot>
    <template v-else>
      <span class="o-checkbox-icon">
        <IconDone v-if="isChecked" />
      </span>
      <span class="o-checkbox-label">
        <slot></slot>
      </span>
    </template>
  </label>
</template>

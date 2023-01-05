<script lang="ts" setup>
import { computed, inject, watch } from 'vue';
import { checkboxGroupInjectKey } from '../checkbox-group/provide';
import { IconDone } from '../icons';

interface CheckboxPropT {
  value: string | number;
  modelValue?: Array<string | number>;
  disabled?: boolean;
}
const props = withDefaults(defineProps<CheckboxPropT>(), {
  modelValue: () => [],
  disabled: false,
});

const emits = defineEmits<{
  (e: 'update:modelValue', val: Array<string | number>): void;
  (e: 'change', rlt: { value: Array<string | number>; checked: boolean }): void;
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
  let newVal: Array<string | number> = [];
  const set = checkboxGroupInjection ? new Set([...checkboxGroupInjection.modelValue.value]) : new Set([...props.modelValue]);
  if (checked) {
    set.add(props.value);
  } else {
    set.delete(props.value);
  }
  newVal = Array.from(set);
  checkboxGroupInjection?.onChange(newVal);
  emits('update:modelValue', newVal);
};

watch(
  () => isChecked.value,
  () => {
    emits('change', { value: checkboxGroupInjection ? checkboxGroupInjection.modelValue.value : props.modelValue, checked: isChecked.value });
  }
);
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

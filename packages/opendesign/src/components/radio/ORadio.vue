<script lang="ts" setup>
import { computed, inject, watch } from 'vue';
import { radioGroupInjectKey } from '../radio-group/provide';

interface RadioPropT {
  value: string | boolean | number;
  modelValue?: string | boolean | number;
  disabled?: boolean;
}
const props = withDefaults(defineProps<RadioPropT>(), {
  modelValue: undefined,
  disabled: false,
});

const emits = defineEmits<{
  (e: 'update:modelValue', val: string | number | boolean): void;
  (e: 'change', rlt: { value: string | number | boolean; checked: boolean }): void;
}>();

const radioGroupInjection = inject(radioGroupInjectKey, null);

// 是否选中
const isChecked = computed(() => props.value === (radioGroupInjection ? radioGroupInjection.modelValue.value : props.modelValue));

// 是否disabled
const isDisabled = computed(() => radioGroupInjection?.disabled.value || props.disabled);

const onClick = (ev: Event) => {
  ev.stopPropagation();
};

const onChange = () => {
  if (isDisabled.value) {
    return;
  }

  const val = props.value;
  radioGroupInjection?.onChange(val);
  emits('update:modelValue', val);
};

watch(
  () => isChecked.value,
  () => {
    emits('change', {
      value: radioGroupInjection ? radioGroupInjection.modelValue.value : (props.modelValue as string | number | boolean),
      checked: isChecked.value,
    });
  }
);
</script>

<template>
  <label class="o-radio" :class="{ 'is-checked': isChecked, 'is-disabled': isDisabled }">
    <input type="radio" :disabled="isDisabled" :checked="isChecked" @click="onClick" @change="onChange" />
    <slot v-if="$slots.radio" name="radio" :checked="isChecked" :disabled="isDisabled"></slot>
    <template v-else>
      <span class="o-radio-icon"></span>
      <span class="o-radio-label">
        <slot></slot>
      </span>
    </template>
  </label>
</template>

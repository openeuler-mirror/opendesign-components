<script lang="ts" setup>
import { computed, inject, nextTick, ref, watch } from 'vue';
import { radioProps } from './types';
import { radioGroupInjectKey } from '../radio-group/provide';
import { isUndefined } from '../_shared/is';

const props = defineProps(radioProps);

const emits = defineEmits<{
  (e: 'update:modelValue', val: string | number | boolean): void;
  (e: 'change', val: string | number | boolean, ev: Event): void;
}>();

const radioGroupInjection = inject(radioGroupInjectKey, null);

// 是否选中
const _checked = ref(props.defaultChecked);

const isChecked = computed(() => {
  if (radioGroupInjection) {
    return radioGroupInjection.realValue.value === props.value;
  }

  if (!isUndefined(props.modelValue)) {
    return props.modelValue === props.value;
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

defineExpose({
  checked: isChecked,
});

// 是否disabled
const isDisabled = computed(() => radioGroupInjection?.disabled.value || props.disabled);

const onClick = (ev: Event) => {
  ev.stopPropagation();
};

const onChange = (ev: Event) => {
  if (isDisabled.value) {
    return;
  }

  _checked.value = true;

  const val = props.value ?? true;
  emits('update:modelValue', val);
  radioGroupInjection?.updateModelValue(val);
  nextTick(() => {
    emits('change', val, ev);
    radioGroupInjection?.onChange(val, ev);
  });
};
</script>

<template>
  <label
    class="o-radio"
    :class="{
      'o-radio-checked': isChecked,
      'o-radio-disabled': isDisabled,
    }"
  >
    <div class="o-radio-wrap">
      <input type="radio" :value="props.value" :disabled="isDisabled" :checked="isChecked" @click="onClick" @change="onChange" />
      <slot v-if="$slots.radio" name="radio" :checked="isChecked" :disabled="isDisabled"></slot>
      <template v-else>
        <span class="o-radio-input"></span>
        <span class="o-radio-label">
          <slot></slot>
        </span>
      </template>
    </div>
  </label>
</template>

<script lang="ts" setup>
import { computed, inject, nextTick, provide, ref, watch } from 'vue';
import { radioInjectKey } from './provide';
import { radioProps } from './types';
import { radioGroupInjectKey } from '../radio-group/provide';
import { isUndefined } from '../_utils/is';
import { vUid } from '../directves';

const props = defineProps(radioProps);

const emits = defineEmits<{
  (e: 'update:modelValue', val: string | number | boolean): void;
  (e: 'change', val: string | number | boolean, ev: Event): void;
}>();

const inputEl = ref<HTMLElement | null>(null);
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

provide(radioInjectKey, {
  checked: isChecked,
  disabled: isDisabled,
});
</script>

<template>
  <label
    class="o-radio"
    :class="{
      'o-radio-checked': isChecked,
      'o-radio-disabled': isDisabled,
    }"
    :for="inputEl?.id"
  >
    <div class="o-radio-wrap">
      <input ref="inputEl" v-uid type="radio" :value="props.value" :disabled="isDisabled" :checked="isChecked" @click="onClick" @change="onChange" />
      <slot name="radio" :checked="isChecked" :disabled="isDisabled">
        <div class="o-radio-input-wrap">
          <span class="o-radio-input"></span>
        </div>
        <span class="o-radio-label">
          <slot></slot>
        </span>
      </slot>
    </div>
  </label>
</template>

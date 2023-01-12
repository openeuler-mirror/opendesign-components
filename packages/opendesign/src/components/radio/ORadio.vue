<script lang="ts" setup>
import { computed, inject, nextTick } from 'vue';
import { radioGroupInjectKey } from '../radio-group/provide';

interface RadioPropT {
  /**
   * 单选框value
   */
  value: string | boolean | number;
  /**
   * 双向绑定值
   */
  modelValue?: string | boolean | number;
  /**
   * 是否禁用
   */
  disabled?: boolean;
}
const props = withDefaults(defineProps<RadioPropT>(), {
  modelValue: undefined,
  disabled: false,
});

const emits = defineEmits<{
  (e: 'update:modelValue', val: string | number | boolean): void;
  (e: 'change', val: string | number | boolean): void;
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
  emits('update:modelValue', val);
  radioGroupInjection?.onModelValueUpdate(val);
  nextTick(() => {
    emits('change', val);
    radioGroupInjection?.onChange(val);
  });
};

defineExpose({
  checked: isChecked,
});
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

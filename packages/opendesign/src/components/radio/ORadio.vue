<script lang="ts" setup>
import { computed, inject, nextTick, ref, watch } from 'vue';
import { radioGroupInjectKey } from '../radio-group/provide';
import { isUndefined } from '../_shared/is';

interface RadioPropT {
  /**
   * 单选框value
   */
  value: string | number | boolean;
  /**
   * 单选框双向绑定值
   */
  modelValue?: string | number | boolean;
  /**
   * 非受控状态时，默认是否选中
   */
  defaultChecked?: boolean;
  /**
   * 是否禁用
   */
  disabled?: boolean;
}

const props = withDefaults(defineProps<RadioPropT>(), {
  modelValue: undefined,
  defaultChecked: false,
  disabled: false,
});

const emits = defineEmits<{
  (e: 'update:modelValue', val: string | number | boolean): void;
  (e: 'change', val: string | number | boolean): void;
}>();

const radioGroupInjection = inject(radioGroupInjectKey, null);

// 监听modelValue改变
const isModelValueChanged = ref(false);
watch(
  () => props.modelValue,
  () => {
    isModelValueChanged.value = true;
  }
);

// 是否选中
const _checked = ref(props.defaultChecked);
const isChecked = computed(() => {
  if (radioGroupInjection) {
    return props.value === radioGroupInjection.realValue.value;
  }

  if (!isUndefined(props.modelValue) || isModelValueChanged.value) {
    return props.value === props.modelValue;
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

const onChange = () => {
  if (isDisabled.value) {
    return;
  }

  _checked.value = true;

  const val = props.value;
  emits('update:modelValue', val);
  radioGroupInjection?.updateModelValue(val);
  nextTick(() => {
    emits('change', val);
    radioGroupInjection?.onChange(val);
  });
};
</script>

<template>
  <label class="o-radio" :class="{ 'is-checked': isChecked, 'is-disabled': isDisabled }">
    <div class="o-radio-wrapper">
      <input type="radio" :value="value" :disabled="isDisabled" :checked="isChecked" @click="onClick" @change="onChange" />
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

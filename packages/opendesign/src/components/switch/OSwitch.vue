<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { defaultSize, defaultShape } from '../_shared/global';
import type { SizeT, ShapeT } from '../_shared/global';
import { IconLoading } from '../_shared/icons';
import { isPromise, isBoolean, isUndefined } from '../_shared/is';

interface SwitchPropT {
  /**
   * 双向绑定值
   */
  modelValue?: string | number | boolean;
  /**
   * 选中状态对应值
   */
  checkedValue?: string | number | boolean;
  /**
   * 未选中状态对应值
   */
  uncheckedValue?: string | number | boolean;
  /**
   * 非受控状态时，默认是否选中
   */
  defaultChecked?: boolean;
  /**
   * 开关尺寸
   * 'large' | 'normal' | 'small'
   */
  size?: SizeT;
  /**
   * 开关形状
   * 'normal' | 'round'
   */
  shape?: ShapeT;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 是否加载中
   */
  loading?: boolean;
  /**
   *
   * 状态改变前的钩子函数
   */
  beforeChange?: (val: boolean) => Promise<boolean> | boolean;
}

const props = withDefaults(defineProps<SwitchPropT>(), {
  modelValue: undefined,
  checkedValue: true,
  uncheckedValue: false,
  defaultChecked: false,
  size: undefined,
  shape: undefined,
  disabled: false,
  loading: false,
  beforeChange: undefined,
});

const emits = defineEmits<{
  (e: 'update:modelValue', val: string | number | boolean): void;
  (e: 'change', val: string | number | boolean): void;
}>();

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
  if (!isUndefined(props.modelValue) || isModelValueChanged.value) {
    return props.checkedValue === props.modelValue;
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

const isChangeable = (): Promise<boolean> => {
  if (props.loading || props.disabled) {
    return Promise.resolve(false);
  }

  if (!props.beforeChange) {
    return Promise.resolve(true);
  }

  const res = props.beforeChange(!isChecked.value);
  if (!(isPromise(res) || isBoolean(res))) {
    return Promise.reject('beforeChange should return  type `Promise<boolean>` or `boolean`');
  }

  return isBoolean(res) ? Promise.resolve(res) : res;
};

const onClick = () => {
  isChangeable()
    .then((flag) => {
      if (flag) {
        const checked = !isChecked.value;
        _checked.value = checked;
        const val = checked ? props.checkedValue : props.uncheckedValue;
        emits('update:modelValue', val);
        emits('change', val);
      }
    })
    .catch((err) => {
      console.warn(`${err}`);
    });
};
</script>

<template>
  <div
    class="o-switch"
    :class="[
      `o-switch-size-${props.size || defaultSize}`,
      `o-switch-shape-${props.shape || defaultShape}`,
      { 'is-checked': isChecked },
      { 'is-disabled': props.disabled },
      { 'is-loading': props.loading },
    ]"
    @click="onClick"
  >
    <div class="o-switch-wrapper">
      <div class="o-switch-handler">
        <span v-if="props.loading" class="o-switch-icon-loading o-rotating">
          <IconLoading />
        </span>
      </div>
      <div v-if="$slots.on || $slots.off" class="o-switch-content">
        <slot v-if="isChecked" name="on"></slot>
        <slot v-else name="off"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { defaultSize, defaultShape } from '../_shared/global';
import type { SizeT, ShapeT } from '../_shared/global';
import { IconClose } from '../_shared/icons';
import { isUndefined } from '../_shared/is';

type TagStatusT = 'normal' | 'success' | 'warning' | 'danger';

interface TagPropT {
  /**
   * 标签状态
   * 'normal' | 'success' | 'warning' | 'danger'
   */
  status?: TagStatusT;
  /**
   * 是否有边框
   */
  bordered?: boolean;
  /**
   * 标签尺寸
   * 'normal' | 'large' | 'small'
   */
  size?: SizeT;
  /**
   * 标签形状
   * 'normal' | 'round'
   */
  shape?: ShapeT;
  /**
   * 是否可关闭
   */
  closable?: boolean;
  /**
   * 是否可选中
   */
  checkable?: boolean;
  /**
   * 是否被选中(标签可选中时该属性生效)
   */
  checked?: boolean;
  /**
   * 非受控状态时，默认是否选中(标签可选中时该属性生效)
   */
  defaultChecked?: boolean;
}

const props = withDefaults(defineProps<TagPropT>(), {
  status: 'normal',
  bordered: false,
  size: undefined,
  shape: undefined,
  closable: false,
  checkable: false,
  checked: undefined,
  defaultChecked: false,
});

const emits = defineEmits<{
  (e: 'update:checked', val: boolean): void;
  (e: 'change', val: boolean): void;
  (e: 'close'): void;
}>();

// 是否可见
const isVisible = ref(true);

// 监听checked属性改变
const isCheckedChanged = ref(false);

watch(
  () => props.checked,
  () => {
    isCheckedChanged.value = true;
  }
);

// 是否选中
const _checked = ref(props.defaultChecked);
const isChecked = computed(() => {
  if (!props.checkable) {
    return false;
  }

  if (!isUndefined(props.checked) || isCheckedChanged.value) {
    return props.checked ?? false;
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

const onClick = () => {
  if (props.checkable) {
    const checked = !isChecked.value;
    _checked.value = checked;
    emits('update:checked', checked);
    emits('change', checked);
  }
};

const onClose = (ev: Event) => {
  ev.stopPropagation();
  isVisible.value = false;
  emits('close');
};
</script>

<template>
  <span
    v-if="isVisible"
    class="o-tag"
    :class="[
      `o-tag-status-${props.status}`,
      `o-tag-size-${props.size || defaultSize}`,
      `o-tag-shape-${props.shape || defaultShape}`,
      { 'o-tag-bordered': props.bordered },
      { 'o-tag-checkable': props.checkable },
      { 'o-tag-checked': isChecked },
    ]"
    @click="onClick"
  >
    <span v-if="$slots.icon" class="o-tag-icon prefix">
      <slot name="icon"></slot>
    </span>
    <slot></slot>
    <span v-if="props.closable" class="o-tag-icon o-tag-icon-close suffix" @click="onClose">
      <IconClose />
    </span>
  </span>
</template>

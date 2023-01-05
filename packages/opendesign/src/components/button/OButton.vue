<script setup lang="ts">
import { defaultSize, defaultShape } from '../_shared/global';
import type { SizeT, ShapeT } from '../_shared/global';
import { ButtonTypeT } from './types';
import { IconLoading } from '../_shared/icons';
import { computed } from 'vue';

interface ButtonPropT {
  /**
   * 按钮类型："outline" | "primary" | "text" | "link"
   */
  type?: ButtonTypeT;
  /**
   * 按钮尺寸："normal" | "small" | "large"
   */
  size?: SizeT;
  /**
   * 按钮形状："normal" | "round"
   */
  shape?: ShapeT;
  /**
   * 是否为loading状态
   */
  loading?: boolean;
}
const props = withDefaults(defineProps<ButtonPropT>(), {
  type: 'outline',
  size: undefined,
  shape: defaultShape.value,
});
const size = computed(() => props.size || defaultSize.value);
</script>
<template>
  <button
    type="button"
    class="o-btn"
    :class="[
      `o-btn-${props.type}`,
      `o-btn-size-${size}`,
      `o-btn-shape-${props.shape}`,
      {
        'o-btn-icon-only': $slots.icon && !$slots.default,
      },
    ]"
  >
    <span v-if="$slots.icon || props.loading" class="o-btn-icon prefix" :class="{ loading: props.loading }">
      <IconLoading v-if="props.loading" class="o-roating" />
      <slot v-else-if="$slots.icon" name="icon"></slot>
    </span>
    <slot></slot>
  </button>
</template>

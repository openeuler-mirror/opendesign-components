<script setup lang="ts">
import type { DividerTypeT, DividerContentPositionT } from './types';
import type { DirectionT } from '../_shared/global';

interface DividerPropT {
  /**
   * 分割线类型
   * 'solid' | 'dashed' | 'dotted'
   */
  type?: DividerTypeT;
  /**
   * 分割线方向
   * 'horizontal' | 'vertical'
   */
  direction?: DirectionT;
  /**
   * 自定义内容位置
   * 'left' | 'center' | 'right'
   */
  contentPosition?: DividerContentPositionT;
}

const props = withDefaults(defineProps<DividerPropT>(), {
  type: 'solid',
  direction: 'horizontal',
  contentPosition: 'center',
});
</script>

<template>
  <div
    role="separator"
    class="o-divider"
    :class="[`o-divider-${props.type}`, `o-divider-direction-${props.direction}`, { [`o-divider-content-${props.contentPosition}`]: $slots.default }]"
  >
    <template v-if="props.direction === 'horizontal'">
      <div class="o-divider-line"></div>
      <template v-if="$slots.default">
        <div class="o-divider-content">
          <slot></slot>
        </div>
        <div class="o-divider-line"></div>
      </template>
    </template>
  </div>
</template>

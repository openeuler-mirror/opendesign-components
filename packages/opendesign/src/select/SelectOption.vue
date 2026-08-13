<script setup lang="ts">
import { ref, computed } from 'vue';
import { defaultSize } from '../_utils/global';
import { IconLoading } from '../_utils/icons';
import { OOptionList } from '../option';
import { OVirtualList } from '../virtual-list';
import type { VirtualListExpose } from '../virtual-list';
import type { SizeT } from '../_utils/types';
import slot from './slot';
import { BaseScrollerPropsT } from '../scrollbar';
import type { SelectVirtualItem } from './types';

const props = defineProps<{
  size?: SizeT;
  wrapClass?: string | { [k: string]: boolean } | Array<{ [k: string]: boolean } | string>;
  loading?: boolean;
  optionTitle?: string;
  multiple?: boolean;
  /** 选项容器唯一 id，供 OSelect input 的 aria-controls 引用 */
  listboxId?: string;
  /** 是否开启虚拟滚动 */
  virtual?: boolean;
  /** 虚拟列表配置项 */
  virtualListProps?: Record<string, unknown>;
  /** 虚拟滚动模式下的扁平化列表数据 */
  virtualItems?: SelectVirtualItem[];
  /** 空状态插槽内容（虚拟模式下无选项时显示） */
  emptySlot?: any;
}>();

// 透传选项列表滚动事件（scroll 事件不冒泡，用 capture 捕获）
const emits = defineEmits<{
  (e: 'scroll', evt: Event): void;
}>();

const onScrollCapture = (evt: Event) => {
  emits('scroll', evt);
};

const scrollbarCfg: Partial<BaseScrollerPropsT> = {
  barClass: 'o-select-options-scrollbar',
  size: 'small',
  showType: 'hover',
};

/** OVirtualList 实例引用，供 OSelect 通过 expose 间接访问 */
const virtualListRef = ref<VirtualListExpose | null>(null);

/** 虚拟模式下是否为空（无数据且非加载中） */
const isVirtualEmpty = computed(() => {
  return !props.loading && (!props.virtualItems || props.virtualItems.length === 0);
});

defineExpose({ virtualListRef });
</script>
<template>
  <div
    :id="props.listboxId"
    role="listbox"
    class="o-select-options"
    :class="[
      `o-select-options-${props.size || defaultSize}`,
      {
        'o-select-options-multiple': props.multiple,
        'is-virtual': props.virtual,
      },
    ]"
    @scroll.capture="onScrollCapture"
  >
    <!-- 虚拟滚动模式 -->
    <template v-if="props.virtual">
      <div v-if="props.loading" class="o-select-options-loading">
        <IconLoading class="o-rotating" />
      </div>
      <div v-else-if="isVirtualEmpty" class="o-select-empty">
        <slot name="empty-content" />
      </div>
      <OVirtualList v-else ref="virtualListRef" :list="props.virtualItems!" v-bind="props.virtualListProps" class="o-option-list">
        <template #default="{ item }">
          <slot name="virtual-item" :item="item" />
        </template>
      </OVirtualList>
    </template>
    <!-- 非虚拟模式（现有逻辑） -->
    <OOptionList v-else :wrap-class="props.wrapClass" :scrollbar="scrollbarCfg">
      <div v-if="props.loading" class="o-select-options-loading">
        <IconLoading class="o-rotating" />
      </div>
      <slot v-else :name="slot.names.optionTarget"></slot>
    </OOptionList>

    <div v-if="$slots.action" class="o-select-actions">
      <slot :name="slot.option.names.action"></slot>
    </div>
  </div>
</template>

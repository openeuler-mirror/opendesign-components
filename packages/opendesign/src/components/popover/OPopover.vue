<script setup lang="ts">
import { PropType, ComponentPublicInstance } from 'vue';
import { OPopup, PopupPositionT, PopupTriggerT } from '../popup';

const props = defineProps({
  /**
   * 弹出位置
   */
  position: {
    type: String as PropType<PopupPositionT>,
    default: 'top',
  },
  /**
   * 触发事件
   * 'hover','click','focus','contextMenu'
   */
  trigger: {
    type: [String, Array<String>] as PropType<PopupTriggerT | PopupTriggerT[]>,
    default: 'hover',
  },
  /**
   * 触发元素或组件
   */
  target: {
    type: [String, Object] as PropType<string | ComponentPublicInstance | HTMLElement | null>,
    default: null,
    require: true,
  },
  /**
   * 是否可见
   * v-model
   */
  visible: {
    type: Boolean,
  },
  /**
   * 挂载容器，默认为body
   */
  wrapper: {
    type: [String, Object] as PropType<string | HTMLElement>,
    default: document.body,
  },
  /**
   * 是否在隐藏时卸载
   */
  unmountOnClose: {
    type: Boolean,
    default: true,
  },
  /**
   * 距离触发元素的偏移量
   */
  offset: {
    type: Number,
    default: 8,
  },
});

const emits = defineEmits<{ (e: 'update:visible', val: boolean): void }>();
const updateVisible = (val: boolean) => {
  emits('update:visible', val);
};
</script>
<template>
  <OPopup
    class="o-popover"
    :offset="props.offset"
    :visible="props.visible"
    :position="props.position"
    :trigger="props.trigger"
    :target="props.target"
    :wrapper="props.wrapper"
    anchor-class="o-popover-anchor"
    :unmount-on-close="props.unmountOnClose"
    @update:visible="updateVisible"
  >
    <div class="o-popover-wrap">
      <slot></slot>
    </div>
  </OPopup>
</template>

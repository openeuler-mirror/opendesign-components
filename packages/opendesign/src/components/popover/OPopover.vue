<script setup lang="ts">
import { PropType, ComponentPublicInstance } from 'vue';
import { OPopup, PopupPosition, PopupTrigger } from '../popup';

const props = defineProps({
  /**
   * 弹出位置
   */
  position: {
    type: String as PropType<PopupPosition>,
    default: PopupPosition.LB,
  },
  /**
   * 触发事件
   * 'hover','click','focus','contextMenu'
   */
  trigger: {
    type: [String, Array<String>] as PropType<PopupTrigger | PopupTrigger[]>,
    default: PopupTrigger.HOVER,
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
});

const emits = defineEmits<{ (e: 'update:visible', val: boolean): void }>();
const updateVisible = (val: boolean) => {
  emits('update:visible', val);
};
</script>
<template>
  <OPopup
    :visible="props.visible"
    :position="props.position"
    :trigger="props.trigger"
    :target="props.target"
    :wrapper="props.wrapper"
    @update:visible="updateVisible"
  >
    <div class="o-popover">
      <slot></slot>
    </div>
  </OPopup>
</template>

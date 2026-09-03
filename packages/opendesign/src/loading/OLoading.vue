<script setup lang="ts">
import { IconLoading } from '../_utils/icons';
import { OLayer } from '../layer';

import { loadingProps } from './types';
import { mergeClass } from '../_utils/vue-utils';
import { ref } from 'vue';

const props = defineProps(loadingProps);

const emits = defineEmits<{
  /**
   * @zh-CN 加载状态可见性变化时触发
   * @en-US Triggered when the loading visibility changes
   */
  (e: 'change', val: boolean): void;
  /**
   * @zh-CN 加载状态可见性更新时触发
   * @en-US Triggered when the loading visibility is updated
   */
  (e: 'update:visible', val: boolean, evt?: MouseEvent): void;
}>();
const layerRef = ref<InstanceType<typeof OLayer> | null>(null);

defineExpose({
  /**
   * @zh-CN 切换加载状态显示
   * @en-US Toggle loading visibility
   */
  toggle(show?: boolean) {
    layerRef.value?.toggle(show);
  },
});
</script>
<template>
  <OLayer
    ref="layerRef"
    class="o-loading"
    :class="[`o-loading-${props.size}`]"
    :visible="props.visible"
    :wrapper="props.wrapper"
    :unmount-on-hide="props.unmountOnHide"
    :main-class="mergeClass('o-loading-main', props.mainClass)"
    :main-transition="props.mainTransition"
    :mask-transition="props.maskTransition"
    transition-origin="css"
    :mask="props.mask"
    :mask-close="false"
    @change="(v: boolean) => emits('change', v)"
    @update:visible="(v: boolean, e?: MouseEvent) => emits('update:visible', v, e)"
  >
    <slot>
      <div class="o-loading-icon">
        <slot name="icon">
          <component :is="props.icon" v-if="props.icon" :class="{ 'o-rotating': props.iconRotating }" />
          <IconLoading v-else class="o-rotating" />
        </slot>
      </div>
      <div v-if="$slots.label || props.label" class="o-loading-label">
        <slot name="label">{{ props.label }}</slot>
      </div>
    </slot>
  </OLayer>
</template>

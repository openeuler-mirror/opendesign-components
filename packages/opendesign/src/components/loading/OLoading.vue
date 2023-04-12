<script setup lang="ts">
import { IconLoading } from '../_shared/icons';
import { OLayer } from '../layer';

import { loadingProps } from './types';
import { mergeClass } from '../_shared/dom';
import { ref } from 'vue';

const props = defineProps(loadingProps);

const emits = defineEmits<{
  (e: 'change', val: boolean): void;
  (e: 'update:visible', val: boolean, evt?: MouseEvent): void;
}>();
const layerRef = ref<InstanceType<typeof OLayer> | null>(null);

defineExpose({
  toggle(show?: boolean) {
    layerRef.value?.toggle(show);
  },
});
</script>
<template>
  <OLayer
    ref="layerRef"
    class="o-loading"
    :visible="props.visible"
    :wrapper="props.wrapper"
    :unmount-on-hide="props.unmountOnHide"
    :main-class="mergeClass('o-loading-main', props.mainClass)"
    :main-transition="props.mainTransition"
    :mask-transition="props.maskTransition"
    :mask="props.mask"
    :mask-close="false"
    @change="(v) => emits('change', v)"
    @update:visible="(v, e) => emits('update:visible', v, e)"
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

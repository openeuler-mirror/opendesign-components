<script setup lang="ts">
import { IconClose } from '../_shared/icons';
import { OLayer } from '../layer';

import { dialogProps } from './types';
import { mergeClass } from '../_shared/dom';
import { ref } from 'vue';

const props = defineProps(dialogProps);

const emits = defineEmits<{
  (e: 'change', val: boolean): void;
  (e: 'update:visible', val: boolean, evt?: MouseEvent): void;
}>();
const layerRef = ref<InstanceType<typeof OLayer> | null>(null);

const onCloseClick = () => {
  layerRef.value?.toggle(false);
};

defineExpose({
  toggle(show?: boolean) {
    layerRef.value?.toggle(show);
  },
});
</script>
<template>
  <OLayer
    ref="layerRef"
    class="o-dialog"
    :visible="props.visible"
    :wrapper="props.wrapper"
    :unmount-on-hide="props.unmountOnHide"
    :main-class="mergeClass('o-dlg-main', props.mainClass)"
    :main-transition="props.mainTransition"
    :mask-transition="props.maskTransition"
    :mask="props.mask"
    :mask-close="props.maskClose"
    :before-hide="props.beforeHide"
    :before-show="props.beforeShow"
    @change="(v) => emits('change', v)"
    @update:visible="(v, e) => emits('update:visible', v, e)"
  >
    <div v-if="!props.hideClose" class="o-dlg-btn-close" @click="onCloseClick"><IconClose /></div>
    <div v-if="$slots.header" class="o-dlg-head">
      <slot name="header"></slot>
    </div>
    <div class="o-dlg-body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="o-dlg-foot">
      <slot name="footer"></slot>
    </div>
  </OLayer>
</template>

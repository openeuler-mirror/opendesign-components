<script setup lang="ts">
import { IconClose } from '../_shared/icons';
import { OLayer } from '../layer';
import { OButton } from '../button';

import { dialogProps } from './types';
import { mergeClass } from '../_shared/dom';
import { ref } from 'vue';

const props = defineProps(dialogProps);

const emits = defineEmits<{
  (e: 'change', visible: boolean): void;
  (e: 'update:visible', value: boolean, evt?: MouseEvent): void;
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
    <div v-if="$slots.footer || props.actions" class="o-dlg-foot">
      <slot name="footer">
        <div class="o-dlg-actions">
          <OButton
            v-for="item in props.actions"
            :key="item.id"
            class="o-dlg-btn"
            :color="item.color"
            :variant="item.variant"
            :size="item.size"
            @click="item.onClick"
          >
            {{ item.label }}
          </OButton>
        </div>
      </slot>
    </div>
  </OLayer>
</template>

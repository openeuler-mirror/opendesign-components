<script setup lang="ts">
import { computed, ref } from 'vue';
import { IconClose } from '../_utils/icons';
import { OLayer } from '../layer';
import { OButton } from '../button';
import { vScrollbar } from '../scrollbar';

import { dialogProps } from './types';
import { mergeClass } from '../_utils/dom';
import { useScreen } from '../hooks';

const props = defineProps(dialogProps);

const emits = defineEmits<{
  (e: 'change', visible: boolean): void;
  (e: 'update:visible', value: boolean, evt?: MouseEvent): void;
}>();

const { isPhonePad } = useScreen();

const layerRef = ref<InstanceType<typeof OLayer> | null>(null);

const onCloseClick = () => {
  layerRef.value?.toggle(false);
};

const onChange = (visible: boolean) => {
  emits('change', visible);
};

const onUpdateVisible = (value: boolean, e?: MouseEvent) => {
  emits('update:visible', value, e);
};

/**
 * 设置滚动条参数
 */
const scrollbarProps = computed(() => {
  if (props.scrollbar === true) {
    return {
      showType: 'hover',
      size: 'small',
    };
  }
  return props.scrollbar;
});

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
    :class="[
      `o-dialog-${props.size}`,
      {
        'o-dialog-responsive': !props.noResponsive,
        'o-dialog-phone-half-full': props.phoneHalfFull,
      },
    ]"
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
    :transition-orign="isPhonePad ? 'css' : 'mouse'"
    @change="onChange"
    @update:visible="onUpdateVisible"
  >
    <div v-if="$slots.header" class="o-dlg-header">
      <slot name="header"></slot>
    </div>
    <div
      class="o-dlg-body"
      :class="{
        'with-footer': $slots.footer || props.actions,
      }"
    >
      <div class="o-dlg-body-content" v-scrollbar="scrollbarProps">
        <slot></slot>
      </div>
    </div>
    <div v-if="$slots.footer || $slots.actions || props.actions" class="o-dlg-footer">
      <slot name="footer">
        <div class="o-dlg-actions">
          <slot name="actions" :isPhonePad="isPhonePad">
            <!-- 需要审视透传子组件属性 -->
            <OButton
              v-for="item in props.actions"
              :key="item.id"
              class="o-dlg-btn"
              :color="item.color"
              :variant="!item.variant && isPhonePad ? 'text' : item.variant"
              :size="item.size"
              :round="item.round"
              :icon="item.icon"
              :loading="item.loading"
              :disabled="item.disabled"
              @click="item.onClick"
            >
              {{ item.label }}
            </OButton>
          </slot>
        </div>
      </slot>
    </div>
    <div v-if="!props.hideClose" class="o-dlg-btn-close" @click="onCloseClick"><IconClose /></div>
  </OLayer>
</template>

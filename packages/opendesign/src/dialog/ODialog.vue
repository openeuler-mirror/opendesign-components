<script setup lang="ts">
import { computed, ref, useId } from 'vue';
import { IconClose } from '../_utils/icons';
import { OLayer } from '../layer';
import { OButton } from '../button';
import { vScrollbar, type BaseScrollerPropsT } from '../scrollbar';

import { dialogProps } from './types';
import { mergeClass } from '../_utils/vue-utils';
import { useScreen } from '../hooks';

const props = defineProps(dialogProps);

const emits = defineEmits<{
  /**
   * @zh-CN 弹窗显示状态变化时触发
   * @en-US Triggered when the dialog visibility changes
   */
  (e: 'change', visible: boolean): void;
  /**
   * @zh-CN 弹窗显示状态更新时触发
   * @en-US Triggered when the dialog visibility is updated
   */
  (e: 'update:visible', value: boolean, evt?: MouseEvent): void;
}>();

const { isPhonePad } = useScreen();

/**
 * 组件插槽类型定义。
 *
 * 采用 defineSlots 而非 useSlots：为插槽名提供编译期拼写校验与编辑器精确补全，
 * 其 JSDoc 同时作为 gen:api 提取插槽说明列的来源（与 OSelect 等组件保持一致）。
 */
const slots = defineSlots<{
  /** 自定义弹窗标题内容 */
  header?(): any;
  /** 弹窗主体内容 */
  default?(): any;
  /** 自定义弹窗底部内容 */
  footer?(): any;
  /** 自定义操作按钮区域，可获取 isPhonePad 标记以适配响应式按钮形态 */
  actions?(props: { isPhonePad: boolean }): any;
}>();

/** 弹窗标题 id，供 role=dialog 的 aria-labelledby 引用（SSR 友好） */
const headerId = useId();

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
    } as Partial<BaseScrollerPropsT>;
  }
  return props.scrollbar;
});

defineExpose({
  /**
   * @zh-CN 切换对话框显示状态
   * @en-US Toggle the dialog visibility
   */
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
    role="dialog"
    aria-modal="true"
    :aria-labelledby="slots.header ? headerId : undefined"
    :unmount-on-hide="props.unmountOnHide"
    :main-class="mergeClass('o-dlg-main', props.mainClass)"
    :main-transition="props.mainTransition"
    :mask-transition="props.maskTransition"
    :mask="props.mask"
    :mask-close="props.maskClose"
    :before-hide="props.beforeHide"
    :before-show="props.beforeShow"
    :transition-origin="isPhonePad ? 'css' : 'mouse'"
    @change="onChange"
    @update:visible="onUpdateVisible"
  >
    <div v-if="$slots.header" :id="headerId" class="o-dlg-header">
      <slot name="header"></slot>
    </div>
    <div
      class="o-dlg-body"
      :class="{
        'with-footer': $slots.footer || props.actions,
      }"
    >
      <div v-scrollbar="scrollbarProps" class="o-dlg-body-content">
        <slot></slot>
      </div>
    </div>
    <div v-if="$slots.footer || $slots.actions || props.actions" class="o-dlg-footer">
      <slot name="footer">
        <div class="o-dlg-actions">
          <slot name="actions" :is-phone-pad="isPhonePad">
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

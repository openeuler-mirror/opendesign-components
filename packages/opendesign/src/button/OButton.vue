<script setup lang="ts">
import { defaultSize } from '../_utils/global';
import { IconLoading } from '../_utils/icons';
import { getRoundClass } from '../_utils/style-class';
import { buttonProps } from './types';
import HtmlTag from '../_components/html-tag';
import { isEmptySlot } from '../_utils/vue-utils';
import { computed, inject, toValue } from 'vue';
import { VariantT } from '../_utils/types';
import { isUndefined } from '../_utils/is';
import { formInjectKey, formItemInjectKey } from '../form/provide';

const props = defineProps(buttonProps);

const emit = defineEmits<{
  /**
   * @zh-CN 点击按钮时触发
   * @en-US Triggered when the button is clicked
   */
  (e: 'click', evt: MouseEvent): void;
}>();

const tag = computed(() => (props.href ? 'a' : props.tag));

// 表单/表单项注入
const formCtx = inject(formInjectKey, null);
const formItemCtx = inject(formItemInjectKey, null);
const mergedSize = computed(() => props.size ?? toValue(formItemCtx?.size) ?? toValue(formCtx?.size) ?? defaultSize.value);
const mergedRound = computed(() => props.round ?? toValue(formItemCtx?.round) ?? toValue(formCtx?.round));
const mergedDisabled = computed(() => props.disabled ?? toValue(formItemCtx?.disabled) ?? toValue(formCtx?.disabled));

const round = getRoundClass(
  {
    get round() {
      return mergedRound.value;
    },
  },
  'btn',
);

/**
 * 插槽定义
 */
const slots = defineSlots<{
  /** 默认插槽，按钮内容 */
  default?(): any;
  /** 前缀图标插槽 */
  icon?(): any;
  /** 后缀插槽 */
  suffix?(): any;
}>();

const isOnlyIcon = computed(() => isEmptySlot(slots.default) && (props.icon || slots.icon));
// 仅图标按妞，variant默认值为'outline'
const variant = computed<VariantT>(() => {
  if (isUndefined(props.variant) && isOnlyIcon.value) {
    return 'text';
  }
  return props.variant || 'outline';
});

const onClick = (e: MouseEvent) => {
  if (mergedDisabled.value || props.loading) {
    e.preventDefault();
    return;
  }
  emit('click', e);
};
</script>
<template>
  <HtmlTag
    :tag="tag"
    :href="props.href"
    :type="tag === 'button' ? 'button' : ''"
    class="o-btn"
    :class="[
      `o-btn-${props.color}`,
      `o-btn-${mergedSize}`,
      `o-btn-${variant}`,
      round.class.value,
      {
        'o-btn-icon-only': isOnlyIcon,
        'o-btn-disabled': mergedDisabled,
      },
    ]"
    :style="round.style.value"
    @click="onClick"
  >
    <span v-if="props.icon || slots.icon || props.loading" class="o-btn-prefix" :class="{ loading: props.loading }">
      <IconLoading v-if="props.loading" class="o-rotating" />
      <slot v-else name="icon">
        <component :is="props.icon" />
      </slot>
    </span>
    <slot></slot>
    <span v-if="slots.suffix" class="o-btn-suffix">
      <slot name="suffix"></slot>
    </span>
  </HtmlTag>
</template>

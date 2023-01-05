<script setup lang="ts">
import { IconLinkPrefix, IconLinkArrow, IconLoading } from '../_shared/icons';

interface LinkPropsT {
  /**
   * 包含超链接指向的 URL 或 URL 片段。
   */
  href?: string;
  /**
   * 指定在何处显示链接的资源。
   */
  target?: '_blank' | '_parent' | '_self' | '_top';
  /**
   * 是否为loading状态
   */
  loading?: boolean;
  /**
   * 链接类型
   */
  type?: 'normal' | 'primary' | 'warning' | 'danger' | 'success';
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 前缀图标
   */
  iconPrefix?: boolean;
  /**
   * 图标箭头
   */
  iconArrow?: boolean;
  /**
   * hover时是否显示背景
   */
  hoverable?: boolean;
}

const props = withDefaults(defineProps<LinkPropsT>(), {
  href: '',
  target: undefined,
  icon: false,
  type: 'normal',
});

const emits = defineEmits<{ (e: 'click', val: MouseEvent): void }>();
const onClick = (e: MouseEvent) => {
  if (props.disabled) {
    e.preventDefault();
    return;
  }
  if (!props.href) {
    e.preventDefault();
  }
  emits('click', e);
};
</script>
<template>
  <a
    class="o-link"
    :href="props.href"
    :target="props.target"
    :class="[{ 'is-disabled': props.disabled, 'o-link-hoverable': props.hoverable }, `o-link-${props.type}`]"
    v-bind="$attrs"
    @click="onClick"
  >
    <span v-if="props.icon || $slots.icon || props.loading" class="o-link-icon prefix">
      <IconLoading v-if="props.loading" class="o-roating" />
      <slot v-else-if="$slots.icon" name="icon"></slot>
      <IconLinkPrefix v-else />
    </span>
    <slot></slot>
    <span v-if="$slots.iconSuffix" class="o-link-icon suffix">
      <slot name="iconSuffix"></slot>
    </span>
    <span v-else-if="props.iconArrow" class="o-link-icon suffix arrow"><IconLinkArrow /></span>
  </a>
</template>

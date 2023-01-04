<script setup lang="ts">
import { getLoadingIcon, getLinkIcon, getLinkArrowIcon } from '../_shared/icons';

interface LinkPropsT {
  /**
   * 包含超链接指向的 URL 或 URL 片段。
   */
  href?: string;
  /**
   * 指定在何处显示链接的资源。
   */
  target?: '_blank' | '_parent' | '_self' | '_top' | '';
  /**
   * 是否为loading状态
   */
  loading?: boolean;
  /**
   * 链接类型
   */
  type?: 'normal' | 'primary';
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 图标
   */
  icon?: boolean;
  /**
   * 图标箭头
   */
  iconArrow?: boolean;
}

const props = withDefaults(defineProps<LinkPropsT>(), {
  href: '',
  target: '',
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
const IconLoading = getLoadingIcon();
const IconLink = getLinkIcon();
const IconLinkArrow = getLinkArrowIcon();
</script>
<template>
  <a
    class="o-link"
    :href="props.href"
    :target="props.target"
    :class="[{ 'is-disabled': props.disabled }, `o-link-${props.type}`]"
    v-bind="$attrs"
    @click="onClick"
  >
    <span v-if="props.loading" class="o-link-icon loading"><IconLoading /></span>
    <span v-else-if="props.icon || $slots.icon" class="o-link-icon">
      <slot v-if="$slots.icon" name="icon"></slot>
      <IconLink v-else />
    </span>
    <slot></slot>
    <span v-if="$slots.iconSuffix" class="o-link-icon arrow">
      <slot name="iconSuffix"></slot>
    </span>
    <span v-else-if="props.iconArrow" class="o-link-icon arrow"><IconLinkArrow /></span>
  </a>
</template>

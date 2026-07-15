<script setup lang="ts">
import { computed, inject, useAttrs, resolveComponent, h, renderSlot, type VNode } from 'vue';
import { configProviderInjectKey } from '../config-provider';
import { defaultSize } from '../_utils/global';
import { IconLinkArrow, IconLoading } from '../_utils/icons';

import { linkProps } from './types';

const props = defineProps(linkProps);
const configProvider = inject(configProviderInjectKey, {});
const $attr = useAttrs();

const emits = defineEmits<{ (e: 'click', val: MouseEvent): void }>();
const onClick = (e: MouseEvent) => {
  if (props.disabled || props.loading) {
    e.preventDefault();
    return;
  }

  emits('click', e);

  if (props.global) {
    configProvider.link?.click(e, props, $attr);
  }
};

const linkClass = computed(() => [
  {
    'o-link-disabled': props.disabled,
    'o-link-hover-bg': props.hoverBg,
    'o-link-hover-underline': props.hoverUnderline,
  },
  `o-link-${props.color}`,
  `o-link-${props.size || defaultSize}`,
]);

/**
 * 插槽定义
 */
const $slots = defineSlots<{
  /** 默认插槽，链接内容 */
  default?(): any;
  /** 前缀图标插槽 */
  icon?(): any;
  /** 后缀插槽 */
  suffix?(): any;
}>();
const RouterLink = resolveComponent('RouterLink');

const prefix = () => {
  const children: VNode[] = [];
  if (props.loading) {
    children.push(h(IconLoading.value, { class: 'o-rotating' }));
  } else if ($slots.icon || props.icon) {
    children.push(renderSlot($slots, 'icon', {}, () => (props.icon ? [h(props.icon)] : [])));
  }
  if (children.length) {
    return h('span', { class: 'o-link-prefix' }, children);
  }
  return null;
};
const main = () => {
  const children: VNode[] = [];
  const slotVnode = renderSlot($slots, 'default');
  if (props.hoverUnderline) {
    children.push(h('span', { class: 'o-link-label' }, slotVnode));
  } else {
    children.push(slotVnode);
  }
  return h('span', { class: 'o-link-main' }, children);
};
const suffix = () => {
  if ($slots.suffix || props.suffix) {
    return h(
      'span',
      { class: 'o-link-suffix' },
      renderSlot($slots, 'suffix', {}, () => (props.suffix ? [h(IconLinkArrow.value, { class: 'o-link-icon-arrow' })] : [])),
    );
  }
  return null;
};
const Link = () => {
  const _props: Record<string, any> = { ...$attr, class: ['o-link', linkClass.value], onClick };
  if (props.to && RouterLink) {
    _props.to = props.to;
    _props.replace = props.replace;
    return h(RouterLink, _props, { default: () => [prefix(), main(), suffix()] });
  }
  if (props.tag === 'a') {
    _props.href = props.href;
    _props.target = props.target;
  }
  return h(props.tag, _props, { default: () => [prefix(), main(), suffix()] });
};
</script>
<template>
  <Link />
</template>

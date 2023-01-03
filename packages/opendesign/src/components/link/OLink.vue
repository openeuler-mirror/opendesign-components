<script setup lang="ts">
import { emit } from 'process';

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
   * 指定目标对象到链接对象的关系。
   */
  rel?:
    | 'alternate'
    | 'author'
    | 'bookmark'
    | 'external'
    | 'help'
    | 'license'
    | 'next'
    | 'nofollow'
    | 'noreferrer'
    | 'noopener'
    | 'prev'
    | 'search'
    | 'tag'
    | '';
  disabled?: boolean;
  icon?: boolean;
}
const props = withDefaults(defineProps<LinkPropsT>(), {
  href: '',
  target: '',
  rel: '',
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
  <a class="o-link" :href="props.href" :target="props.target" :rel="props.rel" v-bind="$attrs" :class="{ 'is-disabled': props.disabled }" @click="onClick">
    <span class="o-link-icon"></span>
    <slot></slot>
  </a>
</template>

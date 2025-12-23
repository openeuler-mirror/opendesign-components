<script setup lang="ts">
import { defaultSize } from '../_utils/global';
import { IconLoading } from '../_utils/icons';
import { getRoundClass } from '../_utils/style-class';
import { buttonProps } from './types';
import HtmlTag from '../_components/html-tag';
import { isEmptySlot } from '../_utils/vue-utils';
import { computed, useSlots } from 'vue';
import { VariantT } from '../_utils/types';
import { isUndefined } from '../_utils/is';

const props = defineProps(buttonProps);

const emit = defineEmits<{
  (e: 'click', evt: MouseEvent): void;
}>();

const tag = computed(() => (props.href ? 'a' : props.tag));

const round = getRoundClass(props, 'btn');

const slots = useSlots();

const isOnlyIcon = computed(() => isEmptySlot(slots.default) && (props.icon || slots.icon))
// 仅图标按妞，variant默认值为'outline'
const variant = computed<VariantT>(() => {
  if (isUndefined(props.variant) && isOnlyIcon.value) {
    return 'text';
  }
  return props.variant || 'outline'
})

const onClick = (e: MouseEvent) => {
  if (props.disabled || props.loading) {
    e.preventDefault();
    return;
  }
  emit('click', e);
};
</script>
<template>
  <HtmlTag :tag="tag" :href="props.href" :type="tag === 'button' ? 'button' : ''" class="o-btn" :class="[
    `o-btn-${props.color}`,
    `o-btn-${props.size || defaultSize}`,
    `o-btn-${variant}`,
    round.class.value,
    {
      'o-btn-icon-only': isOnlyIcon,
      'o-btn-disabled': props.disabled,
    },
  ]" :style="round.style.value" @click="onClick">
    <span v-if="props.icon || $slots.icon || props.loading" class="o-btn-prefix" :class="{ loading: props.loading }">
      <IconLoading v-if="props.loading" class="o-rotating" />
      <slot v-else name="icon">
        <component :is="props.icon" />
      </slot>
    </span>
    <slot></slot>
    <span v-if="$slots.suffix" class="o-btn-suffix">
      <slot name="suffix"></slot>
    </span>
  </HtmlTag>
</template>

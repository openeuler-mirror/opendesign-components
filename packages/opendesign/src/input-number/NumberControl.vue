<script setup lang="ts">
import { IconMinus, IconAdd, IconChevronUp, IconChevronDown } from '../_utils/icons';

type ControlType = 'plus' | 'minus';

const props = defineProps<{
  type: ControlType | 'both';
  addable: boolean;
  reducible: boolean;
}>();

const emits = defineEmits<{
  (e: 'plus', evt: MouseEvent): void;
  (e: 'minus', evt: MouseEvent): void;
}>();

const onControlClick = (type: ControlType, e: MouseEvent) => {
  if (type === 'plus' && props.addable) {
    emits('plus', e);
  } else if (type === 'minus' && props.reducible) {
    emits('minus', e);
  }
};

// 当props.type !== 'both' 时，处理禁用状态
const isDisabledWhenNotBoth = () => {
  if (props.type === 'plus') {
    return !props.addable;
  } else if (props.type === 'minus') {
    return !props.reducible;
  }
};
</script>
<template>
  <div class="o-input-number-btn-wrap">
    <template v-if="props.type === 'both'">
      <div
        class="o-input-number-btn"
        :class="[
          {
            'is-disabled': !props.addable,
          },
          `type-${props.type}`,
        ]"
        tabindex="-1"
        @click="(e:MouseEvent) => onControlClick('plus', e)"
      >
        <slot name="plus"><IconChevronUp class="o-input-number-icon-plus" /></slot>
      </div>
      <div
        class="o-input-number-btn minus"
        :class="{
          'is-disabled': !props.reducible,
        }"
        tabindex="-1"
        @click="(e:MouseEvent) => onControlClick('minus', e)"
      >
        <slot name="minus"><IconChevronDown class="o-input-number-icon-minus" /></slot>
      </div>
    </template>
    <div
      v-else
      class="o-input-number-btn"
      tabindex="-1"
      :class="{
        'is-disabled': isDisabledWhenNotBoth(),
      }"
      @click="(e:MouseEvent) => onControlClick(props.type as ControlType, e)"
    >
      <slot name="plus" v-if="props.type === 'plus'"><IconAdd /></slot>
      <slot name="minus" v-if="props.type === 'minus'"><IconMinus /></slot>
    </div>
  </div>
</template>

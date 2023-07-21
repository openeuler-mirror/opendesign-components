<script setup lang="ts">
import { computed } from 'vue';
import { OButton } from '../button';
import { OLink } from '../link';
import { ShortcutParamT, ShortcutT } from './types';
import { Labels } from './date';
import { isFunction } from '../_utils/is';

const props = withDefaults(
  defineProps<{
    shortcuts?: Array<ShortcutParamT>;
    needConfirm?: boolean;
    confirmLabel?: string;
    clearLabel?: string;
  }>(),
  {
    shortcuts: undefined,
    confirmLabel: '',
    clearLabel: '',
  }
);

const emits = defineEmits<{
  // 控制输入框展示的当前值
  (e: 'shortcut:click', value: Date, evt: Event): void;
  // 最终值
  (e: 'shortcut:hoverin', value: Date, evt: Event): void;
  (e: 'shortcut:hoverout', evt: Event): void;
  (e: 'clear', evt: Event): void;
  (e: 'confirm', evt: Event): void;
}>();

// 是否需要确认按钮
const confirmLabel = computed(() => (props.confirmLabel ? props.confirmLabel : Labels.confirm));
const clearLabel = computed(() => (props.clearLabel ? props.clearLabel : Labels.clear));

//shortcuts
const shortcuts = computed(() => {
  if (props.shortcuts && props.shortcuts.length > 0) {
    return props.shortcuts.map((item) => {
      if (item === 'now') {
        return {
          label: Labels.now,
          value: () => new Date(),
        };
      }
      return item;
    });
  }
  return null;
});
/*
 * 快捷按钮shortcut
 */
const onShortcutClick = (e: Event, shortcut: ShortcutT) => {
  const v = isFunction(shortcut.value) ? shortcut.value() : shortcut.value;

  emits('shortcut:click', v, e);
};
// 避免频繁更新dom
let hoverInTimer: number = 0;
let hoverOutTimer: number = 0;
const hoverDelay = 100;
const clearTimer = () => {
  if (hoverInTimer) {
    clearTimeout(hoverInTimer);
    hoverInTimer = 0;
  }
  if (hoverOutTimer) {
    clearTimeout(hoverOutTimer);
    hoverOutTimer = 0;
  }
};
// hover in时快速显示
const onShortcutMouseEnter = (e: Event, shortcut: ShortcutT) => {
  clearTimer();

  hoverInTimer = window.setTimeout(() => {
    hoverInTimer = 0;
    const v = isFunction(shortcut.value) ? shortcut.value() : shortcut.value;
    emits('shortcut:hoverin', v, e);
  }, hoverDelay);
};
// hover out恢复之前值
const onShortcutMouseLeave = (e: Event) => {
  clearTimer();

  hoverOutTimer = window.setTimeout(() => {
    hoverOutTimer = 0;
    emits('shortcut:hoverout', e);
  }, hoverDelay);
};

const onClear = (e: Event) => {
  emits('clear', e);
};
const onConfirm = (e: Event) => {
  emits('confirm', e);
};
</script>
<template>
  <div v-if="$slots.footer" class="o-picker-extra">
    <slot name="extra"></slot>
  </div>
  <div
    class="o-picker-foot"
    :class="{
      'has-confirm': props.needConfirm,
    }"
  >
    <div v-if="shortcuts" class="o-picker-shortcut">
      <template v-for="item in shortcuts" :key="item">
        <div
          class="o-picker-shortcut-item"
          @click="(e) => onShortcutClick(e, item)"
          @mouseenter="(e:Event) => onShortcutMouseEnter(e, item)"
          @mouseleave="onShortcutMouseLeave"
        >
          <slot name="shortcut" :shortcut="item">
            <OLink color="primary">{{ item.label }}</OLink>
          </slot>
        </div>
      </template>
    </div>
    <div v-if="props.needConfirm" class="o-picker-shortcut">
      <OButton class="o-picker-shortcut-btn" color="primary" size="small" @click="onClear">{{ clearLabel }}</OButton>
      <OButton class="o-picker-shortcut-btn" color="primary" size="small" @click="onConfirm">
        {{ confirmLabel }}
      </OButton>
    </div>
  </div>
</template>

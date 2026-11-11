<script setup lang="ts">
import { ref, computed, watch, inject, nextTick } from 'vue';
import { buttonToggleProps } from './types';
import { getRoundClass } from '../_utils/style-class';
import { isUndefined } from '../_utils/is';
import { checkboxInjectKey } from '../checkbox/provide';
import { radioInjectKey } from '../radio/provide';

const checkboxInjection = inject(checkboxInjectKey, null);
const radioInjection = inject(radioInjectKey, null);

/**
 * @description 是否由父级宿主持有交互语义：在 OCheckbox / ORadio 的视觉替换插槽内渲染时，
 * 父级的原生 input 已提供 checkbox/radio 角色与选中态，且 OToggle 自身的点击已被接管，
 * 此时不得再声明 button 角色与 aria-pressed——否则无障碍树中出现嵌套的第二个交互语义，
 * 读屏与 AI 代理会误认为里面还有一个可独立激活的按钮
 */
const hostOwnsSemantics = computed(() => !!(checkboxInjection || radioInjection));

const props = defineProps(buttonToggleProps);

const round = getRoundClass(props, 'toggle');

const isChecked = ref(props.checked ?? props.defaultChecked);

const emits = defineEmits<{
  /**
   * @zh-CN 切换状态变化时触发
   * @en-US Triggered when the toggle checked state changes
   */
  (e: 'update:checked', val: boolean): void;
  /**
   * @zh-CN 切换状态变更后触发
   * @en-US Triggered after the toggle state changes
   */
  (e: 'change', val: boolean, ev: MouseEvent): void;
}>();

watch(
  () => props.checked,
  (val) => {
    if (!isUndefined(val)) {
      isChecked.value = val;
    }
  },
);

const onClick = (ev: MouseEvent) => {
  if (props.disabled || checkboxInjection || radioInjection) {
    return;
  }
  isChecked.value = !isChecked.value;
  emits('update:checked', isChecked.value);
  nextTick(() => {
    emits('change', isChecked.value, ev);
  });
};
</script>

<template>
  <div
    class="o-toggle"
    :role="hostOwnsSemantics ? undefined : 'button'"
    :aria-label="hostOwnsSemantics ? undefined : props.ariaLabel"
    :aria-pressed="hostOwnsSemantics ? undefined : isChecked"
    :aria-disabled="hostOwnsSemantics ? undefined : props.disabled || undefined"
    :class="[
      round.class.value,
      {
        'o-toggle-disabled': props.disabled,
        'o-toggle-checked': isChecked,
      },
    ]"
    :style="round.style.value"
    @click="onClick"
  >
    <span v-if="props.icon || $slots.icon" class="o-toggle-prefix">
      <slot name="icon">
        <component :is="props.icon" />
      </slot>
    </span>
    <slot></slot>
  </div>
</template>

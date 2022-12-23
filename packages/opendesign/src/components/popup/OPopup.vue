<script setup lang="ts">
import { onMounted, reactive, ref, watch, nextTick, onUnmounted, PropType, ComponentPublicInstance } from 'vue';
import { PopupPosition, PopupTrigger } from './types';
import { listenOutClick } from '../directves';
import { isElement } from '../_shared/dom';
import { calcPopupStyle } from './popup';

const props = defineProps({
  position: {
    type: String as PropType<PopupPosition>,
    default: PopupPosition.LB,
  },
  trigger: {
    type: [String, Array<String>] as PropType<PopupTrigger | PopupTrigger[]>,
    default: PopupTrigger.HOVER,
  },
  target: {
    type: [String, Object] as PropType<string | ComponentPublicInstance | HTMLElement | null>,
    default: null,
    require: true,
  },
  visible: {
    type: Boolean,
  },
  container: {
    type: [String, Object] as PropType<string | HTMLElement>,
    default: document.documentElement,
  },
});

const emits = defineEmits<{ (e: 'update:visible', val: boolean): void }>();

const show = ref(false);
let targetEl: HTMLElement | null = null;
let containerEl: HTMLElement | null = null;
const popWrap = ref<HTMLElement | null>(null);
const popStyle = reactive<{ left?: string; top?: string; right?: string; bottom?: string }>({});
const popPosition = ref(props.position);
// 处理popup位置
const updatePopupStyle = () => {
  if (!targetEl || !popWrap.value || !containerEl) {
    return;
  }

  const { style, position } = calcPopupStyle(popWrap.value, targetEl, containerEl, props.position);

  popStyle.top = `${style.top}px`;
  popStyle.left = `${style.left}px`;
  popPosition.value = position;
};

const showFn = () => {
  if (!show.value) {
    show.value = true;
    emits('update:visible', true);
    nextTick(() => {
      updatePopupStyle();
    });
  }
};
const hideFn = () => {
  if (show.value) {
    show.value = false;
    emits('update:visible', false);
  }
};
watch(
  () => props.visible,
  (val) => {
    show.value = val;
    if (val) {
      nextTick(() => {
        updatePopupStyle();
      });
    }
  }
);

// 监听元素的触发事件
const handleTrigger = (el: HTMLElement | null) => {
  if (!el) {
    return [];
  }
  targetEl = el;

  const listeners: Array<() => void> = [];

  const triggers = Array.isArray(props.trigger) ? props.trigger : [props.trigger];
  triggers.forEach((tr: PopupTrigger) => {
    if (tr === PopupTrigger.HOVER) {
      el?.addEventListener('mouseover', showFn);
      el?.addEventListener('mouseleave', hideFn);
      const removeFn = () => {
        el?.removeEventListener('mouseover', showFn);
        el?.removeEventListener('mouseleave', hideFn);
      };
      listeners.push(removeFn);
    } else if (tr === PopupTrigger.FOUCS) {
      el?.addEventListener('focusin', showFn);
      el?.addEventListener('focusout', hideFn);
      const removeFn = () => {
        el?.removeEventListener('focusin', showFn);
        el?.removeEventListener('focusout', hideFn);
      };
      listeners.push(removeFn);
    } else if (tr === PopupTrigger.CLICK) {
      el?.addEventListener('click', showFn);

      const removeFn = listenOutClick(el, hideFn);

      listeners.push(() => {
        el?.removeEventListener('click', showFn);
      });
      listeners.push(removeFn);
    } else if (tr === PopupTrigger.CONTEXT_MENU) {
      const fn = (e: Event) => {
        e.preventDefault();
        showFn();
      };
      el?.addEventListener('contextmenu', fn);

      const removeFn = listenOutClick(el, hideFn);

      listeners.push(() => {
        el?.removeEventListener('contextmenu', fn);
      });
      listeners.push(removeFn);
    }
  });

  return listeners;
};

let triggerListener: ReturnType<typeof handleTrigger> = [];

// 触发元素为组件ref，处理事件触发
watch(
  () => props.target,
  (ele) => {
    if (ele && (ele as ComponentPublicInstance).$el) {
      triggerListener = handleTrigger((ele as ComponentPublicInstance).$el);
    }
  }
);
onMounted(() => {
  // 在mounted事件后再显示，避免找不到container
  show.value = props.visible;

  // 触发元素为dom或者选择器，处理事件触发
  nextTick(() => {
    if (typeof props.container === 'string') {
      containerEl = document.querySelector(props.container);
    } else {
      containerEl = props.container;
    }

    if (show.value) {
      updatePopupStyle();
    }

    if (typeof props.target === 'string') {
      triggerListener = handleTrigger(document.querySelector(props.target));
    } else if (isElement(props.target)) {
      triggerListener = handleTrigger(props.target as HTMLElement);
    }
  });
});
onUnmounted(() => {
  triggerListener.forEach((fn) => {
    fn();
  });
});
</script>
<template>
  <teleport v-if="show" :to="props.container">
    <div ref="popWrap" class="o-popup" :style="popStyle">
      <div class="o-popup-wrap" :class="[`o-popup-pos-${popPosition}`]">
        <slot></slot>
      </div>
    </div>
  </teleport>
</template>

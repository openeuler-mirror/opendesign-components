<script setup lang="ts">
import { onMounted, reactive, ref, Ref, watch, nextTick, onUnmounted, PropType, ComponentPublicInstance, onUpdated } from 'vue';
import { PopupPosition, PopupTrigger } from './types';
import { listenOutClick } from '../directves';
import { isElement } from '../_shared/dom';
import { calcPopupStyle } from './popup';
import { useResizeObserver } from '../hooks/use-resize-observer';
import { ResizeObserver } from '../resize-observer';

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
    default: document.body,
  },
  hoverDelay: {
    type: Number,
    default: 100,
  },
});

const emits = defineEmits<{ (e: 'update:visible', val: boolean): void }>();

const visible = ref(false);
let targetEl: HTMLElement | null = null;
let containerEl: Ref<HTMLElement | null> = ref(null);
const popWrap = ref<HTMLElement | null>(null);
const popStyle = reactive<{ left?: string; top?: string; right?: string; bottom?: string }>({ left: `${0}px`, top: `${0}px` });
const popPosition = ref(props.position);
// 是否在可视区域外
const isOutside = ref(false);

// 监听dom尺寸变化
const { createResizeObserver, destoryResizeObserver } = useResizeObserver();

// 处理popup位置
const updatePopupStyle = () => {
  if (!targetEl || !popWrap.value || !containerEl.value) {
    return;
  }
  console.log('update style', popWrap.value);

  const { style, position, isOutside: out } = calcPopupStyle(popWrap.value, targetEl, containerEl.value, props.position);
  isOutside.value = out;

  if (style && !out) {
    popStyle.top = `${Math.round(style.top)}px`;
    popStyle.left = `${Math.round(style.left)}px`;

    popPosition.value = position;
  }
};

watch(
  () => props.visible,
  (val) => {
    visible.value = val;
    if (val) {
      nextTick(() => {
        updatePopupStyle();
      });
    }
  }
);

let visibleTimer = 0;
const clearVisibleTimer = () => {
  if (visibleTimer) {
    window.clearTimeout(visibleTimer);
    visibleTimer = 0;
  }
};

// 更新可见状态，支持延迟更新
const updateVisible = (isVisible: boolean, delay?: number) => {
  if (isVisible === visible.value && visibleTimer) {
    return;
  }

  const update = () => {
    visible.value = isVisible;
    emits('update:visible', isVisible);
    // if (isVisible) {
    //   nextTick(() => {
    //     updatePopupStyle();
    //   });
    // }
  };

  if (delay) {
    clearVisibleTimer();
    if (isVisible !== visible.value) {
      visibleTimer = window.setTimeout(update, delay);
    }
  } else {
    update();
  }
};

// 监听元素的触发事件
const bindTrigger = (el: HTMLElement | null) => {
  if (!el) {
    return [];
  }
  targetEl = el;

  const listeners: Array<() => void> = [];

  const showFn = () => {
    if (visible.value === false) {
      updateVisible(true);
    }
  };
  const hideFn = () => {
    if (visible.value === true) {
      updateVisible(false);
    }
  };

  const triggers = Array.isArray(props.trigger) ? props.trigger : [props.trigger];
  triggers.forEach((tr: PopupTrigger) => {
    if (tr === PopupTrigger.HOVER) {
      const enterFn = () => {
        updateVisible(true, props.hoverDelay);
      };
      const leavefn = () => {
        updateVisible(false, props.hoverDelay);
      };
      el?.addEventListener('mouseover', enterFn);
      el?.addEventListener('mouseleave', leavefn);
      const removeFn = () => {
        el?.removeEventListener('mouseover', enterFn);
        el?.removeEventListener('mouseleave', leavefn);
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

let triggerListener: ReturnType<typeof bindTrigger> = [];

// 触发元素为组件ref，处理事件触发
watch(
  () => props.target,
  (ele) => {
    if (ele && (ele as ComponentPublicInstance).$el) {
      triggerListener = bindTrigger((ele as ComponentPublicInstance).$el);
    }
  }
);

const onResize = () => {
  if (visible.value) {
    updatePopupStyle();
  }
};

onMounted(() => {
  // 在mounted事件后再显示，避免找不到container
  visible.value = props.visible;

  // 触发元素为dom或者选择器，处理事件触发
  nextTick(() => {
    if (typeof props.container === 'string') {
      containerEl.value = document.querySelector(props.container);
    } else {
      containerEl.value = props.container;
    }
    // 初始为true时，更新样式
    if (visible.value) {
      updatePopupStyle();
    }

    // 绑定触发元素事件
    if (typeof props.target === 'string') {
      triggerListener = bindTrigger(document.querySelector(props.target));
    } else if (isElement(props.target)) {
      triggerListener = bindTrigger(props.target as HTMLElement);
    }
  });
});

onUnmounted(() => {
  // 移除触发事件
  triggerListener.forEach((fn) => {
    fn();
  });
  // 销毁popup 的 resize监听
  destoryResizeObserver();
});
</script>
<template>
  <teleport v-if="visible" :to="props.container">
    <ResizeObserver @resize="onResize">
      <div v-show="!isOutside" ref="popWrap" class="o-popup" :style="popStyle" v-bind="$attrs">
        <div class="o-popup-wrap" :class="[`o-popup-pos-${popPosition}`]">
          <slot></slot>
        </div>
      </div>
    </ResizeObserver>
  </teleport>
</template>

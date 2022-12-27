<script setup lang="ts">
import { onMounted, reactive, ref, Ref, watch, nextTick, onUnmounted, PropType, ComponentPublicInstance } from 'vue';
import { PopupPosition, PopupTrigger } from './types';
import { isElement } from '../_shared/dom';
import { calcPopupStyle, bindTrigger } from './popup';
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
  wrapper: {
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
let wrapperEl: Ref<HTMLElement | null> = ref(null);
const popWrap = ref<HTMLElement | null>(null);
const popStyle = reactive<{ left?: string; top?: string; right?: string; bottom?: string }>({ left: `${0}px`, top: `${0}px` });
const popPosition = ref(props.position);
// 是否在可视区域外
const isOutside = ref(false);
const unmount = ref(true);

// 监听dom尺寸变化
const { createResizeObserver, destoryResizeObserver } = useResizeObserver();

// 处理popup位置
const updatePopupStyle = () => {
  if (!targetEl || !popWrap.value || !wrapperEl.value) {
    return;
  }
  console.log('update style', popWrap.value);

  const { style, position, isOutside: out } = calcPopupStyle(popWrap.value, targetEl, wrapperEl.value, props.position);
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
    if (visible.value === val) {
      return;
    }
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
// let visibleTo = visible.value;
const updateVisible = (isVisible: boolean, delay?: number) => {
  if (isVisible === visible.value && visibleTimer === 0) {
    return;
  }

  const update = () => {
    if (visible.value === isVisible) {
      return;
    }
    visible.value = isVisible;
    isOutside.value = false;
    emits('update:visible', isVisible);
    if (isVisible) {
      unmount.value = false;
    }
  };

  if (delay) {
    clearVisibleTimer();
    visibleTimer = window.setTimeout(update, delay);
  } else {
    update();
  }
};

let triggerListener: ReturnType<typeof bindTrigger> = [];
const bindEvent = (el: HTMLElement | null) => {
  if (!el) {
    return;
  }

  targetEl = el;
  const triggers = Array.isArray(props.trigger) ? props.trigger : [props.trigger];
  triggerListener = bindTrigger(el, triggers, {
    updateFn: updateVisible,
    hoverDelay: props.hoverDelay,
  });
};

// 触发元素为组件ref，处理事件触发
watch(
  () => props.target,
  (ele) => {
    if (ele) {
      bindEvent((ele as ComponentPublicInstance).$el);
    }
  }
);

const onResize = () => {
  if (visible.value) {
    updatePopupStyle();
  }
};

const handleTransitionEnd = () => {
  if (!visible.value) {
    unmount.value = true;
  }
};

onMounted(() => {
  // 在mounted事件后再显示，避免找不到wrapper
  visible.value = props.visible;

  // 触发元素为dom或者选择器，处理事件触发
  nextTick(() => {
    if (typeof props.wrapper === 'string') {
      wrapperEl.value = document.querySelector(props.wrapper);
    } else {
      wrapperEl.value = props.wrapper;
    }
    // 初始为true时，更新样式
    if (visible.value) {
      updatePopupStyle();
    }

    // 绑定触发元素事件
    if (typeof props.target === 'string') {
      bindEvent(document.querySelector(props.target));
    } else if (isElement(props.target)) {
      bindEvent(props.target as HTMLElement);
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
  <teleport v-if="!unmount || visible" :to="props.wrapper">
    <ResizeObserver @resize="onResize">
      <div v-show="!isOutside" ref="popWrap" class="o-popup" :style="popStyle" v-bind="$attrs">
        <Transition name="zoom" :appear="true" @after-leave="handleTransitionEnd">
          <div v-if="visible" class="o-popup-wrap" :class="[`o-popup-pos-${popPosition}`]">
            <slot></slot>
          </div>
        </Transition>
      </div>
    </ResizeObserver>
  </teleport>
</template>

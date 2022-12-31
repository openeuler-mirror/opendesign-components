<script setup lang="ts">
import { onMounted, reactive, ref, Ref, watch, nextTick, onUnmounted, PropType, ComponentPublicInstance, computed } from 'vue';
import { PopupPositionT, PopupTriggerT } from './types';
import { isElement, getScrollParents } from '../_shared/dom';
import { throttleRAF } from '../_shared/utils';
import { calcPopupStyle, bindTrigger, getTransformOrigin } from './popup';
import { useResizeObserver } from '../hooks/use-resize-observer';
import { ResizeObserver } from '../resize-observer';
import { useIntersectionObserver } from '../hooks';
import type { IntersectionListenerT } from '../hooks';

const props = defineProps({
  /**
   * 弹出位置
   */
  position: {
    type: String as PropType<PopupPositionT>,
    default: 'top',
  },
  /**
   * 触发事件
   * 'hover','click','focus','contextMenu'
   */
  trigger: {
    type: [String, Array<String>] as PropType<PopupTriggerT | PopupTriggerT[]>,
    default: 'hover',
  },
  /**
   * 触发元素或组件
   */
  target: {
    type: [String, Object] as PropType<string | ComponentPublicInstance | HTMLElement | null>,
    default: null,
    require: true,
  },
  /**
   * 是否可见
   * v-model
   */
  visible: {
    type: Boolean,
  },
  /**
   * 挂载容器，默认为body
   */
  wrapper: {
    type: [String, Object] as PropType<string | HTMLElement>,
    default: document.body,
  },
  /**
   * hover事件延时触发的时间（毫秒）
   */
  hoverDelay: {
    type: Number,
    default: 100,
  },
  /**
   * 是否当触发元素不可见时隐藏弹层
   */
  hideWhenTargetInvisible: {
    type: Boolean,
    default: true,
  },
  anchorClass: {
    type: String,
    default: '',
  },
});

const emits = defineEmits<{ (e: 'update:visible', val: boolean): void }>();

const visible = ref(false);
let targetEl: HTMLElement | null = null;
const onlyTargetInViewport = ref(!props.hideWhenTargetInvisible);

let wrapperEl: Ref<HTMLElement | null> = ref(null);
const popWrap = ref<HTMLElement | null>(null);
const popStyle = reactive<{ left?: string; top?: string; right?: string; bottom?: string }>({ left: '0px', top: '0px' });
const popPosition = ref(props.position);

const wrapOrigin = ref<{ left: string; top: string }>({ left: '0px', top: '0px' });
const wrapStyle = computed(() => ({
  transformOrigin: `${wrapOrigin.value.left} ${wrapOrigin.value.top}`,
}));

const anchorStyle = reactive<{ left?: string; top?: string; right?: string; bottom?: string }>({});

// 是否在可视区域外
const unmount = ref(true);

const resizeObserver = useResizeObserver();
const intersctionObserver = useIntersectionObserver();

// 处理popup位置
const updatePopupStyle = () => {
  if (props.hideWhenTargetInvisible && !onlyTargetInViewport.value) {
    return;
  }

  if (!targetEl || !popWrap.value || !wrapperEl.value) {
    return;
  }
  console.log('update style');

  const { popupStyle: pStyle, position, anchorStyle: aStyle } = calcPopupStyle(popWrap.value, targetEl, props.position);

  wrapOrigin.value = getTransformOrigin(position);

  if (pStyle) {
    popStyle.top = `${Math.round(pStyle.top)}px`;
    popStyle.left = `${Math.round(pStyle.left)}px`;

    popPosition.value = position;
  }

  if (aStyle) {
    Object.keys(aStyle).forEach((k) => {
      const val = aStyle[k as keyof typeof aStyle];
      anchorStyle[k as keyof typeof anchorStyle] = `${Math.round(val as number)}px`;
    });
  }
};

const onTargetInterscting: IntersectionListenerT = (entry: IntersectionObserverEntry) => {
  onlyTargetInViewport.value = entry.isIntersecting;
  console.log('onlyTargetInViewport.value', onlyTargetInViewport.value, entry.intersectionRatio, entry.target);

  if (entry.isIntersecting) {
    if (visible.value) {
      nextTick(() => {
        updatePopupStyle();
      });
    }
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
const updateVisible = (isVisible: boolean, delay?: number) => {
  if (isVisible === visible.value && visibleTimer === 0) {
    return;
  }

  const update = () => {
    if (visible.value === isVisible) {
      return;
    }
    visible.value = isVisible;
    emits('update:visible', isVisible);
    if (isVisible) {
      unmount.value = false;
      nextTick(() => {
        updatePopupStyle();
      });
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
const bindTargetEvent = (el: HTMLElement | null) => {
  if (!el) {
    return;
  }
  targetEl = el;

  const triggers = Array.isArray(props.trigger) ? props.trigger : [props.trigger];
  triggerListener = bindTrigger(el, triggers, {
    updateFn: updateVisible,
    hoverDelay: props.hoverDelay,
  });

  if (props.hideWhenTargetInvisible) {
    intersctionObserver.addListener(targetEl, onTargetInterscting);
  }
};

// 触发元素为组件ref，处理事件触发
watch(
  () => props.target,
  (ele) => {
    if (ele) {
      bindTargetEvent((ele as ComponentPublicInstance).$el);
    }
  }
);
const onResize = (en: ResizeObserverEntry, isFirst: boolean) => {
  if (visible.value && !isFirst) {
    updatePopupStyle();
  }
};
const onPopupResize = (en: ResizeObserverEntry, isFirst: boolean) => {
  return onResize(en, props.hideWhenTargetInvisible ? isFirst : false);
};

const handleTransitionEnd = () => {
  if (!visible.value) {
    unmount.value = true;
  }
};

const scrollListener = throttleRAF(() => {
  if (visible.value) {
    updatePopupStyle();
  }
});

const listenScroll = (el: HTMLElement) => {
  el.addEventListener('scroll', scrollListener, { passive: true });
  return () => {
    el.removeEventListener('scroll', scrollListener);
  };
};
watch(popWrap, (popEl) => {
  let handles: Array<() => void> = [];
  if (popEl) {
    if (targetEl) {
      // 监听targetEl父组件滚动
      const scrollers = getScrollParents(targetEl);
      handles = scrollers.map((el) => {
        return listenScroll(el);
      });

      // 监听targetEL尺寸变化
      resizeObserver.addListener(targetEl, onResize);
    }
    if (!wrapperEl.value) {
      if (typeof props.wrapper === 'string') {
        wrapperEl.value = document.querySelector(props.wrapper);
      } else {
        wrapperEl.value = props.wrapper;
      }
    }
    if (wrapperEl.value) {
      // 监听warpper尺寸变化
      resizeObserver.addListener(wrapperEl.value, onResize);
    }
  } else {
    handles.forEach((hl) => hl());
    if (wrapperEl.value) {
      resizeObserver.removeListener(wrapperEl.value, onResize);
    }
    if (targetEl) {
      resizeObserver.removeListener(targetEl, onResize);
      intersctionObserver.removeListener(targetEl, onTargetInterscting);
      onlyTargetInViewport.value = true;
    }
  }
});

onMounted(() => {
  // 在mounted事件后再显示，避免找不到wrapper
  visible.value = props.visible;

  // 触发元素为dom或者选择器，处理事件触发
  nextTick(() => {
    // 绑定触发元素事件
    if (typeof props.target === 'string') {
      bindTargetEvent(document.querySelector(props.target));
    } else if (isElement(props.target)) {
      bindTargetEvent(props.target as HTMLElement);
    }

    // // 初始为true时，更新样式
    if (visible.value) {
      updatePopupStyle();
    }
  });
});

onUnmounted(() => {
  // 移除触发事件
  triggerListener.forEach((fn) => {
    fn();
  });
  // 销毁popup 的 resize监听
  if (wrapperEl.value) {
    resizeObserver.removeListener(wrapperEl.value, onResize);
  }
  if (targetEl) {
    resizeObserver.removeListener(targetEl, onResize);
  }
});
</script>
<template>
  <teleport v-if="!unmount || visible" :to="props.wrapper">
    <ResizeObserver @resize="onPopupResize">
      <div ref="popWrap" class="o-popup" :style="popStyle" v-bind="$attrs" :class="{ hide: !onlyTargetInViewport }">
        <Transition name="o-zoom-fade" :appear="true" @after-leave="handleTransitionEnd">
          <div v-if="visible" class="o-popup-wrap" :class="[`o-popup-pos-${popPosition}`]" :style="wrapStyle">
            <slot></slot>
            <div class="o-popup-anchor" :style="anchorStyle" :class="anchorClass">
              <slot name="anchor"></slot>
            </div>
          </div>
        </Transition>
      </div>
    </ResizeObserver>
  </teleport>
</template>

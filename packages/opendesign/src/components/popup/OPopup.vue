<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
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
   * 距离target偏移量
   */
  offset: {
    type: Number,
    default: 0,
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
  /**
   * 锚点自定义class
   */
  anchorClass: {
    type: String,
    default: '',
  },
  /**
   * 是否在popup隐藏时unmout
   */
  unmountOnClose: {
    type: Boolean,
    default: true,
  },
  /**
   * Popup在hover时是否不消失，当trigger包含hover时有效
   */
  statyOnHoverin: {
    type: Boolean,
    default: true,
  },
  /**
   * popup wrap自定义class
   */
  wrapClass: {
    type: String,
    default: '',
  },
});

const emits = defineEmits<{ (e: 'update:visible', val: boolean): void }>();
const triggers = Array.isArray(props.trigger) ? props.trigger : [props.trigger];

const visible = ref(false);
let targetEl: HTMLElement | null = null;
// 默认为true，避免props.visible为初始值为true时，无法计算popup位置
const isTargetInViewport = ref(true);

let wrapperEl: Ref<HTMLElement | null> = ref(null);
const popupRef = ref<HTMLElement | null>(null);
const popStyle = reactive<{ left?: string; top?: string; right?: string; bottom?: string }>({ left: '0px', top: '0px' });
const popPosition = ref(props.position);

const wrapOrigin = ref<{ left: string; top: string }>({ left: '0px', top: '0px' });
const wrapStyle = computed(() => ({
  transformOrigin: `${wrapOrigin.value.left} ${wrapOrigin.value.top}`,
}));

const anchorStyle = reactive<{ left?: string; top?: string; right?: string; bottom?: string }>({});

// 是否需要挂载
const mounted = ref(false);
const isAnimating = ref(false);

const resizeObserver = useResizeObserver();
const intersctionObserver = useIntersectionObserver();

// 处理popup位置
const updatePopupStyle = () => {
  if (props.hideWhenTargetInvisible && !isTargetInViewport.value) {
    return;
  }

  if (!targetEl || !popupRef.value || !wrapperEl.value) {
    return;
  }
  console.log('calc popup position...');

  const {
    popupStyle: pStyle,
    position,
    anchorStyle: aStyle,
  } = calcPopupStyle(popupRef.value, targetEl, props.position, {
    offset: props.offset,
  });

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

// 定义变量，避免首次监听与popup默认显示时重复计算
let oldIntersecting: boolean | null = null;
const onTargetInterscting: IntersectionListenerT = (entry: IntersectionObserverEntry) => {
  isTargetInViewport.value = entry.isIntersecting;

  if (oldIntersecting !== null && entry.isIntersecting) {
    if (visible.value) {
      nextTick(() => {
        updatePopupStyle();
      });
    }
  }
  oldIntersecting = isTargetInViewport.value;
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
    // 设置popup是否显示，不需要手动触发计算位置，显示时会触发resize，计算位置
    visible.value = isVisible;
    emits('update:visible', isVisible);
    if (isVisible) {
      mounted.value = true;

      if (props.hideWhenTargetInvisible && targetEl) {
        intersctionObserver.addListener(targetEl, onTargetInterscting);
      }
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

  triggerListener = bindTrigger(el, popupRef, triggers, {
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
/**
 * popup
 */
const onPopupResize = (en: ResizeObserverEntry) => {
  return onResize(en, false);
};
const handleTransitionStart = () => {
  isAnimating.value = true;
};
const handleTransitionEnd = () => {
  isAnimating.value = false;
  if (!visible.value && props.unmountOnClose) {
    mounted.value = false;
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

watch(popupRef, (popEl) => {
  let handles: Array<() => void> = [];
  if (popEl) {
    /**
     * popup显示时，监听挂载容器、关联元素
     */

    if (targetEl) {
      // 监听targetEl父组件滚动
      const scrollers = getScrollParents(targetEl);
      handles = scrollers.map((el) => {
        return listenScroll(el);
      });

      // 监听targetEL尺寸变化
      resizeObserver.addListener(targetEl, onResize);
    }

    if (wrapperEl.value) {
      // 监听warpper尺寸变化
      resizeObserver.addListener(wrapperEl.value, onResize);
    }
  } else {
    /**
     * popup隐藏时，销毁事件监听
     */

    handles.forEach((hl) => hl());
    if (wrapperEl.value) {
      resizeObserver.removeListener(wrapperEl.value, onResize);
    }
    if (targetEl) {
      resizeObserver.removeListener(targetEl, onResize);
      intersctionObserver.removeListener(targetEl, onTargetInterscting);
      isTargetInViewport.value = true;
    }
  }
});
const onPopupHoverIn = () => {
  if (triggers.includes('hover')) {
    updateVisible(true, props.hoverDelay);
  }
};
const onPopupHoverOut = () => {
  if (triggers.includes('hover')) {
    updateVisible(false, props.hoverDelay);
  }
};
onMounted(() => {
  // 在mounted事件后再显示，避免找不到wrapper
  visible.value = props.visible;

  // 触发元素为dom或者选择器，处理事件触发
  nextTick(() => {
    if (!wrapperEl.value) {
      if (typeof props.wrapper === 'string') {
        wrapperEl.value = document.querySelector(props.wrapper);
      } else {
        wrapperEl.value = props.wrapper;
      }
    }

    // 绑定触发元素事件
    if (typeof props.target === 'string') {
      bindTargetEvent(document.querySelector(props.target));
    } else if (isElement(props.target)) {
      bindTargetEvent(props.target as HTMLElement);
    }

    // 初始为true时，更新样式
    // if (visible.value) {
    //   updatePopupStyle();
    // }
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
  <teleport v-if="wrapperEl" :to="props.wrapper">
    <ResizeObserver v-if="mounted || visible" @resize="onPopupResize">
      <div
        ref="popupRef"
        class="o-popup"
        :style="popStyle"
        v-bind="$attrs"
        :class="[`o-popup-pos-${popPosition}`, { 'out-view': props.hideWhenTargetInvisible && !isTargetInViewport, animating: isAnimating }]"
        @mouseover="onPopupHoverIn"
        @mouseleave="onPopupHoverOut"
      >
        <Transition
          name="o-zoom-fade"
          :appear="true"
          @before-enter="handleTransitionStart"
          @after-enter="handleTransitionEnd"
          @before-leave="handleTransitionStart"
          @after-leave="handleTransitionEnd"
        >
          <div v-show="visible" class="o-popup-wrap" :style="wrapStyle" :class="wrapClass">
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

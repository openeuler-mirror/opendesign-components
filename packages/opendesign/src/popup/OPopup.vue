<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { onMounted, reactive, ref, Ref, watch, nextTick, onUnmounted, ComponentPublicInstance, computed, toRefs } from 'vue';
import { popupProps, PopupTriggerT } from './types';
import { isHtmlElement, getScrollParents } from '../_utils/dom';
import { throttleRAF } from '../_utils/helper';
import { isArray, isFunction } from '../_utils/is';
import { calcPopupStyle, bindTrigger, getTransformOrigin } from './popup';
import { useResizeObserver } from '../hooks/use-resize-observer';
import { OResizeObserver } from '../resize-observer';
import { useIntersectionObserver } from '../hooks';
import type { IntersectionListenerT } from '../hooks';
import { OChildOnly } from '../child-only';
import ClientOnly from '../_components/client-only';
import { resolveHtmlElement } from '../_utils/vue-utils';
import { isPhonePad } from '../_utils/global';
import { createTopZIndex, removeZIndex } from '../_utils/z-index';

// TODO 处理嵌套

const props = defineProps(popupProps);

const emits = defineEmits<{ (e: 'update:visible', val: boolean): void; (e: 'change', val: boolean): void }>();
const triggers = computed<PopupTriggerT[]>(() => {
  if (isPhonePad.value) {
    return ['click'];
  }
  return isArray(props.trigger) ? props.trigger : [props.trigger];
});

const visible = ref(false);
const targetElRef = ref<ComponentPublicInstance | null>(null);
let targetEl: HTMLElement | null = null;
// 默认为true，避免props.visible为初始值为true时，无法计算popup位置
const isTargetInViewport = ref(true);

let wrapperEl: Ref<HTMLElement | null> = ref(null);
const popupRef = ref<HTMLElement | null>(null);
const popStyle = reactive<{
  left?: string;
  top?: string;
  right?: string;
  bottom?: string;
  minWidth?: string;
  width?: string;
  '--popup-z-index'?: number;
  '--popup-edge-offset'?: string;
}>({
  '--popup-edge-offset': `${props.edgeOffset}px`,
});
const popPosition = ref(props.position);

const wrapOrigin = ref<{ left: string; top: string }>({ left: '0px', top: '0px' });
const wrapStyle = computed(() => ({
  transformOrigin: `${wrapOrigin.value.left} ${wrapOrigin.value.top}`,
}));

const anchorStyle = reactive<{ left?: string; top?: string; right?: string; bottom?: string }>({});

// 是否需要挂载
const toMount = ref(false);
const isAnimating = ref(false);

let ro: ReturnType<typeof useResizeObserver> | null = null;
let io: ReturnType<typeof useIntersectionObserver> | null = null;

const updateZIndex = (show: boolean) => {
  if (show) {
    popStyle['--popup-z-index'] = createTopZIndex();
  } else {
    removeZIndex(popStyle['--popup-z-index']);
  }
};

onMounted(() => {
  ro = useResizeObserver();
  io = useIntersectionObserver();

  // 在mounted事件后再显示，避免找不到wrapper
  visible.value = props.visible;
  if (props.visible) {
    updateZIndex(props.visible);
  }

  const { target, wrapper } = toRefs(props);
  // 绑定触发元素事件
  resolveHtmlElement(target).then((el) => {
    if (el) {
      bindTargetEvent(el);
    }
  });

  // 获取挂载容器
  resolveHtmlElement(wrapper).then((el) => {
    if (el) {
      wrapperEl.value = el;
    }
  });

  // 触发元素为dom或者选择器，处理事件触发
  // nextTick(() => {
  // if (!wrapperEl.value) {
  //   if (typeof props.wrapper === 'string') {
  //     wrapperEl.value = document.querySelector(props.wrapper);
  //   } else {
  //     wrapperEl.value = props.wrapper;
  //   }
  // }

  // 绑定触发元素事件
  // if (typeof props.target === 'string') {
  // bindTargetEvent(document.querySelector(props.target));
  // } else if (isHtmlElement(props.target)) {
  // bindTargetEvent(props.target as HTMLElement);
  // }

  // 初始为true时，更新样式
  // if (visible.value) {
  //   updatePopupStyle();
  // }
  // });
});

let triggerListener: ReturnType<typeof bindTrigger> = [];
const bindTargetEvent = (el: HTMLElement | null) => {
  if (!el) {
    return;
  }
  targetEl = el;

  // 初始化popup宽度，避免引起resize，触发重复计算
  if (props.adjustMinWidth) {
    popStyle.minWidth = `${targetEl.offsetWidth}px`;
  } else if (props.adjustWidth) {
    popStyle.width = `${targetEl.offsetWidth}px`;
  }

  triggerListener = bindTrigger(el, popupRef, triggers.value, {
    updateFn: updateVisible,
    hoverDelay: props.hoverDelay,
    autoHide: props.autoHide,
  });

  if (props.hideWhenTargetInvisible) {
    io?.observe(targetEl, onTargetInterscting);
  }
};

onUnmounted(() => {
  // 移除触发事件
  triggerListener.forEach((fn) => {
    fn();
  });
  // 销毁popup 的 resize监听
  if (wrapperEl.value) {
    ro?.unobserve(wrapperEl.value, onResize);
  }
  if (targetEl) {
    ro?.unobserve(targetEl, onResize);
  }
});

// 处理popup位置
const updatePopupStyle = () => {
  if (props.hideWhenTargetInvisible && !isTargetInViewport.value) {
    return;
  }

  if (!targetEl || !popupRef.value || !wrapperEl.value) {
    return;
  }

  const {
    popupStyle: pStyle,
    position,
    anchorStyle: aStyle,
  } = calcPopupStyle(popupRef.value, targetEl, props.position, {
    offset: props.offset,
    edgeOffset: props.edgeOffset,
    anchor: props.anchor,
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

const beforeToggle = async (show: boolean) => {
  let goon = true;
  if (show) {
    if (isFunction(props.beforeShow)) {
      goon = await props.beforeShow();
    }
  } else {
    if (isFunction(props.beforeHide)) {
      goon = await props.beforeHide();
    }
  }
  return goon !== false;
};

watch(
  () => props.visible,
  async (val) => {
    if (visible.value === val) {
      return;
    }

    const goon = await beforeToggle(val);
    if (!goon) {
      emits('update:visible', visible.value);
      return;
    }

    // visible.value = val;
    updateVisible(val);
    updateZIndex(val);
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
const updateVisible = async (isVisible?: boolean, delay?: number) => {
  if (props.disabled) {
    return;
  }

  const v = isVisible === undefined ? !visible.value : isVisible;

  if (v === visible.value && visibleTimer === 0) {
    return;
  }

  const update = () => {
    if (visible.value === v) {
      return;
    }
    // 设置popup是否显示，不需要手动触发计算位置，显示时会触发resize，计算位置
    visible.value = v;
    updateZIndex(v);

    emits('update:visible', v);
    emits('change', v);

    if (v) {
      toMount.value = true;

      if (props.hideWhenTargetInvisible && targetEl) {
        io?.observe(targetEl, onTargetInterscting);
      }
    }
  };

  const goon = await beforeToggle(v);
  if (!goon) {
    return;
  }

  if (delay) {
    clearVisibleTimer();
    visibleTimer = window.setTimeout(update, delay);
  } else {
    update();
  }
};

// 触发元素为组件ref，因生命周期问题，延后绑定处理事件触发
// watch(
//   () => props.target,
//   (ele) => {
//     if (isHtmlElement((ele as ComponentPublicInstance)?.$el)) {
//       bindTargetEvent((ele as ComponentPublicInstance).$el);
//     }
//   }
// );

watch(targetElRef, (elRef) => {
  if (isHtmlElement(elRef?.$el)) {
    bindTargetEvent(elRef?.$el);
  }
});

const onResize = (_en: ResizeObserverEntry, isFirst: boolean) => {
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
  if (!visible.value && props.unmountOnHide) {
    toMount.value = false;
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
      ro?.observe(targetEl, (en: ResizeObserverEntry, isFirst: boolean) => {
        if (props.adjustMinWidth) {
          popStyle.minWidth = `${targetEl?.offsetWidth}px`;
        } else if (props.adjustWidth) {
          popStyle.width = `${targetEl?.offsetWidth}px`;
        }
        onResize(en, isFirst);
      });
    }

    if (wrapperEl.value) {
      // 监听warpper尺寸变化
      ro?.observe(wrapperEl.value, onResize);
    }
  } else {
    /**
     * popup隐藏时，销毁事件监听
     */

    handles.forEach((hl) => hl());
    if (wrapperEl.value) {
      ro?.unobserve(wrapperEl.value, onResize);
    }
    if (targetEl) {
      ro?.unobserve(targetEl, onResize);
      io?.unobserve(targetEl, onTargetInterscting);
      isTargetInViewport.value = true;
    }
  }
});
const onPopupHoverIn = () => {
  if (triggers.value.includes('hover')) {
    updateVisible(true, props.hoverDelay);
  }
};
const onPopupHoverOut = () => {
  if (triggers.value.includes('hover') && props.autoHide) {
    updateVisible(false, props.hoverDelay);
  }
};
const sholdUmMount = computed(() => {
  return toMount.value || visible.value || !props.unmountOnHide;
});
</script>
<template>
  <OChildOnly v-if="$slots.target" ref="targetElRef">
    <slot name="target"></slot>
  </OChildOnly>
  <ClientOnly>
    <teleport :to="props.wrapper" :disabled="!props.wrapper">
      <OResizeObserver @resize="onPopupResize">
        <div
          v-if="sholdUmMount"
          ref="popupRef"
          class="o-popup"
          :style="popStyle"
          :class="[
            `o-popup-pos-${popPosition}`,
            {
              'out-view': props.hideWhenTargetInvisible && !isTargetInViewport,
              animating: isAnimating,
            },
          ]"
          v-bind="$attrs"
          @mouseenter="onPopupHoverIn"
          @mouseleave="onPopupHoverOut"
        >
          <Transition
            :name="props.transition"
            :appear="true"
            @before-enter="handleTransitionStart"
            @after-enter="handleTransitionEnd"
            @before-leave="handleTransitionStart"
            @after-leave="handleTransitionEnd"
          >
            <div v-show="visible" class="o-popup-wrap" :style="wrapStyle" :class="props.wrapClass">
              <div class="o-popup-body" :class="props.bodyClass">
                <slot></slot>
              </div>
              <div v-if="props.anchor" class="o-popup-anchor" :style="anchorStyle" :class="props.anchorClass">
                <slot name="anchor"></slot>
              </div>
            </div>
          </Transition>
        </div>
      </OResizeObserver>
    </teleport>
  </ClientOnly>
</template>

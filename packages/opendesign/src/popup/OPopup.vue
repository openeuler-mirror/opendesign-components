<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { onMounted, reactive, ref, Ref, watch, nextTick, onUnmounted, ComponentPublicInstance, computed, toRefs } from 'vue';
import { popupProps, PopupTriggerT } from './types';
import { isHtmlElement, getScrollParents } from '../_utils/dom';
import { throttleRAF, debounce } from '../_utils/helper';
import { isArray, isFunction } from '../_utils/is';
import { calcPopupStyle, bindTrigger, getTransformOrigin } from './popup';
import { useResizeObserver } from '../hooks/use-resize-observer';
import { OResizeObserver } from '../resize-observer';
import { useIntersectionObserver, useScreen } from '../hooks';
import { OChildOnly } from '../child-only';
import ClientOnly from '../_components/client-only';
import { resolveHtmlElement, getHtmlElement } from '../_utils/vue-utils';
import { createTopZIndex, removeZIndex } from '../_utils/z-index';

// TODO 处理嵌套

const props = defineProps(popupProps);

const emits = defineEmits<{
  /**
   * @zh-CN 弹层显示状态更新时触发
   * @en-US Triggered when the popup visibility is updated
   */
  (e: 'update:visible', val: boolean): void;
  /**
   * @zh-CN 弹层显示状态变化时触发
   * @en-US Triggered when the popup visibility changes
   */
  (e: 'change', val: boolean): void;
}>();

const { isPhonePad } = useScreen();

const triggers = computed<PopupTriggerT[]>(() => {
  const triggers = isArray(props.trigger) ? props.trigger : [props.trigger];
  if (isPhonePad.value) {
    const r = triggers.filter((item) => ['none', 'click-outclick', 'click'].includes(item));
    return r.length > 0 ? r : ['click'];
  }
  return triggers;
});

const visible = ref(false);
const targetElRef = ref<ComponentPublicInstance | null>(null);
let targetEl: HTMLElement | null = null;
// 默认为true，避免props.visible为初始值为true时，无法计算popup位置
const isTargetInViewport = ref(true);

const wrapperEl: Ref<HTMLElement | null> = ref(null);
const popupRef: Ref<HTMLElement | null> = ref(null);
const popStyle = reactive<{
  left: string;
  top: string;
  transform?: string;
  minWidth?: string;
  width?: string;
  '--popup-z-index'?: number;
  '--popup-edge-offset'?: string;
}>({
  '--popup-edge-offset': `${props.edgeOffset}px`,
  // left, top 恒为 0px
  left: '0px',
  top: '0px',
});

const popPosition = ref(props.position);

const wrapOrigin = ref<{ left: string; top: string }>({ left: '0px', top: '0px' });
const wrapStyle = computed(() => ({
  transformOrigin: `${wrapOrigin.value.left} ${wrapOrigin.value.top}`,
}));

const anchorStyle = ref<{ left?: string; top?: string; right?: string; bottom?: string }>({});

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
const { target, wrapper } = toRefs(props);
onMounted(() => {
  ro = useResizeObserver();
  io = useIntersectionObserver();

  // 在mounted事件后再显示，避免找不到wrapper
  visible.value = props.visible;
  if (props.visible) {
    updateZIndex(props.visible);
  }
});

onMounted(() => {
  watch(
    target,
    (newVal) => {
      if (newVal && targetEl) {
        ro?.unobserve(targetEl, onResize);
      }
      if (newVal) {
        // 同步绑定 bindTargetEvent，以同步设置 targetEl
        const el = getHtmlElement(newVal);
        if (el) {
          bindTargetEvent(el);
          // 更换 target 后更新弹窗位置
          updatePopupStyle();
        }
      }
    },
    { immediate: true },
  );
});

onMounted(() => {
  watch(
    wrapper,
    () => {
      if (wrapperEl.value) {
        ro?.unobserve(wrapperEl.value, onResize);
      }
      // 获取挂载容器
      resolveHtmlElement(wrapper).then((el) => {
        if (el) {
          wrapperEl.value = el;
        }
      });
    },
    { immediate: true },
  );
});

let triggerListener: ReturnType<typeof bindTrigger> = [];
const removeTriggerListener = () => triggerListener.forEach((fn) => fn());
const bindTargetEvent = (el: HTMLElement | null) => {
  if (!el) {
    return;
  }
  removeTriggerListener();
  targetEl = el;

  // 初始化popup宽度，避免引起resize，触发重复计算
  if (props.adjustMinWidth) {
    popStyle.minWidth = `${targetEl.offsetWidth}px`;
  } else if (props.adjustWidth) {
    popStyle.width = `${targetEl.offsetWidth}px`;
  }

  triggerListener = bindTrigger({
    el,
    popupRef,
    triggers: triggers.value,
    updateFn: setVisible,
    hoverDelay: props.hoverDelay,
    autoHide: props.autoHide,
  });

  if (props.hideWhenTargetInvisible) {
    io?.observe(targetEl, onTargetInterscting);
  }
};

onUnmounted(() => {
  // 移除触发事件
  removeTriggerListener();
  // 销毁popup 的 resize监听
  if (wrapperEl.value) {
    ro?.unobserve(wrapperEl.value, onResize);
  }
  if (targetEl) {
    ro?.unobserve(targetEl, onResize);
  }
});

const isHiddenWhenTargetOutViewport = () => props.hideWhenTargetInvisible && !isTargetInViewport.value;
// 处理popup位置
const updatePopupStyle = () => {
  if (isHiddenWhenTargetOutViewport()) {
    return;
  }

  if (!targetEl || !popupRef.value || !popupContent.value) {
    return;
  }

  const {
    popupStyle: pStyle,
    position,
    anchorStyle: aStyle,
  } = calcPopupStyle({
    popupEl: popupRef.value,
    targetEl,
    position: props.position,
    adaptive: props.adaptive,
    offset: props.offset,
    edgeOffset: props.edgeOffset,
    anchor: props.anchor,
  });

  wrapOrigin.value = getTransformOrigin(position);

  popPosition.value = position;
  popStyle.transform = `translate(${pStyle.left}px, ${pStyle.top}px)`;

  anchorStyle.value = aStyle;
};

// 定义变量，避免首次监听与popup默认显示时重复计算
let oldIntersecting: boolean | null = null;
const onTargetInterscting: (entry: IntersectionObserverEntry) => void = (entry: IntersectionObserverEntry) => {
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
    // setVisble 中已有 beforeToggle 等逻辑，此处不必处理
    setVisible(val);
  },
);
let visibleTimer = 0;
const clearVisibleTimer = () => {
  if (visibleTimer) {
    window.clearTimeout(visibleTimer);
    visibleTimer = 0;
  }
};
const applyVisible = (isVisible: boolean) => {
  visible.value = isVisible;
  updateZIndex(isVisible);
  if (props.visible !== isVisible) {
    emits('update:visible', isVisible);
    emits('change', isVisible);
  }

  if (visible.value) {
    toMount.value = true;
    // 在切换 visible.value 时不必手动调用 updatePopupStyle，因为 v-show 的切换会触发 onResize
    if (props.hideWhenTargetInvisible && targetEl) {
      io?.observe(targetEl, onTargetInterscting);
    }
  }
};
let visibleToggleId = 0;
// 更新可见状态，支持延迟更新
const setVisible = async (isVisible?: boolean, delay?: number) => {
  if (props.disabled) {
    return;
  }
  const currentVisibleToggleId = ++visibleToggleId;
  const v = isVisible ?? !visible.value;
  if (v === visible.value && visibleTimer === 0) {
    return;
  }
  if (!(await beforeToggle(v))) {
    return;
  }
  // 避免 beforeToggle 异步回调竞态导致 visible 混乱
  if (currentVisibleToggleId !== visibleToggleId) {
    return;
  }
  clearVisibleTimer();
  if (delay) {
    visibleTimer = window.setTimeout(() => {
      applyVisible(v);
      visibleTimer = 0;
    }, delay /** delay 时间相同，无竞态问题 */);
  } else {
    applyVisible(v);
  }
};

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
const onPopupResize = debounce(
  (en: ResizeObserverEntry) => {
    onResize(en, false);
  },
  100,
  true,
  true,
);
const handleTransitionStart = () => {
  isAnimating.value = true;
};
const popupContent = ref<HTMLDivElement>();
const checkVisibleState = debounce(
  () => {
    // transition 设置 name 属性后搭配 v-show，在 visible 快速切换时偶现元素未被隐藏
    // 根因：Transition 设置 name 后会通过异步 nextFrame 监听 transitionend/animationend，监听前检查 el._isLeaving。
    // 快速切换时，之前的 transitionend/animationend 回调将 _isLeaving 重置为 false，导致新一轮异步检测跳过隐藏处理。
    if (popupContent.value && visible.value === false && popupContent.value.style.display !== 'none') {
      popupContent.value.style.display = 'none';
    }
  },
  200, // 动画播放时间
  false,
);
const onBeforeLeave = () => {
  checkVisibleState();
  handleTransitionStart();
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

const listenScroll = (el: HTMLElement | Window) => {
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
      // 监听 targetEl 滚动父链 + window 自身的滚动
      const scrollers = getScrollParents(targetEl);

      handles = scrollers.map((el) => {
        return listenScroll(el);
      });
      handles.push(listenScroll(window));

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
    setVisible(true, props.hoverDelay);
  }
};
const onPopupHoverOut = () => {
  if (triggers.value.includes('hover') && props.autoHide) {
    setVisible(false, props.hoverDelay);
  }
};
const shouldMount = computed(() => {
  return toMount.value || visible.value || !props.unmountOnHide;
});
</script>
<template>
  <OChildOnly v-if="$slots.target" ref="targetElRef">
    <slot name="target"></slot>
  </OChildOnly>
  <ClientOnly v-if="!props.disabled">
    <teleport :to="props.wrapper" :disabled="!props.wrapper">
      <OResizeObserver @resize="onPopupResize">
        <div
          v-if="shouldMount"
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
            @before-leave="onBeforeLeave"
            @after-leave="handleTransitionEnd"
          >
            <div v-show="visible" ref="popupContent" class="o-popup-wrap" :style="wrapStyle" :class="props.wrapClass">
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

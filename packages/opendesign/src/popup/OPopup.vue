<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { onMounted, reactive, ref, Ref, watch, nextTick, onUnmounted, ComponentPublicInstance, computed, toRefs } from 'vue';
import { popupProps, PopupTriggerT, TargetRect } from './types';
import { isHtmlElement, getScrollParents } from '../_utils/dom';
import { throttleRAF, debounce } from '../_utils/helper';
import { isArray, isFunction, isTouchDevice } from '../_utils/is';
import { calcPopupStyle, bindTrigger, getTransformOrigin } from './popup';
import { useResizeObserver } from '../hooks/use-resize-observer';
import { OResizeObserver } from '../resize-observer';
import { useIntersectionObserver } from '../hooks';
import { OChildOnly } from '../child-only';
import ClientOnly from '../_components/client-only';
import { resolveHtmlElement, getHtmlElement } from '../_utils/vue-utils';
import { createTopZIndex } from '../_utils/z-index';
import { Log } from '../_utils/log';

// TODO 处理嵌套

const props = defineProps(popupProps);
const log = new Log('OPopup');
// targetRect 优先级高于 target，同时传入时 target 会被忽略
watch(
  () => [props.target, props.targetRect],
  () => {
    if (props.target && props.targetRect) {
      log.warn('`target` 与 `targetRect` 同时传入，`target` 将被忽略，请仅使用其一');
    }
  },
);

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

const triggers = computed<PopupTriggerT[]>(() => {
  const triggers = isArray(props.trigger) ? props.trigger : [props.trigger];
  // 触摸设备兜底：保留原触发器（hover 对鼠标/笔仍有效），若缺少 click 型
  // 触发则追加 click，确保触摸屏操作可打开/关闭 popup
  if (isTouchDevice) {
    const hasClick = triggers.some((item) => item === 'click' || item === 'click-outclick');
    return hasClick || triggers.includes('none') ? triggers : [...triggers, 'click'];
  }
  return triggers;
});

const visible = ref(false);
const targetElRef = ref<ComponentPublicInstance | null>(null);
// 交互元素：仅承担 trigger 事件绑定与可见性观察，不参与定位计算。
// 定位源统一收敛到 innerTargetRect，消除多 watcher 写同一变量的踩踏
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

/**
 * @description 定位源状态：元素模式的观察者与数据模式的 targetRect 监听统一写入此处，
 * 作为唯一定位源驱动重算（#199 回归的根治点）
 */
const innerTargetRect = ref<TargetRect | null>(null);

/**
 * @description 拷贝矩形为普通对象：始终整体替换写入，保证内部浅层 watch 可靠触发
 * （直接存 prop 引用的话，调用方原地修改字段无法触发重算，见 ADR 0001）
 * @param r - 定位源矩形
 * @returns 拷贝后的普通矩形对象
 */
const copyRect = (r: TargetRect): TargetRect => ({ left: r.left, top: r.top, width: r.width, height: r.height });

// 交互元素绑定：元素模式定位源同步与 trigger 绑定均由此发起
/**
 * @description 元素模式：从交互元素读取实时矩形写入定位源；
 * 数据模式下为 no-op——定位源是 prop 数据，元素观察者不得写入
 */
const syncInnerRect = () => {
  if (props.targetRect) {
    return;
  }
  innerTargetRect.value = targetEl ? copyRect(targetEl.getBoundingClientRect()) : null;
};

// 唯一定位重算入口：定位源变化 → 重算弹层位置。
// 默认 pre-flush（微任务级触发），滚动场景与观察者同帧完成，不引入额外 rAF 延迟
watch(innerTargetRect, (r) => {
  // 数据模式：宽度镜像跟随矩形宽度（「触发元素宽度」即 rect 宽度）
  if (r && props.targetRect) {
    if (props.adjustMinWidth) {
      popStyle.minWidth = `${r.width}px`;
    } else if (props.adjustWidth) {
      popStyle.width = `${r.width}px`;
    }
  }
  if (!r) {
    // 定位源全空：清除定位样式，回归父级布局（如 OTour 居中步骤）
    popStyle.transform = '';
    return;
  }
  updatePopupStyle();
});

/**
 * @description 显示后刷新定位源并触发重算：unmountOnHide 场景隐藏期间
 * 观察者解绑、矩形可能陈旧，靠显示时刷新兜底
 */
const refreshPositionSource = () => {
  if (props.targetRect) {
    innerTargetRect.value = copyRect(props.targetRect);
  } else {
    syncInnerRect();
  }
};

onMounted(() => {
  watch(
    target,
    (newVal) => {
      if (props.targetRect) {
        return;
      }
      if (newVal && targetEl) {
        ro?.unobserve(targetEl as HTMLElement, onResize);
      }
      if (newVal) {
        // 同步绑定 bindTargetEvent（内部末尾 syncInnerRect 同步定位源）
        const el = getHtmlElement(newVal);
        if (el) {
          bindTargetEvent(el);
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
    popStyle.minWidth = `${el.offsetWidth}px`;
  } else if (props.adjustWidth) {
    popStyle.width = `${el.offsetWidth}px`;
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
    io?.observe(el, onTargetInterscting);
  }

  // 交互元素绑定/更换后同步定位源，触发唯一定位重算入口
  syncInnerRect();
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
// 处理popup位置（以 innerTargetRect 为定位源，不感知 target 形态）
const updatePopupStyle = () => {
  if (isHiddenWhenTargetOutViewport()) {
    return;
  }

  const tRect = innerTargetRect.value;
  if (!tRect || !popupRef.value || !popupContent.value) {
    return;
  }

  const {
    popupStyle: pStyle,
    position,
    anchorStyle: aStyle,
  } = calcPopupStyle({
    popupEl: popupRef.value,
    tRect,
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
        // 重新进入视口后同步定位源（元素可能已移动）
        syncInnerRect();
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
    // 靠显示时刷新兜底；popup RO（v-show 切换触发 onResize）仍作为自然兜底保留
    nextTick(refreshPositionSource);
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

// 定位源 prop 监听：数据模式下拷贝写入 innerTargetRect（deep 支持响应式对象原地修改）；
// 清空时回退交互元素实时矩形，无元素则置空走父级布局
// 声明位置约束：immediate 回调在 setup 期同步调用 bindTargetEvent，其函数体又会求值
// setVisible / onTargetInterscting 等 const 声明，故本 watch 须置于这些声明全部之后，避开暂存死区
watch(
  () => props.targetRect,
  (r) => {
    if (r) {
      innerTargetRect.value = copyRect(r);
    } else {
      // 回退场景：target prop 因同传被跳过绑定时补绑，使清空后能回退到其定位
      if (!targetEl && target.value) {
        const el = getHtmlElement(target.value);
        if (el) {
          bindTargetEvent(el);
        }
      }
      syncInnerRect();
    }
  },
  { immediate: true, deep: true },
);

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
    // 元素模式：从交互元素同步实时矩形，经唯一定位重算入口更新；
    // 数据模式下无滚动监听——滚动跟随职责在调用方（ADR 0001）
    syncInnerRect();
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
      // 监听交互元素滚动父链 + window 自身的滚动
      const targetHtmlEl = targetEl;
      const scrollers = getScrollParents(targetHtmlEl);

      handles = scrollers.map((el) => {
        return listenScroll(el);
      });
      handles.push(listenScroll(window));

      // 监听交互元素尺寸变化：宽度镜像 + 定位源同步（rect 随尺寸变化）
      ro?.observe(targetHtmlEl, (en: ResizeObserverEntry, isFirst: boolean) => {
        if (props.adjustMinWidth) {
          popStyle.minWidth = `${targetHtmlEl.offsetWidth}px`;
        } else if (props.adjustWidth) {
          popStyle.width = `${targetHtmlEl.offsetWidth}px`;
        }
        if (visible.value && !isFirst) {
          syncInnerRect();
        }
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

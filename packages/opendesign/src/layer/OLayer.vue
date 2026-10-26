<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick, onUnmounted, CSSProperties, Ref, provide } from 'vue';
import { layerProps } from './types';
import { layerInjectKey } from './provide';
import { useMouse } from '../hooks/use-mouse';
import { isFunction, isUndefined } from '../_utils/is';
import { Log } from '../_utils/log';
import { createTopZIndex } from '../_utils/z-index';
import { IconClose } from '../_utils/icons';
import { OIcon } from '../icon';

const props = defineProps(layerProps);

const logger = new Log('OLayer');
// 运行时废弃警告：transitionOrign 拼写已纠正为 transitionOrigin
if (!isUndefined(props.transitionOrign)) {
  logger.warn('[OLayer] prop `transitionOrign` 已废弃，请使用 `transitionOrigin` 替代');
}

// 合并新旧 prop：旧 transitionOrign 作为兼容回退
const transitionOrigin = computed(() => props.transitionOrign ?? props.transitionOrigin);

const emits = defineEmits<{
  /**
   * @zh-CN 浮层可见状态变化时触发
   * @en-US Triggered when the layer visibility changes
   */
  (e: 'change', visible: boolean): void;
  /**
   * @zh-CN 浮层可见状态更新时触发
   * @en-US Triggered when the layer visibility is updated
   */
  (e: 'update:visible', value: boolean, evt?: MouseEvent): void;
  /**
   * @zh-CN 点击遮罩层时触发
   * @en-US Triggered when the mask layer is clicked
   */
  (e: 'click:mask', evt: MouseEvent): void;
  /**
   * @zh-CN 点击关闭按钮时触发
   * @en-US Triggered when the close button is clicked
   */
  (e: 'click:button', evt: MouseEvent): void;
}>();

const visible = ref(props.visible);
const toMount = ref(props.visible);

const zIndex = ref(visible.value ? createTopZIndex() : 0);

const isToBody = ref(false);
const LayerClass = {
  OPEN: 'o-layer-open',
};
const mainRef: Ref<HTMLElement | null> = ref(null);

let mouse = useMouse({
  type: 'client',
});

const layerRef: Ref<HTMLElement | null> = ref(null);
// 挂载目标
let wrapperEl: HTMLElement | null = null;

const initWrapperEl = () => {
  if (!wrapperEl && layerRef.value) {
    wrapperEl = layerRef.value.offsetParent as HTMLElement;
    if (!wrapperEl) {
      wrapperEl = document.body;
      isToBody.value = true;
    } else {
      isToBody.value = wrapperEl === document.body;
    }
  }
  return wrapperEl;
};

const hasSetLayerClass = ref(false);
const handleWrapperScroll = () => {
  nextTick(() => {
    initWrapperEl();
    if (wrapperEl) {
      if (visible.value) {
        if (!wrapperEl.classList.contains(LayerClass.OPEN)) {
          wrapperEl.classList.add(LayerClass.OPEN);
          hasSetLayerClass.value = true;
        }
      } else {
        if (hasSetLayerClass.value) {
          wrapperEl.classList.remove(LayerClass.OPEN);
          hasSetLayerClass.value = false;
        }
      }
    }
  });
};

const mainStyle = ref<CSSProperties>({});

// 以鼠标位置缩放
const getOriginStyle = () => {
  let ox = 'center';
  let oy = 'center';
  if (mainRef.value && mouse) {
    const { offsetLeft, offsetTop } = mainRef.value;
    if (isToBody.value) {
      ox = `${mouse.x.value - offsetLeft}px`;
      oy = `${mouse.y.value - offsetTop}px`;
    } else if (wrapperEl) {
      const size = wrapperEl.getBoundingClientRect();

      ox = `${mouse.x.value - offsetLeft - size.x}px`;
      oy = `${mouse.y.value - offsetTop - size.y}px`;
    }
  }
  return `${ox} ${oy}`;
};
const updateOrigin = (_el: HTMLElement | null) => {
  if (transitionOrigin.value === 'mouse') {
    initWrapperEl();
    mainStyle.value.transformOrigin = getOriginStyle();
  }
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

const updateZIndex = (show: boolean) => {
  if (show) {
    zIndex.value = createTopZIndex();
  }
};
watch(
  () => props.visible,
  async (v: boolean) => {
    if (visible.value !== v) {
      const goon = await beforeToggle(v);
      if (!goon) {
        emits('update:visible', visible.value);
        return;
      }

      updateZIndex(v);
      visible.value = v;

      emits('change', v);
      handleWrapperScroll();
    }
  },
);

const toggle = async (show?: boolean) => {
  if (visible.value === show) {
    return;
  }

  let toShow = show === undefined ? !visible.value : show;

  const goon = await beforeToggle(toShow);
  if (!goon) {
    return;
  }

  updateZIndex(toShow);
  visible.value = toShow;

  emits('update:visible', visible.value);
  emits('change', visible.value);
  handleWrapperScroll();
};

const isMounted = computed(() => {
  return !props.unmountOnHide || visible.value || toMount.value;
});

const handleTransitionStart = () => {
  toMount.value = true;
};
const handleTransitionEnter = () => {
  if (visible.value) {
    updateOrigin(mainRef.value);
  }
};
const handleTransitionEnd = () => {
  if (!props.unmountOnHide) {
    toMount.value = false;
  } else if (!visible.value) {
    toMount.value = false;
  }
};

const onMaskClick = (e: MouseEvent) => {
  if (props.maskClose) {
    toggle(false);
  }
  emits('click:mask', e);
};

const onCloseButtonClick = (e: MouseEvent) => {
  toggle(false);
  emits('click:button', e);
};
onMounted(() => {
  if (visible.value) {
    handleWrapperScroll();
  }
});

onUnmounted(() => {
  mouse?.destroy();
  if (hasSetLayerClass.value && wrapperEl) {
    wrapperEl.classList.remove(LayerClass.OPEN);
    hasSetLayerClass.value = false;
  }
});

provide(layerInjectKey, { toggle });

defineExpose({
  /**
   * @zh-CN 切换浮层显示状态
   * @en-US Toggle the layer visibility
   */
  toggle,
  /**
   * @zh-CN 根 DOM 元素（即 `.o-layer` 容器）
   * @en-US Root DOM element (the `.o-layer` container)
   * @description 供外部组件绑定键盘事件、焦点陷阱等需要覆盖整个浮层的行为。
   * 元素受 `v-if="isMounted"` 控制，未挂载时返回 null。
   */
  get rootEl() {
    return layerRef.value;
  },
  /**
   * @zh-CN 内容区 DOM 元素（即 `.o-layer-main` 容器）
   * @en-US Content DOM element (the `.o-layer-main` container)
   * @description 接收 `mainClass` / `mainStyle` 的元素，包裹 slot 内容。
   * 供外部组件绑定 click 等内容区级别的事件。
   */
  get mainEl() {
    return mainRef.value;
  },
});
</script>
<template>
  <teleport :to="props.wrapper" :disabled="!props.wrapper">
    <div
      v-if="isMounted"
      v-show="visible || toMount"
      ref="layerRef"
      class="o-layer"
      :class="{ 'o-layer-to-body': isToBody }"
      v-bind="$attrs"
      :style="{
        '--layer-z-index': zIndex,
      }"
    >
      <template v-if="props.mask">
        <transition :name="props.maskTransition" :appear="true">
          <div v-show="visible" class="o-layer-mask" @click="onMaskClick"></div>
        </transition>
      </template>
      <transition
        :appear="true"
        :name="props.mainTransition"
        @before-enter="handleTransitionStart"
        @enter="handleTransitionEnter"
        @after-enter="handleTransitionEnd"
        @before-leave="handleTransitionStart"
        @after-leave="handleTransitionEnd"
      >
        <div v-show="visible" ref="mainRef" :class="props.mainClass" :style="mainStyle" class="o-layer-main">
          <slot></slot>
        </div>
      </transition>
      <div v-if="props.buttonClose" class="o-layer-close" @click="onCloseButtonClick">
        <slot name="close">
          <OIcon button :icon="IconClose" class="o-layer-close-icon" />
        </slot>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick, onUnmounted, CSSProperties, Ref } from 'vue';
import { layerProps } from './types';
import { useMouse, UseMouseT } from '../hooks/use-mouse';
import { isFunction } from '../_utils/is';
import { createTopZIndex, removeZIndex } from '../_utils/z-index';
import { IconClose } from '../_utils/icons';
import { OIcon } from '../icon';

const props = defineProps(layerProps);

const emits = defineEmits<{
  (e: 'change', visible: boolean): void;
  (e: 'update:visible', value: boolean, evt?: MouseEvent): void;
  (e: 'click:mask', evt: MouseEvent): void;
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

let mouse: UseMouseT = useMouse({
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

const handleWrapperScroll = () => {
  nextTick(() => {
    initWrapperEl();
    if (wrapperEl) {
      if (visible.value) {
        wrapperEl.classList.add(LayerClass.OPEN);
      } else {
        wrapperEl.classList.remove(LayerClass.OPEN);
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
const updateOrigin = (el: HTMLElement | null) => {
  if (props.transitionOrign === 'mouse') {
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
  } else {
    removeZIndex(zIndex.value);
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
  }
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
  // 卸载时移除类
  wrapperEl?.classList.remove(LayerClass.OPEN);
});

defineExpose({
  toggle,
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
      <div class="o-layer-close" v-if="props.buttonClose" @click="onCloseButtonClick">
        <slot name="close">
          <OIcon button :icon="IconClose" class="o-layer-close-icon" />
        </slot>
      </div>
    </div>
  </teleport>
</template>

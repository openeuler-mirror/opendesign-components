<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick, onUnmounted, CSSProperties } from 'vue';
import { layerProps } from './types';
import { useMouse, UseMouseT } from '../hooks/use-mouse';

const props = defineProps(layerProps);

const emits = defineEmits<{
  (e: 'change', val: boolean): void;
  (e: 'update:visible', val: boolean, evt?: MouseEvent): void;
  (e: 'click:mask', evt: MouseEvent): void;
}>();

const visible = ref(props.visible);
const toMount = ref(props.visible);

const isToBody = ref(false);
const LayerClass = {
  OPEN: 'o-layer-open',
};
const mainRef = ref<HTMLElement | null>(null);

let mouse: UseMouseT = useMouse({
  type: 'client',
});

const layerRef = ref<HTMLElement | null>(null);
// 挂载目标
let wrapperEl: HTMLElement | null = null;

const initWrapperEl = () => {
  if (!wrapperEl && layerRef.value) {
    wrapperEl = layerRef.value.offsetParent as HTMLElement;
    isToBody.value = wrapperEl === document.body;
  }
  return wrapperEl;
};

const handleWrapperScroll = () => {
  initWrapperEl();
  nextTick(() => {
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
watch(
  () => props.visible,
  (v: boolean) => {
    if (visible.value !== v) {
      visible.value = v;
      emits('change', v);
      handleWrapperScroll();
    }
  }
);

const toggle = (show?: boolean) => {
  if (visible.value === show) {
    return;
  }

  if (show === undefined) {
    visible.value = !visible.value;
  } else {
    visible.value = show;
  }
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

onMounted(() => {
  if (visible.value) {
    handleWrapperScroll();
  }
});

onUnmounted(() => {
  mouse?.destroy();
});

defineExpose({
  toggle,
});
</script>
<template>
  <teleport :to="props.wrapper" :disabled="!props.wrapper">
    <div v-if="isMounted" v-show="visible || toMount" ref="layerRef" class="o-layer" :class="{ 'o-layer-to-body': isToBody }" v-bind="$attrs">
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
    </div>
  </teleport>
</template>

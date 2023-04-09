<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { layerProps } from './types';

const props = defineProps(layerProps);

const emits = defineEmits<{
  (e: 'change', val: boolean): void;
  (e: 'update:visible', val: boolean, evt?: MouseEvent): void;
  (e: 'click:mask', evt: MouseEvent): void;
}>();

const visible = ref(props.visible);
const toMount = ref(props.visible);

const isToBody = ref(false);

// 挂载目标
let wrapperEl: HTMLElement | null = null;
const getWrapperEl = () => {
  if (!wrapperEl && props.wrapper) {
    if (typeof props.wrapper === 'string') {
      wrapperEl = document.querySelector(props.wrapper);
    } else {
      wrapperEl = props.wrapper;
    }
  }
  isToBody.value = wrapperEl === document.body;
};
const handleWrapperScroll = () => {
  getWrapperEl();
  if (wrapperEl) {
    if (visible.value) {
      wrapperEl.classList.add('o-layer-open');
    } else {
      wrapperEl.classList.remove('o-layer-open');
    }
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

const show = () => {
  if (!visible.value) {
    visible.value = true;
    emits('update:visible', true);
    emits('change', true);
    handleWrapperScroll();
  }
};

const hide = () => {
  if (visible.value) {
    visible.value = false;
    emits('update:visible', false);
    emits('change', false);
    handleWrapperScroll();
  }
};

const isMounted = computed(() => {
  return !props.unmountOnHide || visible.value || toMount.value;
});

const handleTransitionStart = () => {
  toMount.value = true;
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
    hide();
  }
  emits('click:mask', e);
};

onMounted(() => {
  if (visible.value) {
    handleWrapperScroll();
  }
});

defineExpose({
  show,
  hide,
});
</script>
<template>
  <teleport :to="props.wrapper" :disabled="!props.wrapper">
    <div v-if="isMounted" v-show="visible || toMount" class="o-layer" v-bind="$attrs" :class="{ 'o-layer-to-body': isToBody }">
      <template v-if="props.mask">
        <transition :name="props.maskTransition" :appear="true">
          <div v-show="visible" class="o-layer-mask" @click="onMaskClick"></div>
        </transition>
      </template>
      <transition
        :appear="true"
        :name="props.mainTransition"
        @before-enter="handleTransitionStart"
        @after-enter="handleTransitionEnd"
        @before-leave="handleTransitionStart"
        @after-leave="handleTransitionEnd"
      >
        <div v-show="visible" :class="props.mainClass">
          <slot></slot>
        </div>
      </transition>
    </div>
  </teleport>
</template>

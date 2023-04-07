<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { layerProps } from './types';

const props = defineProps(layerProps);

const emits = defineEmits<{
  (e: 'change', val: boolean): void;
  (e: 'update:visible', val: boolean, evt: MouseEvent): void;
  (e: 'click:mask', evt: MouseEvent): void;
}>();

const visible = ref(props.visible);
const toMount = ref(props.visible);

// 挂载目标
let wrapperEl: HTMLElement | null = null;
const handleWrapperScroll = () => {
  if (!wrapperEl) {
    if (typeof props.wrapper === 'string') {
      wrapperEl = document.querySelector(props.wrapper);
    } else {
      wrapperEl = props.wrapper;
    }
  }
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
    visible.value = false;
    emits('update:visible', false, e);
    emits('change', false);
    handleWrapperScroll();
  }
  emits('click:mask', e);
};

onMounted(() => {
  if (visible.value) {
    handleWrapperScroll();
  }
});
</script>
<template>
  <teleport :to="props.wrapper">
    <div v-if="isMounted" v-show="visible || toMount" class="o-layer">
      <template v-if="props.mask">
        <transition name="o-fade-in" :appear="true">
          <div v-show="visible" class="o-layer-mask" @click="onMaskClick"></div>
        </transition>
      </template>
      <transition
        :appear="true"
        :name="props.transition"
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

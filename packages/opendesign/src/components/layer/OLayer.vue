<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick } from 'vue';
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
const LayerClass = {
  OPEN: 'o-layer-open',
};
// 挂载目标
let wrapperEl: HTMLElement | null = null;
const layerRef = ref<HTMLElement | null>(null);

const handleWrapperScroll = () => {
  nextTick(() => {
    if (!wrapperEl && layerRef.value) {
      wrapperEl = layerRef.value.offsetParent as HTMLElement;
      isToBody.value = wrapperEl === document.body;
    }
    if (wrapperEl) {
      if (visible.value) {
        wrapperEl.classList.add(LayerClass.OPEN);
      } else {
        wrapperEl.classList.remove(LayerClass.OPEN);
      }
    }
  });
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

defineExpose({
  toggle,
});
</script>
<template>
  <teleport :to="props.wrapper" :disabled="!props.wrapper">
    <div v-if="isMounted" v-show="visible || toMount" v-bind="$attrs" ref="layerRef" class="o-layer" :class="{ 'o-layer-to-body': isToBody }">
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

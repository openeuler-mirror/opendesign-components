<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { IconLoading } from '../_shared/icons';

import { loadingProps } from './types';

const props = defineProps(loadingProps);

const emits = defineEmits<{
  (e: 'change', val: boolean): void;
  (e: 'update:show', val: boolean, evt?: MouseEvent): void;
}>();
const isShow = ref(props.show);
const toMount = ref(false);
const isMounted = computed(() => {
  return toMount.value || isShow.value || !props.unmountOnHide;
});
const loadingLabel = 'loading...';

const handleTransitionStart = () => {
  toMount.value = true;
};
const handleTransitionEnd = () => {
  if (!isShow.value && props.unmountOnHide) {
    toMount.value = false;
  }
};

const onMaskClick = (e: MouseEvent) => {
  if (props.maskClose) {
    isShow.value = false;
    emits('change', false);
    emits('update:show', false, e);
  }
};

watch(
  () => props.show,
  (v) => {
    if (v !== isShow.value) {
      isShow.value = v;
    }
  }
);

const toggle = (show: boolean) => {
  let to = show === undefined ? !isShow.value : show;
  if (isShow.value !== to) {
    isShow.value = to;
    emits('change', false);
    emits('update:show', false);
  }
};

defineExpose({
  toggle,
});
</script>
<template>
  <teleport :to="props.wrapper" :disabled="!props.wrapper">
    <div v-if="isMounted" class="o-loading">
      <transition name="o-fade-in" :appear="true">
        <div v-show="isShow && props.mask" class="o-loading-mask" @click="onMaskClick"></div>
      </transition>
      <transition
        :appear="true"
        :name="props.transition"
        @before-enter="handleTransitionStart"
        @after-enter="handleTransitionEnd"
        @before-leave="handleTransitionStart"
        @after-leave="handleTransitionEnd"
      >
        <div v-show="isShow" class="o-loading-main">
          <slot>
            <div class="o-loading-icon">
              <slot name="icon"><IconLoading class="o-rotating" /></slot>
            </div>
            <div class="o-loading-label">
              <slot name="label">{{ loadingLabel }}</slot>
            </div>
          </slot>
        </div>
      </transition>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { IconClose } from '../_shared/icons';

import { dialogProps } from './types';

const props = defineProps(dialogProps);

const emits = defineEmits<{
  (e: 'change', val: boolean): void;
  (e: 'update:modelValue', val: boolean, evt: MouseEvent): void;
}>();

const toMount = ref(false);
const isMounted = computed(() => {
  return toMount.value || isShow.value || !props.unmountOnHide;
});

const isShow = ref(props.modelValue);
watch(
  () => props.modelValue,
  (v: boolean) => {
    if (isShow.value !== v) {
      isShow.value = v;
      emits('change', v);
    }
  }
);

const onCloseClick = (e: MouseEvent) => {
  isShow.value = false;
  emits('change', false);
  emits('update:modelValue', false, e);
};

const onMaskClick = (e: MouseEvent) => {
  isShow.value = false;
  emits('change', false);
  emits('update:modelValue', false, e);
};
</script>
<template>
  <teleport :to="props.wrapper">
    <div
      class="o-dialog"
      :class="{
        'is-show': isShow,
      }"
    >
      <transition name="o-fade-up-enter">
        <div v-if="isMounted" class="o-dlg-mask" @click="onMaskClick"></div>
      </transition>
      <transition :name="props.transition">
        <div v-if="isMounted" class="o-dlg-main" :class="props.wrapClass">
          <div class="o-dlg-btn-close" @click="onCloseClick"><IconClose /></div>
          <div v-if="$slots.header" class="o-dlg-head">
            <slot name="header"></slot>
          </div>
          <div class="o-dlg-body">
            <slot></slot>
          </div>
          <div v-if="$slots.footer" class="o-dlg-foot">
            <slot name="footer"></slot>
          </div>
        </div>
      </transition>
    </div>
  </teleport>
</template>

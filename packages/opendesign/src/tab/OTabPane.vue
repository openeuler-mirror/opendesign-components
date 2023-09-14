<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { computed, getCurrentInstance, inject, onMounted, nextTick, ref, watch } from 'vue';
import { tabInjectKey } from './provide';
import { tabPaneProps } from './types';
import { IconClose } from '../_utils/icons';
import ClientOnly from '../_components/client-only';
import { isUndefined } from '../_utils/is';

const props = defineProps(tabPaneProps);

const isClosed = ref(false);

const navRef = ref<HTMLElement | null>(null);

const tabInjection = inject(tabInjectKey, null);

const { navsRef, activeValue, lazy } = tabInjection || {};

const instance = getCurrentInstance();
if (isUndefined(props.value) && isUndefined(props.label)) {
  console.warn('OTabPane is missing prop: value or lable');
}
const paneKey = computed(() => {
  return props.value ?? props.label ?? instance?.uid ?? Math.random();
});

const isActive = computed(() => paneKey.value === activeValue?.value);
const hasActived = ref(isActive.value);
const toMount = computed(() => {
  if (isActive.value) {
    return true;
  }
  if ((props.lazy || lazy) && !hasActived.value) {
    return false;
  }
  if (props.unmountOnHide) {
    return false;
  }
  return true;
});

watch(
  () => isActive.value,
  (v: boolean) => {
    if (v) {
      hasActived.value = true;
      tabInjection?.updateValue(paneKey.value, navRef.value);
    }
  }
);

const navClick = () => {
  if (!props.disabled) {
    tabInjection?.updateValue(paneKey.value, navRef.value);
  }
};
const navCloseClick = (e: MouseEvent) => {
  e.stopImmediatePropagation();
  isClosed.value = true;

  tabInjection?.onDeletePane(paneKey.value, e);
};

onMounted(() => {
  nextTick(() => {
    tabInjection?.initValue(paneKey.value, navRef.value);
  });
});
</script>
<template>
  <ClientOnly>
    <teleport v-if="navsRef && !isClosed" :to="navsRef" :disabled="!navsRef">
      <div
        ref="navRef"
        :class="[
          'o-tab-nav',
          {
            'o-tab-nav-active': isActive,
            'o-tab-nav-disabled': props.disabled,
            'o-tab-nav-closable': props.closable,
          },
        ]"
        @click="navClick"
      >
        <slot name="nav">
          {{ props.label || props.value }}
        </slot>
        <div v-if="props.closable" class="o-tab-nav-close" @click="navCloseClick"><IconClose /></div>
      </div>
    </teleport>
  </ClientOnly>

  <transition :name="props.transition">
    <div
      v-if="!isClosed && toMount"
      v-show="isActive"
      :class="[
        'o-tab-pane',
        {
          'o-tab-pane-active': isActive,
          'o-tab-pane-disabled': props.disabled,
          'o-tab-pane-closable': props.closable,
        },
      ]"
      v-bind="$attrs"
    >
      <slot></slot>
    </div>
  </transition>
</template>

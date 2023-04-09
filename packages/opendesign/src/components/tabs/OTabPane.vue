<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { computed, getCurrentInstance, inject, onMounted, nextTick, ref, watch } from 'vue';
import { tabsInjectKey } from './provide';
import { tabPaneProps } from './types';
import { IconClose } from '../_shared/icons';
import ClientOnly from '../_shared/components/client-only';

const props = defineProps(tabPaneProps);

const isClosed = ref(false);

const navRef = ref<HTMLElement | null>(null);

const tabsInjection = inject(tabsInjectKey, null);

const { navsRef, activeValue, lazy } = tabsInjection || {};
// console.log(props.transition);

const instance = getCurrentInstance();
if (!props.value && !props.label) {
  console.warn('OTabPane is missing prop: value or lable');
}
const paneKey = computed(() => {
  return props.value || props.label || instance?.uid || Math.random();
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
// console.log(toMount.value, props.unmountOnHide);

watch(
  () => isActive.value,
  (v: boolean) => {
    if (v) {
      hasActived.value = true;
      tabsInjection?.updateValue(paneKey.value, navRef.value);
    }
  }
);

const navClick = () => {
  if (!props.disabled) {
    tabsInjection?.updateValue(paneKey.value, navRef.value);
  }
};
const navCloseClick = (e: MouseEvent) => {
  e.stopImmediatePropagation();
  isClosed.value = true;

  tabsInjection?.onDeletePane(paneKey.value, e);
};

onMounted(() => {
  nextTick(() => {
    tabsInjection?.initValue(paneKey.value, navRef.value);
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
          <div class="o-tab-nav-title">{{ props.label || props.value }}</div>
        </slot>
        <div v-if="props.closable" class="o-tab-nav-close" @click="navCloseClick"><IconClose /></div>
      </div>
    </teleport>
  </ClientOnly>

  <transition :name="props.transition">
    <div
      v-if="!isClosed && toMount"
      v-show="isActive"
      v-bind="$attrs"
      :class="[
        'o-tab-pane',
        {
          'o-tab-pane-active': isActive,
          'o-tab-pane-disabled': props.disabled,
          'o-tab-pane-closable': props.closable,
        },
      ]"
    >
      <slot></slot>
    </div>
  </transition>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { computed, getCurrentInstance, inject, onMounted, ref, useSlots, watch } from 'vue';
import { useMutationObserver } from '@vueuse/core';

import ClientOnly from '../_components/client-only';
import { isUndefined } from '../_utils/is';
import { log } from '../_utils/log';
import { isEmptySlot } from '../_utils/vue-utils';

import { tabInjectKey } from './provide';
import { tabPaneProps, TabPaneSlotsT } from './types';

const props = defineProps(tabPaneProps);

const slots = defineSlots<TabPaneSlotsT>();
const runtimeSlots = useSlots();

const tabInjection = inject(tabInjectKey);

const instance = getCurrentInstance();
if (isUndefined(props.value) && isUndefined(props.label)) {
  log.warn('OTabPane is missing prop: value or label');
}
const paneKey = computed(() => {
  return props.value ?? props.label ?? instance?.uid ?? Math.random();
});

const navRef = ref<HTMLDivElement>();
const registerSelf = () => {
  tabInjection?.registerChild({
    props,
    paneKey,
    navRenderer: isEmptySlot(runtimeSlots.nav) ? undefined : () => runtimeSlots.nav?.(),
  });
};
registerSelf();
useMutationObserver(
  navRef,
  () => {
    if (!navRef.value) {
      return;
    }
    registerSelf();
  },
  {
    attributes: true,
    childList: true,
    subtree: true,
  },
);

const isActive = computed(() => paneKey.value === tabInjection?.activeValue?.value);
const hasActived = ref(isActive.value);
const toMount = computed(() => {
  if (isActive.value) {
    return true;
  }
  if ((props.lazy || tabInjection?.lazy) && !hasActived.value) {
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
    }
  },
);
onMounted(() => {
  tabInjection?.handleChildMounted(paneKey.value);
});
</script>
<template>
  <ClientOnly>
    <teleport to="body">
      <div ref="navRef" style="display: none">
        <!-- 做监听插槽渲染使用，不然无法监听到插槽渲染的变化 -->
        <slot name="nav"></slot>
      </div>
    </teleport>
  </ClientOnly>
  <transition :name="props.transition">
    <div
      v-if="toMount"
      v-show="isActive"
      :class="[
        'o-tab-pane',
        {
          'o-tab-pane-active': isActive,
          'o-tab-pane-disabled': props.disabled,
          'o-tab-pane-closable': props.closable,
        },
      ]"
      :data-tab-pane-key="paneKey"
      v-bind="$attrs"
    >
      <slot></slot>
    </div>
  </transition>
</template>

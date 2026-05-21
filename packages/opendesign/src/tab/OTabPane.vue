<script setup lang="ts">
import { computed, getCurrentInstance, inject, ref, useSlots, watch } from 'vue';

import { isUndefined } from '../_utils/is';
import { log } from '../_utils/log';
import { isEmptySlot } from '../_utils/vue-utils';

import { tabInjectKey } from './provide';
import { tabPaneProps, TabPaneSlotsT } from './types';

const props = defineProps(tabPaneProps);

const slots = defineSlots<TabPaneSlotsT>();
const runtimeSlots = useSlots();

const tabInjection = inject(tabInjectKey);

const instance = getCurrentInstance()!;
if (isUndefined(props.value) && isUndefined(props.label)) {
  log.warn('OTabPane is missing prop: value or label');
}
const paneKey = computed(() => {
  return props.value ?? props.label ?? instance?.uid ?? Math.random();
});

const registerSelf = () => {
  tabInjection?.addChild({
    uid: instance.uid,
    getVNode: () => instance?.vnode!,
    props,
    paneKey,
    navRenderer: isEmptySlot(runtimeSlots.nav) ? undefined : () => runtimeSlots.nav?.(),
  });
};
registerSelf();

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
</script>
<template>
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
    >
      <slot></slot>
    </div>
  </transition>
</template>

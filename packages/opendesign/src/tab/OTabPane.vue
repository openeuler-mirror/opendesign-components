<script setup lang="ts">
import { computed, getCurrentInstance, inject, ref, useId, useSlots, watch } from 'vue';

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

/** 内部自动生成的页签面板 DOM id（SSR 友好），用户未传 id prop 时兜底 */
const autoId = useId();

/**
 * @description 页签面板 DOM id，供对应 nav 的 aria-controls 引用（SSR 友好）；nav 的 DOM id 为 `${paneId}-nav`，供 pane 的 aria-labelledby 引用
 * 用户传入 id prop 时优先采用，保证 pane / nav / aria 双向关联三侧同源；声明为 prop 后 id 脱离 fallthrough 链，模板绑定成为唯一出口
 */
const paneId = computed(() => props.id ?? autoId);

const registerSelf = () => {
  tabInjection?.addChild({
    uid: instance.uid,
    getVNode: () => instance?.vnode!,
    props,
    paneKey,
    paneId,
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
      :id="paneId"
      role="tabpanel"
      :aria-labelledby="`${paneId}-nav`"
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

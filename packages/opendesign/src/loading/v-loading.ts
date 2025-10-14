import { ObjectDirective, h, isReactive, render, watch, type WatchHandle, type VNode } from 'vue';
import OLoading from './OLoading.vue';
import { isObject } from '../_utils/is';

import { LoadingPropsT } from './types';

// 全局配置
let globalLoadingOptions = {};

const setVLoadingOption = (option: Partial<LoadingPropsT>) => {
  globalLoadingOptions = option;
};

const WATCH_HANDLE = Symbol('watch-handle');
const VNODE = Symbol('vnode');
type ModifiersT<K extends string> = { [P in K]?: boolean };
type ModifiersKeys = 'body' | 'nomask';
type BindingValueT = boolean | Partial<LoadingPropsT>;
type HoistElement = HTMLElement & { [WATCH_HANDLE]?: WatchHandle; [VNODE]?: VNode };

const renderLoading = (el: HoistElement, value: BindingValueT, modifiers: ModifiersT<ModifiersKeys>, shouldWatch: boolean) => {
  const selfOption: Partial<LoadingPropsT> = {};
  if (isObject(value)) {
    Object.assign(selfOption, value);
    selfOption.wrapper = value.wrapper ?? null;
    if (shouldWatch) {
      el[WATCH_HANDLE]?.();
      el[WATCH_HANDLE] = void 0;
      if (isReactive(value)) {
        el[WATCH_HANDLE] = watch(value, (newValue) => {
          // value 内部属性更改时不会触发 vLoading 的 updated hook，因此需要主动监听 value 的变化
          renderLoading(el, newValue, modifiers, false);
        });
      }
    }
  } else {
    // 当 binding.value 为 boolean 类型时，修饰符才有效
    selfOption.visible = value;
    selfOption.wrapper = modifiers.body ? 'body' : null;
    selfOption.mask = !modifiers.nomask;
  }
  const vnode = h(OLoading, Object.assign({}, globalLoadingOptions, selfOption));
  el[VNODE] = vnode;
  render(vnode, el);
};

const vLoading: ObjectDirective<HoistElement, BindingValueT> = {
  mounted(el, binding) {
    renderLoading(el, binding.value, binding.modifiers, true);
  },
  updated(el, binding) {
    // updated hook 会在 el 自身更新时触发，即使 binding.value 没有变化
    if (binding.value === binding.oldValue) return;
    if (isObject(binding.value)) {
      renderLoading(el, binding.value, binding.modifiers, true);
    } else {
      el[VNODE]?.component?.exposed?.toggle(Boolean(binding.value));
    }
  },
  beforeUnmount(el) {
    el[WATCH_HANDLE]?.();
    // 卸载 OLoading
    render(null, el);
    el[VNODE] = void 0;
    el[WATCH_HANDLE] = void 0;
  },
};

export { vLoading, setVLoadingOption };

import { ObjectDirective, h, render } from 'vue';
import OLoading from './OLoading.vue';
import { isObject } from '../_utils/is';

import { LoadingPropsT } from './types';

let vLoadingOption = {};

const setVLoadingOption = (option: Partial<LoadingPropsT>) => {
  vLoadingOption = option;
};

type ModifiersT<K extends string> = { [P in K]?: boolean };
type ModifiersKeys = 'body' | 'nomask';
type BindingValueT = boolean | Partial<LoadingPropsT>;

const createLoadingVNode = (props: BindingValueT, modifiers: ModifiersT<ModifiersKeys>) => {
  const selfOption: Partial<LoadingPropsT> = {};
  if (isObject(props)) {
    Object.assign(selfOption, props);
    selfOption.visible = props.visible ?? true;
    selfOption.wrapper = modifiers.body ? 'body' : props.wrapper || null;
    selfOption.mask = modifiers.nomask ? false : props.mask;
  } else {
    selfOption.visible = props;
    selfOption.wrapper = modifiers.body ? 'body' : null;
    selfOption.mask = !modifiers.nomask;
  }
  const loadingProps = Object.assign({}, vLoadingOption, selfOption);
  return h(OLoading, loadingProps);
};

const vLoading: ObjectDirective<HTMLElement, BindingValueT> = {
  mounted(el, binding) {
    render(createLoadingVNode(binding.value, binding.modifiers), el);
  },
  updated(el, binding) {
    if (binding.value === binding.oldValue) return;
    render(createLoadingVNode(binding.value, binding.modifiers), el);
  },
};

export { vLoading, setVLoadingOption };

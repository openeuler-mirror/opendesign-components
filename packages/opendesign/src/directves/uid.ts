import { ObjectDirective } from 'vue';
import { uniqueId } from '../_utils/helper';
import { isFunction } from '../_utils/is';

const getUId = uniqueId;

const vUid: ObjectDirective = {
  created(el: HTMLElement, binding) {
    const setIdFn = binding.value;
    if (isFunction(setIdFn)) {
      setIdFn(el);
    } else {
      el.setAttribute('id', el.id || uniqueId());
    }
  },
};

export { vUid, getUId };

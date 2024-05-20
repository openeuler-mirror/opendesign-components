import { ObjectDirective } from 'vue';
import { uniqueId } from '../_utils/helper';
import { isFunction, isNumber, isString } from '../_utils/is';

const getUId = uniqueId;
/**
 * 为元素生成id，如果元素已设置id，则使用已有id（解决ssr时会导致Hydration attribute mismatch）
 * 1. 默认会直接生成随机id
 * 2. 支持传递函数，自定义处理
 */
const vUid: ObjectDirective = {
  created(el: HTMLElement, binding) {
    const value = binding.value;
    if (isFunction(value)) {
      value(el, el.id || uniqueId());
    } else if (isString(value) || isNumber(value)) {
      el.setAttribute('id', String(value));
    } else if (!el.id) {
      el.setAttribute('id', uniqueId());
    }
  },
};

export { vUid, getUId };

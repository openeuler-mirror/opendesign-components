import { watchEffect } from 'vue';
import { defaultZIndex } from './global';

let topZIndex = 100;

watchEffect(() => {
  topZIndex = defaultZIndex.value;
});

export function getZIndex() {
  return topZIndex;
}

export function createTopZIndex() {
  topZIndex += 1;
  return topZIndex;
}
/**
 * 减少顶层值
 * @param current 当前zindex值，如果传入，则只有当topZIndex与current相等时，才减1
 */
export function removeZIndex(current?: number) {
  if (current === undefined || current === topZIndex) {
    topZIndex -= 1;
  }
  return topZIndex;
}

import { watchEffect } from 'vue';
import { defaultZIndex } from './global';

let topZIndex = 100;

/**
 * @description 当 defaultZIndex 变更时同步 topZIndex，但仅取较大值，防止回退导致已分配的 z-index 被复用
 */
watchEffect(() => {
  topZIndex = Math.max(topZIndex, defaultZIndex.value);
});

export function getZIndex() {
  return topZIndex;
}

export function createTopZIndex() {
  topZIndex += 1;
  return topZIndex;
}

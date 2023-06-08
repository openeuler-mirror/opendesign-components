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

export function minusZIndex() {
  topZIndex -= 1;
  return topZIndex;
}

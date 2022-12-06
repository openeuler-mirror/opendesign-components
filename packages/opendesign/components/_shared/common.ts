import { ref } from 'vue';

export enum SizeT {
  LARGE = 'large',
  NORMAL = 'normal',
  SMALL = 'small'
}

export const defaultSize = ref(SizeT.NORMAL);

export function initSize(type: SizeT) {
  defaultSize.value = type;
}
import { isNull, isUndefined } from '../_shared/is';
import { TextareaResizeT } from './types';

export function toInputString(val: unknown): string {
  if (isUndefined(val) || isNull(val) || (typeof val === 'number' && isNaN(val as number))) {
    return '';
  }
  return String(val);
}

export function getResizeValue(resize: TextareaResizeT) {
  if (resize === 'h') {
    return 'horizontal';
  } else if (resize === 'v') {
    return 'vertical';
  }
  return resize;
}

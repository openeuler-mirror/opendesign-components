import { isNull, isUndefined } from '../_utils/is';

export function toInputString(val: unknown): string {
  if (isUndefined(val) || isNull(val) || (typeof val === 'number' && isNaN(val as number))) {
    return '';
  }
  return String(val);
}

export function getFlexValue(val?: 'top' | 'center' | 'bottom' | 'left' | 'center' | 'right'): string {
  if (!val) {
    return '';
  }
  if (['top', 'left'].includes(val)) {
    return 'flex-start';
  } else if (['bottom', 'right'].includes(val)) {
    return 'flex-end';
  } else if ('center' === val) {
    return 'center';
  }
  return '';
}

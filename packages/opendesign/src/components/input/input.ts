import { isNull, isUndefined } from '../_shared/is';

export function toInputString(val: unknown): string {
  if (isUndefined(val) || isNull(val) || (typeof val === 'number' && isNaN(val as number))) {
    return '';
  }
  return String(val);
}

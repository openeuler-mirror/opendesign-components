import { isNull, isUndefined, isNumber } from '../_shared/is';

export function toInputString(val: unknown): string {
  if (isUndefined(val) || isNull(val) || (isNumber(val as number) && isNaN(val as number))) {
    return '';
  }
  return String(val);
}
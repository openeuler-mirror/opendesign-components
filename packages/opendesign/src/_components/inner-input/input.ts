import { isNull, isUndefined } from '../../_utils/is';

export function toInputString(val: unknown): string {
  if (isUndefined(val) || isNull(val) || (typeof val === 'number' && isNaN(val as number))) {
    return '';
  }
  return String(val);
}

import { isNumber } from '../_shared/is';

export function isValidNumber(val: string | number | undefined, min?: number, max?: number) {
  if (isNumber(val) || !val || isNumber(Number(val))) {
    const v = Number(val);
    if (min && v < min) {
      return false;
    }
    if (max && v > max) {
      return false;
    }

    return true;
  }
  return false;
}

export function getInputValueString(val: string | number | undefined, min?: number, max?: number) {
  let rlt: number | string = '';
  if (isValidNumber(val)) {
    rlt = Number(val);
    if (min !== undefined) {
      rlt = rlt < min ? min : rlt;
    }
    if (max !== undefined) {
      rlt = rlt > max ? max : rlt;
    }
  }
  return rlt;
}

export function getRealValue(val: string | number) {
  return isValidNumber(val) ? Number(val) : 0;
}
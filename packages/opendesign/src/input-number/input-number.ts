import { isFunction, isNumber, isUndefined } from '../_utils/is';

export function string2number(value: string): number {
  return value === '' ? NaN : Number(value);
}
export function number2string(value?: number): string {
  return Number.isNaN(value) || isUndefined(value) ? '' : String(value);
}
export function isValidNumber(val?: number, min?: number, max?: number, parse?: (value: string) => string) {
  if (Number.isNaN(val)) {
    return false;
  }
  const value = isFunction(parse) ? parse(String(val)) : val;
  if (isNumber(Number(value))) {
    const v = Number(value);
    if (!isUndefined(min) && v < min) {
      return false;
    }
    if (!isUndefined(max) && v > max) {
      return false;
    }

    return true;
  }
  return false;
}

export function getRealValue(val: number, min?: number, max?: number) {
  let rlt: number = NaN;
  if (isValidNumber(val, min, max)) {
    rlt = val;
    if (min !== undefined) {
      rlt = rlt < min ? min : rlt;
    }
    if (max !== undefined) {
      rlt = rlt > max ? max : rlt;
    }
  }
  return rlt;
}

export function correctValue(val: number, lastVal: number, min?: number, max?: number) {
  if (isNumber(val)) {
    if (!isUndefined(max) && val > max) {
      return max;
    }
    if (!isUndefined(min) && val < min) {
      return min;
    }
    return val;
  }
  return lastVal;
}

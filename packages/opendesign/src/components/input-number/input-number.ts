import { isFunction, isNumber, isUndefined } from '../_utils/is';

export function isValidNumber(val?: string | number, min?: number, max?: number, parse?: (value: string) => string) {
  if (Number.isNaN(val)) {
    return true;
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

export function getRealValue(val?: string | number, min?: number, max?: number, parse?: (value: string) => string) {
  const value = isFunction(parse) ? parse(String(val)) : val;

  let rlt: number = NaN;
  if (value !== '' && isValidNumber(value, min, max)) {
    rlt = Number(value);
    if (min !== undefined) {
      rlt = rlt < min ? min : rlt;
    }
    if (max !== undefined) {
      rlt = rlt > max ? max : rlt;
    }
  }
  return rlt;
}

export function correctValue(val: string | number, lastVal: number, min?: number, max?: number) {
  const v = Number(val);
  if (isNumber(v)) {
    if (!isUndefined(max) && v > max) {
      return max;
    }
    if (!isUndefined(min) && v < min) {
      return min;
    }
    return v;
  }
  return lastVal;
}

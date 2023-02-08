import { isNumber } from '../_shared/is';

export function isNumberString(val: string | number | undefined) {
  if (isNumber(val) || !val || isNumber(Number(val))) {
    return true;
  }
  return false;
}

export function getInputValueString(val: string | number | undefined) {
  return isNumberString(val) ? Number(val) : '';
}

export function getRealValue(val: string | number) {
  return isNumberString(val) ? Number(val) : 0;
}
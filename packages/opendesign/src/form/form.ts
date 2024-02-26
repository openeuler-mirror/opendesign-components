import { isArray, isEmptyArray, isEmptyObject, isFunction, isNull, isUndefined } from '../_utils/is';
import { RequiredRuleT, RulesT, TypeRuleT, ValidatorRuleT } from './types';

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

export function normalizeRules(rules?: RulesT[], required?: boolean): Array<ValidatorRuleT> {
  const _rules = rules || [];
  if (required && (_rules.length == 0 || _rules.some((item) => !(item as RequiredRuleT).required))) {
    _rules.unshift({
      required: true,
      message: 'required',
    });
  }
  return _rules.map((item) => {
    const triggers = isArray(item.triggers) ? item.triggers : [item.triggers ?? 'change'];
    if ((item as RequiredRuleT).required) {
      return {
        triggers,
        validator: (value: any) => ({
          type: !isNull(value) && !isUndefined(value) && value !== '' && !isEmptyArray(value) && !isEmptyObject(value) ? 'success' : 'danger',
          message: (item as RequiredRuleT).message,
        }),
      };
    } else if ((item as TypeRuleT).type) {
      return {
        triggers,
        validator: (value: any) => ({
          type: typeof value === (item as TypeRuleT).type ? 'success' : 'danger',
          message: (item as TypeRuleT).message,
        }),
      };
    } else if (isFunction((item as ValidatorRuleT).validator)) {
      return {
        triggers,
        validator: (item as ValidatorRuleT).validator,
      };
    } else {
      return {};
    }
  });
}

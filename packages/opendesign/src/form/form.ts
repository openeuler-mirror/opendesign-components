import { isArray, isEmptyArray, isEmptyObject, isFunction, isNull, isUndefined } from '../_utils/is';
import { FormRulesT, RequiredRuleT, RulesT, TypeRuleT, ValidatorRuleT, TriggerRulesT, TriggerT, ValidatorT } from './types';

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

const defaultCheckRequired = (value: any) => {
  return !isNull(value) && !isUndefined(value) && value !== '' && !isEmptyArray(value) && !isEmptyObject(value) ? 'success' : 'danger';
};
const defaultCheckType = (value: any, type: string) => {
  return typeof value === type ? 'success' : 'danger';
};

export function groupRules(rules?: RulesT[], required?: boolean): TriggerRulesT {
  const tRules: TriggerRulesT = {};

  let hasRequired = false;
  if (isArray(rules)) {
    rules.forEach((item) => {
      const triggers: TriggerT[] = item.triggers ? ([] as TriggerT[]).concat(item.triggers) : ['change'];
      triggers.forEach((trigger) => {
        const tr: ValidatorT[] = tRules[trigger] || [];

        if ((item as TypeRuleT).type) {
          tr.push((value: any) => ({
            type: defaultCheckType(value, (item as TypeRuleT).type),
            message: (item as TypeRuleT).message,
          }));
        } else if ((item as RequiredRuleT).required) {
          hasRequired = true;
          tr.push((value: any) => ({
            type: defaultCheckRequired(value),
            message: (item as RequiredRuleT).message,
          }));
        } else {
          const fFn = (item as ValidatorRuleT).validator;
          if (fFn && isFunction(fFn)) {
            tr.push(fFn);
          }
        }
        tRules[trigger] = tr;
      });
    });
  }

  if (!hasRequired && required) {
    tRules.change = tRules.change || [];
    tRules.change.push((value: any) => ({
      type: defaultCheckRequired(value),
      message: 'required!',
    }));
  }

  return tRules;
}

export function mergeRules(globalRules: FormRulesT | undefined, field: string | undefined, localRules: RulesT[] | undefined): RulesT[] | undefined {
  if (!field) return localRules;
  const global = globalRules?.[field];
  if (!global && !localRules) return undefined;
  // 将全局规则统一为数组形式
  let globalArr: RulesT[];
  if (isArray(global)) {
    globalArr = global;
  } else if (global) {
    globalArr = [global];
  } else {
    globalArr = [];
  }
  return [...globalArr, ...(localRules || [])];
}

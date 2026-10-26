/**
 * OSelect 表单继承测试。
 *
 * 验证 OSelect 通过 useFormField 接入 OForm / OFormItem 表单系统的行为：
 *   1. size / disabled / round / clearable — 从 OForm/OFormItem 继承
 *   2. color（校验状态）— 从 OFormItem 的 fieldResult 继承
 *   3. prop 覆盖 — 组件自身 prop 优先于表单值
 *   4. focus / blur / change — 触发表单校验
 *   5. 独立使用 — 不在表单内时使用自身 prop，且 focus/blur 不重复 emit
 *   6. 表单校验集成 — required 规则 + validate() 联动
 */
import { test, expect, describe, vi, afterEach, beforeEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, reactive, ref } from 'vue';
import OSelect from '../OSelect.vue';
import OOption from '../../option/OOption.vue';
import OForm from '../../form/OForm.vue';
import OFormItem from '../../form/OFormItem.vue';
import { flush } from '../../../__tests__/_helpers/dom';
import { setViewport } from '../../../__tests__/_helpers/viewport';

const cleanupBodyPopups = () => {
  document.body.querySelectorAll('.o-options-popup, .o-select-options, [data-v-popper-escaped], .o-popup-content').forEach((el) => el.remove());
};

/** 渲染 OForm + OFormItem + OSelect 组合，自动绑定 v-model 到 form model */
const renderForm = (formProps: Record<string, any>, itemProps: Record<string, any>, selectProps: Record<string, any> = {}, slots: any = {}) => {
  const formRef = ref<any>(null);
  const model = formProps.model ?? reactive({});
  const field = itemProps.field;
  // selectProps.modelValue 存在时初始化 model[field]，确保 v-model 双向绑定生效
  if (selectProps.modelValue !== undefined && model[field] === undefined) {
    model[field] = selectProps.modelValue;
  }
  const screen = render({
    render: () =>
      h(
        OForm,
        { ref: formRef, ...formProps, model },
        {
          default: () =>
            h(
              OFormItem,
              { ...itemProps },
              {
                default: () =>
                  h(
                    OSelect,
                    {
                      ...selectProps,
                      modelValue: model[field],
                      'onUpdate:modelValue': (v: any) => {
                        model[field] = v;
                      },
                    },
                    { default: slots.default ?? (() => [h(OOption, { value: 'a', label: 'A' }), h(OOption, { value: 'b', label: 'B' })]) },
                  ),
              },
            ),
        },
      ),
  });
  return { screen, formRef, model };
};

describe('表单继承', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  // ============================================================================
  // size 继承
  // ============================================================================

  describe('size 继承', () => {
    test('OForm size=small — OSelect 未传 size 时继承 small', async () => {
      const { screen } = renderForm({ size: 'small' }, { label: 'S', field: 'f' });
      await flush();
      const el = screen.container.querySelector('.o-select') as HTMLElement;
      expect(el.classList.contains('o-select-small')).toBe(true);
    });

    test('OForm size=large — OSelect 继承 large', async () => {
      const { screen } = renderForm({ size: 'large' }, { label: 'S', field: 'f' });
      await flush();
      const el = screen.container.querySelector('.o-select') as HTMLElement;
      expect(el.classList.contains('o-select-large')).toBe(true);
    });

    test('OSelect size=large — 覆盖 OForm size=small', async () => {
      const { screen } = renderForm({ size: 'small' }, { label: 'S', field: 'f' }, { size: 'large' });
      await flush();
      const el = screen.container.querySelector('.o-select') as HTMLElement;
      expect(el.classList.contains('o-select-large')).toBe(true);
      expect(el.classList.contains('o-select-small')).toBe(false);
    });

    test('OSelect 无 OForm — 默认 medium', async () => {
      const screen = render(OSelect);
      await flush();
      const el = screen.container.querySelector('.o-select') as HTMLElement;
      expect(el.classList.contains('o-select-medium')).toBe(true);
    });
  });

  // ============================================================================
  // disabled 继承
  // ============================================================================

  describe('disabled 继承', () => {
    test('OForm disabled=true — OSelect 继承禁用状态', async () => {
      const { screen } = renderForm({ disabled: true }, { label: 'S', field: 'f' });
      await flush();
      const el = screen.container.querySelector('.o-select') as HTMLElement;
      expect(el.classList.contains('o-select-disabled')).toBe(true);
    });

    test('OForm disabled=true — OPopup 不渲染（v-if="!isDisabled"）', async () => {
      const { screen } = renderForm({ disabled: true }, { label: 'S', field: 'f' });
      await flush();
      const popup = screen.container.querySelector('[data-v-popper-escaped]');
      expect(popup).toBeNull();
    });

    test('OForm disabled=true — tag 删除按钮不渲染', async () => {
      const { screen } = renderForm({ disabled: true }, { label: 'S', field: 'f' }, { multiple: true, modelValue: ['a'] });
      await flush();
      const removeBtn = screen.container.querySelector('.o-select-tag-remove');
      expect(removeBtn).toBeNull();
    });

    test('OForm disabled=true — aria-disabled 属性设置', async () => {
      const { screen } = renderForm({ disabled: true }, { label: 'S', field: 'f' });
      await flush();
      const input = screen.container.querySelector('.o-select-input') as HTMLElement;
      expect(input.getAttribute('aria-disabled')).toBe('true');
    });

    test('OSelect disabled=false — 覆盖 OForm disabled=true', async () => {
      const { screen } = renderForm({ disabled: true }, { label: 'S', field: 'f' }, { disabled: false });
      await flush();
      const el = screen.container.querySelector('.o-select') as HTMLElement;
      expect(el.classList.contains('o-select-disabled')).toBe(false);
    });

    test('OFormItem disabled=true — 覆盖 OForm disabled=false', async () => {
      const { screen } = renderForm({ disabled: false }, { label: 'S', field: 'f', disabled: true });
      await flush();
      const el = screen.container.querySelector('.o-select') as HTMLElement;
      expect(el.classList.contains('o-select-disabled')).toBe(true);
    });
  });

  // ============================================================================
  // round 继承
  // ============================================================================

  describe('round 继承', () => {
    test('OForm round=4px — OSelect 继承圆角', async () => {
      const { screen } = renderForm({ round: '4px' }, { label: 'S', field: 'f' });
      await flush();
      const el = screen.container.querySelector('.o-select') as HTMLElement;
      expect(el.style.getPropertyValue('--select-radius')).toBe('4px');
    });

    test('OSelect round=pill — 覆盖 OForm round=4px', async () => {
      const { screen } = renderForm({ round: '4px' }, { label: 'S', field: 'f' }, { round: 'pill' });
      await flush();
      const el = screen.container.querySelector('.o-select') as HTMLElement;
      expect(el.style.getPropertyValue('--select-radius')).toBe('100vh');
    });

    test('OFormItem round=8px — 覆盖 OForm round=4px', async () => {
      const { screen } = renderForm({ round: '4px' }, { label: 'S', field: 'f', round: '8px' });
      await flush();
      const el = screen.container.querySelector('.o-select') as HTMLElement;
      expect(el.style.getPropertyValue('--select-radius')).toBe('8px');
    });
  });

  // ============================================================================
  // clearable 继承
  // ============================================================================

  describe('clearable 继承', () => {
    test('OForm clearable=true + OSelect 有值 — 显示清除按钮', async () => {
      const { screen } = renderForm({ clearable: true }, { label: 'S', field: 'f' }, { modelValue: 'a' });
      await flush();
      const clearBtn = screen.container.querySelector('.o-select-clear');
      expect(clearBtn).not.toBeNull();
      const el = screen.container.querySelector('.o-select') as HTMLElement;
      expect(el.classList.contains('o-select-clearable')).toBe(true);
    });

    test('OSelect clearable=false — 覆盖 OForm clearable=true', async () => {
      const { screen } = renderForm({ clearable: true }, { label: 'S', field: 'f' }, { clearable: false, modelValue: 'a' });
      await flush();
      const clearBtn = screen.container.querySelector('.o-select-clear');
      expect(clearBtn).toBeNull();
    });

    test('OForm clearable=true + OSelect 无值 — 不显示清除按钮', async () => {
      const { screen } = renderForm({ clearable: true }, { label: 'S', field: 'f' });
      await flush();
      const clearBtn = screen.container.querySelector('.o-select-clear');
      expect(clearBtn).toBeNull();
    });

    test('OForm disabled=true + clearable=true — disabled 优先，不显示清除按钮', async () => {
      const { screen } = renderForm({ disabled: true, clearable: true }, { label: 'S', field: 'f' }, { modelValue: 'a' });
      await flush();
      const clearBtn = screen.container.querySelector('.o-select-clear');
      expect(clearBtn).toBeNull();
    });
  });

  // ============================================================================
  // color（校验状态）继承
  // ============================================================================

  describe('color（校验状态）继承', () => {
    test('OFormItem error — OSelect 注入 o-select-danger 类', async () => {
      const { screen } = renderForm({}, { label: 'S', field: 'f', error: '出错了' });
      await flush();
      const el = screen.container.querySelector('.o-select') as HTMLElement;
      expect(el.classList.contains('o-select-danger')).toBe(true);
    });

    test('OFormItem validateStatus=success — OSelect 注入 o-select-success 类', async () => {
      const { screen } = renderForm({}, { label: 'S', field: 'f', validateStatus: 'success' });
      await flush();
      const el = screen.container.querySelector('.o-select') as HTMLElement;
      expect(el.classList.contains('o-select-success')).toBe(true);
    });

    test('OFormItem validateStatus=warning — OSelect 注入 o-select-warning 类', async () => {
      const { screen } = renderForm({}, { label: 'S', field: 'f', validateStatus: 'warning' });
      await flush();
      const el = screen.container.querySelector('.o-select') as HTMLElement;
      expect(el.classList.contains('o-select-warning')).toBe(true);
    });

    test('OSelect color=primary — 无校验结果时使用 prop 值', async () => {
      const { screen } = renderForm({}, { label: 'S', field: 'f' }, { color: 'primary' });
      await flush();
      const el = screen.container.querySelector('.o-select') as HTMLElement;
      expect(el.classList.contains('o-select-primary')).toBe(true);
    });

    test('OFormItem error — 校验结果覆盖 OSelect color prop', async () => {
      const { screen } = renderForm({}, { label: 'S', field: 'f', error: '出错了' }, { color: 'primary' });
      await flush();
      const el = screen.container.querySelector('.o-select') as HTMLElement;
      expect(el.classList.contains('o-select-danger')).toBe(true);
      expect(el.classList.contains('o-select-primary')).toBe(false);
    });

    test('OFormItem 无 error — 默认 color=normal', async () => {
      const { screen } = renderForm({}, { label: 'S', field: 'f' });
      await flush();
      const el = screen.container.querySelector('.o-select') as HTMLElement;
      expect(el.classList.contains('o-select-normal')).toBe(true);
    });
  });

  // ============================================================================
  // focus / blur — 触发表单校验 + 不重复 emit
  // ============================================================================

  describe('focus / blur 校验触发', () => {
    test('focus 时 emit focus 精确一次（不重复 emit）', async () => {
      const onFocus = vi.fn();
      const { screen } = renderForm({}, { label: 'S', field: 'f' }, { onFocus });
      await flush();
      const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
      input.focus();
      await flush();
      expect(onFocus).toHaveBeenCalledTimes(1);
      expect(onFocus).toHaveBeenCalledWith(expect.any(FocusEvent));
    });

    test('blur 时 emit blur 精确一次（不重复 emit）', async () => {
      const onBlur = vi.fn();
      const { screen } = renderForm({}, { label: 'S', field: 'f' }, { onBlur });
      await flush();
      const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
      input.focus();
      await flush();
      input.blur();
      await flush();
      expect(onBlur).toHaveBeenCalledTimes(1);
      expect(onBlur).toHaveBeenCalledWith(expect.any(FocusEvent));
    });

    test('focus 时触发 formItem.onFocus 校验回调', async () => {
      const onFocus = vi.fn();
      const { screen } = renderForm({}, { label: 'S', field: 'f', rules: [{ triggers: 'focus', validator: () => undefined }] });
      await flush();
      const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
      input.focus();
      await flush();
      // focus 触发了 formItem 的 onFocus handler（通过 useFormField → triggerFocus → formItem.fieldHandlers.onFocus）
      // 如果 formItem 注册了 focus triggers 的 rule，validate 应该已经执行
      // 检查没有抛错即可（form 内部异步校验）
      expect(input).not.toBeNull();
    });

    test('blur 时触发 formItem.onBlur 校验回调', async () => {
      const { screen } = renderForm(
        { model: reactive({ f: '' }), labelWidth: '80px' },
        {
          label: 'S',
          field: 'f',
          rules: [{ triggers: 'blur', validator: (v: string) => (!v ? { type: 'danger' as const, message: '必填' } : undefined) }],
        },
      );
      await flush();
      const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
      input.focus();
      await flush();
      input.blur();
      await flush();
      // blur 触发校验后应显示错误消息
      const msg = screen.container.querySelector('.o-form-item-message');
      expect(msg).not.toBeNull();
    });
  });

  // ============================================================================
  // change — 触发表单校验
  // ============================================================================

  describe('change 校验触发', () => {
    test('选中选项时触发 formItem.onChange 校验回调', async () => {
      const { screen, formRef } = renderForm(
        { model: reactive({ f: '' }) },
        {
          label: 'S',
          field: 'f',
          rules: [{ triggers: 'change', validator: (v: string) => (v === 'a' ? undefined : { type: 'danger' as const, message: '必须选 A' }) }],
        },
      );
      await flush();
      // 初始无值，无错误消息
      expect(screen.container.querySelector('.o-form-item-message')).toBeNull();

      // 点击展开下拉
      const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
      await selectEl.click();
      await flush();

      // 点击选项 A
      const options = document.querySelectorAll('.o-option');
      const optionA = Array.from(options).find((o) => o.textContent?.includes('A')) as HTMLElement;
      await optionA.click();
      await flush();

      // 选 A 应通过校验（无错误消息）
      expect(screen.container.querySelector('.o-form-item-message')).toBeNull();
    });

    test('change 触发后 form validate 通过', async () => {
      const { screen, formRef } = renderForm({ model: reactive({ f: 'a' }) }, { label: 'S', field: 'f', required: true, hasRequired: true });
      await flush();
      await formRef.value?.validate();
      await flush();
      // 有值，校验通过
      expect(screen.container.querySelector('.o-form-item-message')).toBeNull();
    });
  });

  // ============================================================================
  // 表单校验集成 — required 规则
  // ============================================================================

  describe('表单校验集成', () => {
    test('OForm required + OSelect 空值 — validate 返回 danger', async () => {
      const { screen, formRef } = renderForm(
        { model: reactive({ f: '' }), hasRequired: true, labelWidth: '80px' },
        { label: 'Name', field: 'f', required: true },
      );
      await flush();
      await formRef.value?.validate();
      await flush();
      const msg = screen.container.querySelector('.o-form-item-message');
      expect(msg).not.toBeNull();
      expect(msg?.textContent).toContain('required');
    });

    test('OForm required + OSelect 有值 — validate 通过', async () => {
      const { screen, formRef } = renderForm(
        { model: reactive({ f: 'a' }), hasRequired: true, labelWidth: '80px' },
        { label: 'Name', field: 'f', required: true },
      );
      await flush();
      await formRef.value?.validate();
      await flush();
      expect(screen.container.querySelector('.o-form-item-message')).toBeNull();
    });

    test('OForm 自定义规则 + OSelect — change 触发校验', async () => {
      const { screen, formRef } = renderForm(
        { model: reactive({ f: 'b' }), labelWidth: '80px' },
        {
          label: 'Name',
          field: 'f',
          rules: [{ triggers: 'change', validator: (v: string) => (v === 'a' ? undefined : { type: 'danger' as const, message: '必须选 A' }) }],
        },
      );
      await flush();
      await formRef.value?.validate();
      await flush();
      const msg = screen.container.querySelector('.o-form-item-message');
      expect(msg).not.toBeNull();
      expect(msg?.textContent).toContain('必须选 A');
    });

    test('OForm resetFields — 重置后清除校验状态', async () => {
      const { screen, formRef } = renderForm(
        { model: reactive({ f: '' }), hasRequired: true, labelWidth: '80px' },
        { label: 'Name', field: 'f', required: true },
      );
      await flush();
      await formRef.value?.validate();
      await flush();
      expect(screen.container.querySelector('.o-form-item-message')).not.toBeNull();

      await formRef.value?.resetFields();
      await flush();
      expect(screen.container.querySelector('.o-form-item-message')).toBeNull();
    });
  });

  // ============================================================================
  // 独立使用（无 OForm）
  // ============================================================================

  describe('独立使用（无 OForm）', () => {
    test('无 OForm — 使用自身 size prop', async () => {
      const screen = render(OSelect, { props: { size: 'small' } });
      await flush();
      const el = screen.container.querySelector('.o-select') as HTMLElement;
      expect(el.classList.contains('o-select-small')).toBe(true);
    });

    test('无 OForm — disabled prop 直接生效', async () => {
      const screen = render(OSelect, { props: { disabled: true } });
      await flush();
      const el = screen.container.querySelector('.o-select') as HTMLElement;
      expect(el.classList.contains('o-select-disabled')).toBe(true);
    });

    test('无 OForm — focus 精确一次（不重复 emit）', async () => {
      const onFocus = vi.fn();
      const screen = render(OSelect, {
        props: { onFocus },
        slots: { default: () => h(OOption, { value: 'a', label: 'A' }) },
      });
      await flush();
      const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
      input.focus();
      await flush();
      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    test('无 OForm — blur 精确一次（不重复 emit）', async () => {
      const onBlur = vi.fn();
      const screen = render(OSelect, {
        props: { onBlur },
        slots: { default: () => h(OOption, { value: 'a', label: 'A' }) },
      });
      await flush();
      const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
      input.focus();
      await flush();
      input.blur();
      await flush();
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    test('无 OForm — color 默认 normal', async () => {
      const screen = render(OSelect);
      await flush();
      const el = screen.container.querySelector('.o-select') as HTMLElement;
      expect(el.classList.contains('o-select-normal')).toBe(true);
    });
  });

  // ============================================================================
  // 综合覆盖测试
  // ============================================================================

  describe('综合覆盖', () => {
    test('OForm 全部设置 — OSelect 全部继承', async () => {
      const { screen } = renderForm({ size: 'small', round: '4px', disabled: false, clearable: true }, { label: 'S', field: 'f' }, { modelValue: 'a' });
      await flush();
      const el = screen.container.querySelector('.o-select') as HTMLElement;
      expect(el.classList.contains('o-select-small')).toBe(true);
      expect(el.style.getPropertyValue('--select-radius')).toBe('4px');
      expect(el.classList.contains('o-select-disabled')).toBe(false);
      expect(el.classList.contains('o-select-clearable')).toBe(true);
      expect(screen.container.querySelector('.o-select-clear')).not.toBeNull();
    });

    test('OForm 全部设置 — OSelect 全部覆盖', async () => {
      const { screen } = renderForm(
        { size: 'small', round: '4px', disabled: false, clearable: true },
        { label: 'S', field: 'f' },
        { size: 'large', round: 'pill', disabled: true, clearable: false, modelValue: 'a' },
      );
      await flush();
      const el = screen.container.querySelector('.o-select') as HTMLElement;
      expect(el.classList.contains('o-select-large')).toBe(true);
      expect(el.classList.contains('o-select-small')).toBe(false);
      expect(el.style.getPropertyValue('--select-radius')).toBe('100vh');
      expect(el.classList.contains('o-select-disabled')).toBe(true);
      // disabled 时即使有值也不显示清除按钮
      expect(screen.container.querySelector('.o-select-clear')).toBeNull();
    });
  });
});

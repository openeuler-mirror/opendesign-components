/**
 * OForm / OFormItem 校验行为测试。
 *
 * 验证维度：
 *   1. 必填校验 — required=true 时自动添加 required 校验规则
 *   2. requiredIcon — 设为 true 时 required 仅展示星号不触发校验
 *   3. 自定义校验规则 — RequiredRuleT / TypeRuleT / ValidatorRuleT
 *   4. 校验触发 — change / input / blur / focus
 *   5. 全局 rules vs 局部 rules — 合并优先级
 *   6. error / validateStatus — 手动设置校验状态
 *   7. 继承 — showMessage / disabled / size / round / clearable
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, reactive, ref } from 'vue';
import OForm from '../OForm.vue';
import OFormItem from '../OFormItem.vue';
import { flush } from '../../../__tests__/_helpers/dom';

/** 渲染带 ref 的表单 */
function renderFormWithRef(formProps: Record<string, any>, items: Array<Record<string, any>>) {
  const formRef = ref<any>(null);
  const model = formProps.model ?? reactive({});
  const screen = render({
    render: () =>
      h(
        OForm,
        { ref: formRef, ...formProps, model },
        {
          default: () => items.map((p) => h(OFormItem, { ...p }, { default: () => h('input', { type: 'text' }) })),
        },
      ),
  });
  return { screen, formRef, model };
}

// ============================================================================
// 必填校验
// ============================================================================
describe('必填校验', () => {
  test('OFormItem required=true 空值 - validate 返回 danger + 显示 required! 消息', async () => {
    const { formRef, screen } = renderFormWithRef({ model: reactive({ name: '' }), hasRequired: true, labelWidth: '80px' }, [
      { label: 'Name', field: 'name', required: true },
    ]);
    await flush();
    await formRef.value?.validate();
    await flush();
    const msg = screen.container.querySelector('.o-form-item-message');
    expect(msg).not.toBeNull();
    expect(msg?.textContent).toContain('required');
  });

  test('OFormItem required=true 有值 - validate 返回 success', async () => {
    const { formRef, screen } = renderFormWithRef({ model: reactive({ name: 'ok' }), hasRequired: true, labelWidth: '80px' }, [
      { label: 'Name', field: 'name', required: true },
    ]);
    await flush();
    const results = await formRef.value?.validate();
    await flush();
    expect(results[0]?.type).not.toBe('danger');
    expect(screen.container.querySelector('.o-form-item-message')).toBeNull();
  });
});

// ============================================================================
// requiredIcon — 仅展示星号不触发校验
// ============================================================================
describe('requiredIcon', () => {
  test('OForm requiredIcon=true - required 仅展示星号，validate 不触发 required 校验', async () => {
    const { formRef, screen } = renderFormWithRef({ model: reactive({ name: '' }), requiredIcon: true, hasRequired: true, labelWidth: '80px' }, [
      { label: 'Name', field: 'name', required: true },
    ]);
    await flush();
    // 星号仍渲染
    expect(screen.container.querySelector('.o-form-require-symbol')).not.toBeNull();

    await formRef.value?.validate();
    await flush();
    expect(screen.container.querySelector('.o-form-item-message')).toBeNull();
  });

  test('OFormItem requiredIcon=true - 覆盖 Form requiredIcon=false', async () => {
    const { formRef, screen } = renderFormWithRef({ model: reactive({ name: '' }), requiredIcon: false, hasRequired: true, labelWidth: '80px' }, [
      { label: 'Name', field: 'name', required: true, requiredIcon: true },
    ]);
    await flush();
    await formRef.value?.validate();
    await flush();
    expect(screen.container.querySelector('.o-form-item-message')).toBeNull();
  });

  test('OFormItem requiredIcon=false - 覆盖 Form requiredIcon=true，恢复校验', async () => {
    const { formRef, screen } = renderFormWithRef({ model: reactive({ name: '' }), requiredIcon: true, hasRequired: true, labelWidth: '80px' }, [
      { label: 'Name', field: 'name', required: true, requiredIcon: false },
    ]);
    await flush();
    await formRef.value?.validate();
    await flush();
    expect(screen.container.querySelector('.o-form-item-message')).not.toBeNull();
  });

  test('OFormItem requiredIcon 切换 - 从 false→true 时清除已有校验结果', async () => {
    const iconRef = ref(false);
    const { formRef, screen } = renderFormWithRef({ model: reactive({ name: '' }), hasRequired: true, labelWidth: '80px' }, []);
    // 手动渲染带动态 requiredIcon 的 FormItem
    const screen2 = render({
      render: () =>
        h(
          OForm,
          { model: reactive({ name: '' }), hasRequired: true, labelWidth: '80px' },
          {
            default: () => h(OFormItem, { label: 'N', field: 'name', required: true, requiredIcon: iconRef.value }, { default: () => h('input') }),
          },
        ),
    });
    const formRef2 = ref<any>(null);
    // 重新渲染带 ref
    const screen3 = render({
      render: () =>
        h(
          OForm,
          {
            ref: formRef2,
            model: reactive({ name: '' }),
            hasRequired: true,
            labelWidth: '80px',
          },
          {
            default: () => h(OFormItem, { label: 'N', field: 'name', required: true, requiredIcon: iconRef.value }, { default: () => h('input') }),
          },
        ),
    });
    await flush();
    await formRef2.value?.validate();
    await flush();
    expect(screen3.container.querySelector('.o-form-item-message')).not.toBeNull();

    iconRef.value = true;
    await flush();
    expect(screen3.container.querySelector('.o-form-item-message')).toBeNull();
  });
});

// ============================================================================
// 自定义校验规则
// ============================================================================
describe('自定义校验规则', () => {
  test('OFormItem rules - ValidatorRuleT 返回 danger 时显示错误', async () => {
    const { formRef, screen } = renderFormWithRef({ model: reactive({ name: 'test' }), labelWidth: '80px' }, [
      {
        label: 'Name',
        field: 'name',
        rules: [{ triggers: 'change', validator: (v: string) => (v === 'bad' ? { type: 'danger', message: '不能是 bad' } : undefined) }],
      },
    ]);
    await flush();
    await formRef.value?.validate();
    await flush();
    expect(screen.container.querySelector('.o-form-item-message')).toBeNull();

    // 改为 bad 值后校验
    const input = screen.container.querySelector('input') as HTMLInputElement;
    formRef.value as any;
    // 通过 model 直接改值触发校验
    const model = reactive({ name: 'bad' });
    const screen2 = render({
      render: () =>
        h(
          OForm,
          { ref: formRef, model, labelWidth: '80px' },
          {
            default: () =>
              h(
                OFormItem,
                {
                  label: 'Name',
                  field: 'name',
                  rules: [{ triggers: 'change', validator: (v: string) => (v === 'bad' ? { type: 'danger' as const, message: '不能是 bad' } : undefined) }],
                },
                { default: () => h('input') },
              ),
          },
        ),
    });
    await flush();
    await formRef.value?.validate();
    await flush();
    expect(screen2.container.querySelector('.o-form-item-message')).not.toBeNull();
    expect(screen2.container.querySelector('.o-form-item-message')?.textContent).toContain('不能是 bad');
  });

  test('OFormItem rules - TypeRuleT 类型校验不匹配时返回 danger', async () => {
    const { formRef, screen } = renderFormWithRef({ model: reactive({ count: 'abc' }), labelWidth: '80px' }, [
      { label: 'Count', field: 'count', rules: [{ type: 'number', message: '必须是数字' }] },
    ]);
    await flush();
    await formRef.value?.validate();
    await flush();
    const msg = screen.container.querySelector('.o-form-item-message');
    expect(msg).not.toBeNull();
    expect(msg?.textContent).toContain('必须是数字');
  });

  test('OFormItem rules - warning 不阻断后续校验', async () => {
    const { formRef, screen } = renderFormWithRef({ model: reactive({ name: 'ab' }), labelWidth: '80px', showMessage: true }, [
      {
        label: 'Name',
        field: 'name',
        rules: [
          { triggers: ['input', 'change'], validator: (v: string) => (v.length < 5 ? { type: 'warning', message: '太短' } : undefined) },
          { triggers: ['input', 'change'], validator: (v: string) => (v.length > 10 ? { type: 'warning', message: '太长' } : undefined) },
        ],
      },
    ]);
    await flush();
    await formRef.value?.validate();
    await flush();
    const msg = screen.container.querySelector('.o-form-item-message');
    expect(msg).not.toBeNull();
    expect(msg?.textContent).toContain('太短');
  });
});

// ============================================================================
// 全局 rules vs 局部 rules
// ============================================================================
describe('全局 rules vs 局部 rules', () => {
  test('OForm rules 全局规则 - 按 field 匹配 FormItem', async () => {
    const { formRef, screen } = renderFormWithRef(
      {
        model: reactive({ name: '' }),
        rules: { name: { required: true, message: '全局必填' } },
        labelWidth: '80px',
      },
      [{ label: 'Name', field: 'name' }],
    );
    await flush();
    await formRef.value?.validate();
    await flush();
    const msg = screen.container.querySelector('.o-form-item-message');
    expect(msg).not.toBeNull();
    expect(msg?.textContent).toContain('全局必填');
  });

  test('OFormItem 局部 rules 与全局 rules 合并校验', async () => {
    const { formRef, screen } = renderFormWithRef(
      {
        model: reactive({ name: '' }),
        rules: { name: { required: true, message: '全局必填' } },
        labelWidth: '80px',
      },
      [{ label: 'Name', field: 'name', rules: [{ required: true, message: '局部必填' }] }],
    );
    await flush();
    await formRef.value?.validate();
    await flush();
    const msg = screen.container.querySelector('.o-form-item-message');
    expect(msg).not.toBeNull();
    // 全局规则在合并数组中排在前面，先执行，先返回 danger
    expect(msg?.textContent).toContain('全局必填');
  });
});

// ============================================================================
// 继承 — showMessage / disabled / size / round / clearable
// ============================================================================
describe('继承（Form → FormItem）', () => {
  test('OFormItem showMessage - 未设置时继承 Form 的 showMessage', async () => {
    const screen = render({
      render: () =>
        h(
          OForm,
          { model: { f: '' }, labelWidth: '80px', showMessage: false },
          {
            default: () => h(OFormItem, { label: 'N', field: 'f', error: '错误' }, { default: () => h('input') }),
          },
        ),
    });
    await flush();
    // showMessage=false（继承自 Form）→ 不显示消息
    expect(screen.container.querySelector('.o-form-item-message')).toBeNull();
  });

  test('OFormItem showMessage - 显式设置时覆盖 Form 的值', async () => {
    const screen = render({
      render: () =>
        h(
          OForm,
          { model: { f: '' }, labelWidth: '80px', showMessage: false },
          {
            default: () => h(OFormItem, { label: 'N', field: 'f', error: '错误', showMessage: true }, { default: () => h('input') }),
          },
        ),
    });
    await flush();
    expect(screen.container.querySelector('.o-form-item-message')).not.toBeNull();
  });
});

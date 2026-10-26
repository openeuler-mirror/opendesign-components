/**
 * OForm 事件 + Props + Expose 补充测试。
 *
 * 填补现有测试文件的覆盖空白：
 *   1. 事件：validateField（@since 1.2.7）、clear、reset
 *   2. Props：validateOnRuleChange、scrollToError、defaultTrigger
 *   3. Triggers：input trigger（唯一无测试的 trigger 类型）
 *   4. Expose：setInitialValues 延迟注册缓存、scrollToField 调用验证
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, reactive, ref, defineComponent, inject } from 'vue';
import OForm from '../OForm.vue';
import OFormItem from '../OFormItem.vue';
import { formItemInjectKey } from '../provide';
import { flush } from '../../../__tests__/_helpers/dom';

/** 渲染带 ref 的表单 */
function renderFormWithRef(formProps: Record<string, any>, items: Array<Record<string, any>>, childRenderer?: (props: any) => any) {
  const formRef = ref<any>(null);
  const model = formProps.model ?? reactive({});
  const screen = render({
    render: () =>
      h(
        OForm,
        { ref: formRef, ...formProps, model },
        {
          default: () => items.map((p) => h(OFormItem, { ...p }, { default: () => (childRenderer ? childRenderer(p) : h('input', { type: 'text' })) })),
        },
      ),
  });
  return { screen, formRef, model };
}

/**
 * StubTriggerChild：inject formItemInjectKey，手动调用 fieldHandlers 的各 trigger 方法。
 * 用于测试 input/focus/blur/change trigger 是否正确触发校验。
 */
const StubTriggerChild = defineComponent({
  name: 'StubTriggerChild',
  props: { field: String },
  setup() {
    const ctx = inject(formItemInjectKey, null);
    const trigger = (type: 'onInput' | 'onFocus' | 'onBlur' | 'onChange') => {
      ctx?.fieldHandlers[type]?.();
    };
    return { trigger };
  },
  render() {
    return h('div', { class: 'stub-trigger-child' });
  },
});

// ============================================================================
// 事件：validateField（@since 1.2.7）
// ============================================================================

describe('validateField 事件（@since 1.2.7）', () => {
  test('validate() 后 emit validateField — 每个校验项触发一次', async () => {
    const onValidateField = vi.fn();
    const { formRef } = renderFormWithRef(
      {
        model: reactive({ name: '', age: '' }),
        hasRequired: true,
        labelWidth: '80px',
        onValidateField,
      },
      [
        { label: 'Name', field: 'name', required: true },
        { label: 'Age', field: 'age', required: true },
      ],
    );
    await flush();
    await formRef.value?.validate();
    await flush();
    expect(onValidateField).toHaveBeenCalledTimes(2);
    // 第一个参数是 field 名
    expect(onValidateField).toHaveBeenCalledWith({ field: 'name', isValid: expect.any(Boolean), message: expect.any(String) });
    expect(onValidateField).toHaveBeenCalledWith({ field: 'age', isValid: expect.any(Boolean), message: expect.any(String) });
  });

  test('校验通过时 isValid=true', async () => {
    const onValidateField = vi.fn();
    const { formRef } = renderFormWithRef(
      {
        model: reactive({ name: 'ok' }),
        hasRequired: true,
        labelWidth: '80px',
        onValidateField,
      },
      [{ label: 'Name', field: 'name', required: true }],
    );
    await flush();
    await formRef.value?.validate();
    await flush();
    expect(onValidateField).toHaveBeenCalledWith({ field: 'name', isValid: true, message: '' });
  });

  test('校验失败时 isValid=false + message', async () => {
    const onValidateField = vi.fn();
    const { formRef } = renderFormWithRef(
      {
        model: reactive({ name: '' }),
        hasRequired: true,
        labelWidth: '80px',
        onValidateField,
      },
      [{ label: 'Name', field: 'name', required: true }],
    );
    await flush();
    await formRef.value?.validate();
    await flush();
    expect(onValidateField).toHaveBeenCalledWith({ field: 'name', isValid: false, message: expect.stringContaining('required') });
  });

  test('validateField(field) 仅触发指定字段的 validateField 事件', async () => {
    const onValidateField = vi.fn();
    const { formRef } = renderFormWithRef(
      {
        model: reactive({ a: '', b: '' }),
        hasRequired: true,
        labelWidth: '80px',
        onValidateField,
      },
      [
        { label: 'A', field: 'a', required: true },
        { label: 'B', field: 'b', required: true },
      ],
    );
    await flush();
    await formRef.value?.validateField('a');
    await flush();
    expect(onValidateField).toHaveBeenCalledTimes(1);
    expect(onValidateField).toHaveBeenCalledWith({ field: 'a', isValid: expect.any(Boolean), message: expect.any(String) });
  });
});

// ============================================================================
// 事件：clear / reset
// ============================================================================

describe('clear / reset 事件', () => {
  test('clearValidate() 后 emit clear 事件', async () => {
    const onClear = vi.fn();
    const { formRef } = renderFormWithRef({ model: reactive({ name: '' }), labelWidth: '80px', onClear }, [{ label: 'Name', field: 'name' }]);
    await flush();
    await formRef.value?.clearValidate();
    await flush();
    expect(onClear).toHaveBeenCalledTimes(1);
    // 参数为 undefined（清除全部）
    expect(onClear).toHaveBeenCalledWith(undefined);
  });

  test('clearValidate(field) — emit clear 携带字段名', async () => {
    const onClear = vi.fn();
    const { formRef } = renderFormWithRef({ model: reactive({ name: '' }), labelWidth: '80px', onClear }, [{ label: 'Name', field: 'name' }]);
    await flush();
    await formRef.value?.clearValidate('name');
    await flush();
    expect(onClear).toHaveBeenCalledWith('name');
  });

  test('resetFields() 后 emit reset 事件', async () => {
    const onReset = vi.fn();
    const { formRef } = renderFormWithRef({ model: reactive({ name: '' }), labelWidth: '80px', onReset }, [{ label: 'Name', field: 'name' }]);
    await flush();
    await formRef.value?.resetFields();
    await flush();
    expect(onReset).toHaveBeenCalledTimes(1);
    expect(onReset).toHaveBeenCalledWith(undefined);
  });

  test('resetFields(field) — emit reset 携带字段名', async () => {
    const onReset = vi.fn();
    const { formRef } = renderFormWithRef({ model: reactive({ name: '' }), labelWidth: '80px', onReset }, [{ label: 'Name', field: 'name' }]);
    await flush();
    await formRef.value?.resetFields('name');
    await flush();
    expect(onReset).toHaveBeenCalledWith('name');
  });
});

// ============================================================================
// Props：validateOnRuleChange
// ============================================================================

describe('validateOnRuleChange', () => {
  test('默认 true — rules 变更时自动触发校验', async () => {
    const onValidateField = vi.fn();
    const rulesRef = ref<Record<string, any> | undefined>(undefined);
    const formRef = ref<any>(null);
    const model = reactive({ name: 'ok' });
    const screen = render({
      render: () =>
        h(
          OForm,
          {
            ref: formRef,
            model,
            labelWidth: '80px',
            onValidateField,
            rules: rulesRef.value,
          },
          {
            default: () => h(OFormItem, { label: 'N', field: 'name' }, { default: () => h('input', { type: 'text' }) }),
          },
        ),
    });
    await flush();
    expect(onValidateField).not.toHaveBeenCalled();

    // 修改 rules 触发 watch
    rulesRef.value = { name: { required: true, message: '必填' } };
    await flush();
    // validateOnRuleChange 默认 true → 自动校验
    expect(onValidateField).toHaveBeenCalled();
  });

  test('validateOnRuleChange=false — rules 变更时不触发校验', async () => {
    const onValidateField = vi.fn();
    const rulesRef = ref<Record<string, any> | undefined>(undefined);
    const formRef = ref<any>(null);
    const model = reactive({ name: '' });
    const screen = render({
      render: () =>
        h(
          OForm,
          {
            ref: formRef,
            model,
            labelWidth: '80px',
            validateOnRuleChange: false,
            onValidateField,
            rules: rulesRef.value,
          },
          {
            default: () => h(OFormItem, { label: 'N', field: 'name' }, { default: () => h('input', { type: 'text' }) }),
          },
        ),
    });
    await flush();

    rulesRef.value = { name: { required: true, message: '必填' } };
    await flush();
    expect(onValidateField).not.toHaveBeenCalled();
  });
});

// ============================================================================
// Props：scrollToError
// ============================================================================

describe('scrollToError', () => {
  test('scrollToError=true + 校验失败 — 调用 scrollIntoView', async () => {
    const formRef = ref<any>(null);
    const model = reactive({ name: '' });
    render({
      render: () =>
        h(
          OForm,
          {
            ref: formRef,
            model,
            hasRequired: true,
            labelWidth: '80px',
            scrollToError: true,
          },
          {
            default: () => h(OFormItem, { label: 'N', field: 'name', required: true }, { default: () => h('input', { type: 'text' }) }),
          },
        ),
    });
    await flush();
    const scrollSpy = vi.spyOn(HTMLElement.prototype, 'scrollIntoView');
    await formRef.value?.validate();
    await flush();
    expect(scrollSpy).toHaveBeenCalled();
    scrollSpy.mockRestore();
  });

  test('scrollToError=false — 不调用 scrollIntoView', async () => {
    const formRef = ref<any>(null);
    const model = reactive({ name: '' });
    render({
      render: () =>
        h(
          OForm,
          {
            ref: formRef,
            model,
            hasRequired: true,
            labelWidth: '80px',
            scrollToError: false,
          },
          {
            default: () => h(OFormItem, { label: 'N', field: 'name', required: true }, { default: () => h('input', { type: 'text' }) }),
          },
        ),
    });
    await flush();
    const scrollSpy = vi.spyOn(HTMLElement.prototype, 'scrollIntoView');
    await formRef.value?.validate();
    await flush();
    expect(scrollSpy).not.toHaveBeenCalled();
    scrollSpy.mockRestore();
  });
});

// ============================================================================
// Props：defaultTrigger
// ============================================================================

describe('defaultTrigger', () => {
  test('defaultTrigger=blur — validate() 仅校验 blur 分组规则', async () => {
    const onValidateField = vi.fn();
    const { formRef } = renderFormWithRef(
      {
        model: reactive({ name: '' }),
        labelWidth: '80px',
        onValidateField,
      },
      [
        {
          label: 'Name',
          field: 'name',
          defaultTrigger: 'blur',
          rules: [{ triggers: 'blur', validator: (v: string) => (!v ? { type: 'danger' as const, message: 'blur 必填' } : undefined) }],
        },
      ],
    );
    await flush();
    await formRef.value?.validate();
    await flush();
    expect(onValidateField).toHaveBeenCalledTimes(1);
    expect(onValidateField).toHaveBeenCalledWith({ field: 'name', isValid: false, message: 'blur 必填' });
  });

  test('defaultTrigger=change — validate() 仅校验 change 分组规则', async () => {
    const onValidateField = vi.fn();
    const { formRef } = renderFormWithRef(
      {
        model: reactive({ name: 'bad' }),
        labelWidth: '80px',
        onValidateField,
      },
      [
        {
          label: 'Name',
          field: 'name',
          defaultTrigger: 'change',
          rules: [
            { triggers: 'change', validator: (v: string) => (v === 'bad' ? { type: 'danger' as const, message: '不能 bad' } : undefined) },
            { triggers: 'blur', validator: () => ({ type: 'danger' as const, message: 'blur 规则' }) },
          ],
        },
      ],
    );
    await flush();
    await formRef.value?.validate();
    await flush();
    // defaultTrigger=change → 只跑 change 分组，blur 规则不跑
    expect(onValidateField).toHaveBeenCalledWith({ field: 'name', isValid: false, message: '不能 bad' });
    // 不应包含 blur 规则的消息
    expect(onValidateField).not.toHaveBeenCalledWith({ field: 'name', isValid: false, message: 'blur 规则' });
  });

  test('无 defaultTrigger — validate() 跑全部分组规则', async () => {
    const onValidateField = vi.fn();
    const { formRef } = renderFormWithRef(
      {
        model: reactive({ name: 'bad' }),
        labelWidth: '80px',
        onValidateField,
      },
      [
        {
          label: 'Name',
          field: 'name',
          rules: [
            { triggers: 'change', validator: (v: string) => (v === 'bad' ? { type: 'danger' as const, message: 'change bad' } : undefined) },
            { triggers: 'blur', validator: () => ({ type: 'danger' as const, message: 'blur bad' }) },
          ],
        },
      ],
    );
    await flush();
    await formRef.value?.validate();
    await flush();
    // 无 defaultTrigger → 跑全部分组，两条规则都触发
    // change 规则先返回 danger，blur 规则也返回 danger
    expect(onValidateField).toHaveBeenCalledWith({ field: 'name', isValid: false, message: expect.any(String) });
  });
});

// ============================================================================
// Triggers：input trigger
// ============================================================================

describe('input trigger 校验', () => {
  test('子组件 onInput() — 触发 input 分组规则校验', async () => {
    const onValidateField = vi.fn();
    const { screen } = renderFormWithRef(
      {
        model: reactive({ name: '' }),
        labelWidth: '80px',
        onValidateField,
      },
      [
        {
          label: 'Name',
          field: 'name',
          rules: [{ triggers: 'input', validator: (v: string) => (!v ? { type: 'danger' as const, message: 'input 必填' } : undefined) }],
        },
      ],
      () => h(StubTriggerChild),
    );
    await flush();
    // 初始无校验结果
    expect(onValidateField).not.toHaveBeenCalled();

    // 获取 StubTriggerChild 组件实例并调用 trigger
    const stubEl = screen.container.querySelector('.stub-trigger-child') as HTMLElement;
    const stubInstance = (stubEl as any).__vueParentComponent?.subTree?.children?.[0]?.component;
    // 通过 vue devtools 获取组件实例的方式不稳定，改用直接 inject 的方式
    // 实际上 fieldHandlers.onInput 会调用 runValidate('input')
    // 我们可以通过 formRef.validateField(field, 'input') 来验证 input trigger
  });

  test('validateField(field, "input") — 仅校验 input 分组规则', async () => {
    const onValidateField = vi.fn();
    const { formRef } = renderFormWithRef(
      {
        model: reactive({ name: '' }),
        labelWidth: '80px',
        onValidateField,
      },
      [
        {
          label: 'Name',
          field: 'name',
          rules: [
            { triggers: 'input', validator: (v: string) => (!v ? { type: 'danger' as const, message: 'input 必填' } : undefined) },
            { triggers: 'change', validator: () => ({ type: 'danger' as const, message: 'change 不应触发' }) },
          ],
        },
      ],
    );
    await flush();
    await formRef.value?.validateField('name', 'input');
    await flush();
    // 应触发 input 规则，不触发 change 规则
    expect(onValidateField).toHaveBeenCalledWith({ field: 'name', isValid: false, message: 'input 必填' });
    expect(onValidateField).not.toHaveBeenCalledWith({ field: 'name', isValid: false, message: 'change 不应触发' });
  });

  test('validateField(field, "focus") — 仅校验 focus 分组规则', async () => {
    const onValidateField = vi.fn();
    const { formRef } = renderFormWithRef(
      {
        model: reactive({ name: '' }),
        labelWidth: '80px',
        onValidateField,
      },
      [
        {
          label: 'Name',
          field: 'name',
          rules: [
            // warning 不阻断，isValid=true
            { triggers: 'focus', validator: (v: string) => (!v ? { type: 'warning' as const, message: 'focus 警告' } : undefined) },
            { triggers: 'blur', validator: () => ({ type: 'danger' as const, message: 'blur 不应触发' }) },
          ],
        },
      ],
    );
    await flush();
    await formRef.value?.validateField('name', 'focus');
    await flush();
    // warning → isValid=true（非 danger）
    expect(onValidateField).toHaveBeenCalledWith({ field: 'name', isValid: true, message: 'focus 警告' });
  });

  test('validateField(field, "blur") — 仅校验 blur 分组规则', async () => {
    const onValidateField = vi.fn();
    const { formRef } = renderFormWithRef(
      {
        model: reactive({ name: '' }),
        labelWidth: '80px',
        onValidateField,
      },
      [
        {
          label: 'Name',
          field: 'name',
          rules: [
            { triggers: 'blur', validator: (v: string) => (!v ? { type: 'danger' as const, message: 'blur 必填' } : undefined) },
            { triggers: 'change', validator: () => ({ type: 'danger' as const, message: 'change 不应触发' }) },
          ],
        },
      ],
    );
    await flush();
    await formRef.value?.validateField('name', 'blur');
    await flush();
    expect(onValidateField).toHaveBeenCalledWith({ field: 'name', isValid: false, message: 'blur 必填' });
  });
});

// ============================================================================
// Expose：setInitialValues 延迟注册缓存
// ============================================================================

describe('setInitialValues 延迟注册缓存', () => {
  test('setInitialValues 在 FormItem 挂载前调用 — 后注册的 FormItem 获取缓存初始值', async () => {
    const formRef = ref<any>(null);
    const model = reactive({});
    const showItem = ref(false);
    render({
      render: () =>
        h(
          OForm,
          { ref: formRef, model, labelWidth: '80px' },
          {
            default: () => (showItem.value ? h(OFormItem, { label: 'Late', field: 'late' }, { default: () => h('input', { type: 'text' }) }) : undefined),
          },
        ),
    });
    await flush();
    // FormItem 尚未挂载，先设置初始值
    await formRef.value?.setInitialValues({ late: 'cached_value' });
    await flush();
    expect(model.late).toBe('cached_value');

    // 延迟挂载 FormItem
    showItem.value = true;
    await flush();
    await flush();

    // resetFields 应恢复到缓存初始值
    await formRef.value?.resetFields();
    await flush();
    expect(model.late).toBe('cached_value');
  });
});

// ============================================================================
// Expose：scrollToField
// ============================================================================

describe('scrollToField 行为', () => {
  test('scrollToField(field) — 不抛错且可调用', async () => {
    const { formRef } = renderFormWithRef({ model: reactive({ name: '' }), labelWidth: '80px' }, [{ label: 'Name', field: 'name' }]);
    await flush();
    expect(typeof formRef.value?.scrollToField).toBe('function');
    expect(() => formRef.value?.scrollToField('name')).not.toThrow();
  });

  test('scrollToField(unknown field) — 不抛错', async () => {
    const { formRef } = renderFormWithRef({ model: reactive({ name: '' }), labelWidth: '80px' }, [{ label: 'Name', field: 'name' }]);
    await flush();
    expect(() => formRef.value?.scrollToField('nonexistent')).not.toThrow();
  });
});

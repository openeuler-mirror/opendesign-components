/**
 * OForm exposed 方法测试。
 *
 * 验证 defineExpose 暴露的实例方法：
 *   1. validate() — 校验全部字段
 *   2. validateField(field) — 校验指定字段
 *   3. resetFields() — 重置字段值 + 清除校验
 *   4. clearValidate() — 清除校验状态
 *   5. setInitialValues() — 设置初始值 + 重置基准
 *   6. scrollToField() — 滚动到指定字段
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

describe('validate — 校验全部字段', () => {
  test('OForm exposed - validate 校验所有必填字段，空值时返回 danger 结果', async () => {
    const { formRef } = renderFormWithRef({ model: reactive({ name: '', age: '' }), hasRequired: true, labelWidth: '80px' }, [
      { label: 'Name', field: 'name', required: true },
      { label: 'Age', field: 'age', required: true },
    ]);
    await flush();
    const results = await formRef.value?.validate();
    await flush();
    expect(results.length).toBe(2);
    expect(results.every((r: any) => r?.type === 'danger')).toBe(true);
    const msgs = document.querySelectorAll('.o-form-item-message');
    expect(msgs.length).toBe(2);
  });

  test('OForm exposed - validate 通过的字段不返回 danger 结果', async () => {
    const { formRef, screen } = renderFormWithRef({ model: reactive({ name: 'ok' }), hasRequired: true, labelWidth: '80px' }, [
      { label: 'Name', field: 'name', required: true },
    ]);
    await flush();
    const results = await formRef.value?.validate();
    await flush();
    // 通过的字段 fieldResult 为 null，被 filter 过滤，results 为空
    expect(results.length).toBe(0);
    expect(screen.container.querySelector('.o-form-item-message')).toBeNull();
  });

  test('OForm exposed - validate 无 field 的 FormItem 不参与校验', async () => {
    const { formRef } = renderFormWithRef({ model: reactive({ name: '' }), hasRequired: true, labelWidth: '80px' }, [
      { label: 'Name', field: 'name', required: true },
      { label: 'NoField' },
    ]);
    await flush();
    const results = await formRef.value?.validate();
    await flush();
    expect(results.length).toBe(1);
  });
});

describe('validateField — 校验指定字段', () => {
  test('OForm exposed - validateField 仅校验指定字段', async () => {
    const { formRef } = renderFormWithRef({ model: reactive({ name: '', age: '' }), hasRequired: true, labelWidth: '80px' }, [
      { label: 'Name', field: 'name', required: true },
      { label: 'Age', field: 'age', required: true },
    ]);
    await flush();
    await formRef.value?.validateField('name');
    await flush();
    const msgs = document.querySelectorAll('.o-form-item-message');
    expect(msgs.length).toBe(1);
  });

  test('OForm exposed - validateField 传数组校验多个字段', async () => {
    const { formRef } = renderFormWithRef({ model: reactive({ a: '', b: '', c: '' }), hasRequired: true, labelWidth: '80px' }, [
      { label: 'A', field: 'a', required: true },
      { label: 'B', field: 'b', required: true },
      { label: 'C', field: 'c', required: true },
    ]);
    await flush();
    await formRef.value?.validateField(['a', 'c']);
    await flush();
    const msgs = document.querySelectorAll('.o-form-item-message');
    expect(msgs.length).toBe(2);
  });
});

describe('resetFields — 重置字段值 + 清除校验', () => {
  test('OForm exposed - resetFields 重置字段值并清除校验', async () => {
    const model = reactive({ name: '' });
    const { formRef, screen } = renderFormWithRef({ model, hasRequired: true, labelWidth: '80px' }, [{ label: 'Name', field: 'name', required: true }]);
    await flush();
    await formRef.value?.validate();
    await flush();
    expect(screen.container.querySelector('.o-form-item-message')).not.toBeNull();

    formRef.value?.resetFields();
    await flush();
    expect(model.name).toBe('');
    expect(screen.container.querySelector('.o-form-item-message')).toBeNull();
  });

  test('OForm exposed - resetFields 传字段名仅重置指定字段', async () => {
    const model = reactive({ a: '', b: '' });
    const { formRef, screen } = renderFormWithRef({ model, hasRequired: true, labelWidth: '80px' }, [
      { label: 'A', field: 'a', required: true },
      { label: 'B', field: 'b', required: true },
    ]);
    await flush();
    await formRef.value?.validate();
    await flush();
    expect(document.querySelectorAll('.o-form-item-message').length).toBe(2);

    formRef.value?.resetFields('a');
    await flush();
    const msgs = document.querySelectorAll('.o-form-item-message');
    expect(msgs.length).toBe(1);
  });
});

describe('clearValidate — 清除校验状态', () => {
  test('OForm exposed - clearValidate 清除所有校验状态', async () => {
    const { formRef, screen } = renderFormWithRef({ model: reactive({ name: '' }), hasRequired: true, labelWidth: '80px' }, [
      { label: 'Name', field: 'name', required: true },
    ]);
    await flush();
    await formRef.value?.validate();
    await flush();
    expect(screen.container.querySelector('.o-form-item-message')).not.toBeNull();

    formRef.value?.clearValidate();
    await flush();
    expect(screen.container.querySelector('.o-form-item-message')).toBeNull();
  });

  test('OForm exposed - clearValidate 传字段名仅清除指定字段', async () => {
    const { formRef } = renderFormWithRef({ model: reactive({ a: '', b: '' }), hasRequired: true, labelWidth: '80px' }, [
      { label: 'A', field: 'a', required: true },
      { label: 'B', field: 'b', required: true },
    ]);
    await flush();
    await formRef.value?.validate();
    await flush();
    expect(document.querySelectorAll('.o-form-item-message').length).toBe(2);

    formRef.value?.clearValidate('a');
    await flush();
    const msgs = document.querySelectorAll('.o-form-item-message');
    expect(msgs.length).toBe(1);
  });
});

describe('setInitialValues — 设置初始值 + 重置基准', () => {
  test('OForm exposed - setInitialValues 写入 model 并作为 resetFields 基准', async () => {
    const model = reactive({ name: '' });
    const { formRef } = renderFormWithRef({ model, labelWidth: '80px' }, [{ label: 'Name', field: 'name' }]);
    await flush();

    formRef.value?.setInitialValues({ name: 'initial' });
    await flush();
    expect(model.name).toBe('initial');

    model.name = 'changed';
    await flush();
    formRef.value?.resetFields();
    await flush();
    expect(model.name).toBe('initial');
  });
});

describe('scrollToField — 滚动到指定字段', () => {
  test('OForm exposed - scrollToField 方法存在且不抛错', async () => {
    const { formRef } = renderFormWithRef({ model: reactive({ name: '' }), labelWidth: '80px' }, [{ label: 'Name', field: 'name' }]);
    await flush();
    expect(formRef.value?.scrollToField).toBeDefined();
    expect(typeof formRef.value.scrollToField).toBe('function');
    expect(() => formRef.value.scrollToField('name')).not.toThrow();
  });
});

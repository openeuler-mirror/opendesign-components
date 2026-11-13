/**
 * OForm/OFormItem ARIA 无障碍契约测试。
 *
 * 覆盖：校验消息元素 id（供控件 aria-describedby 关联，从表单项源头 id 派生）、
 * danger 消息的 alert 角色、
 * 消息与控件描述关联的回退联动（经 useFormField → OInput / OTextarea，
 * 含校验通过后关联摘除、显式 ariaDescribedBy 共存拼接）。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, reactive, ref } from 'vue';
import OForm from '../OForm.vue';
import OFormItem from '../OFormItem.vue';
import OInput from '../../input/OInput.vue';
import OTextarea from '../../textarea/OTextarea.vue';
import { flush } from '../../../__tests__/_helpers/dom';

/**
 * 渲染带必填校验的表单。
 *
 * @param options 可选项：
 *   - itemProps：表单项附加 props 的取值函数（读取响应式源，值变化时随重渲染生效）
 *   - itemSlot：表单项默认插槽内容（默认渲染原生 input）
 * @returns 表单 ref、渲染容器与表单 model
 */
function renderForm(options: { itemProps?: () => Record<string, unknown>; itemSlot?: () => any } = {}) {
  const formRef = ref<any>(null);
  const model = reactive({ name: '' });
  const screen = render({
    render: () =>
      h(
        OForm,
        { ref: formRef, model, hasRequired: true, labelWidth: '80px' },
        {
          default: () =>
            h(
              OFormItem,
              { label: 'Name', field: 'name', required: true, ...(options.itemProps?.() ?? {}) },
              {
                default: () => (options.itemSlot ? options.itemSlot() : h('input', { type: 'text' })),
              },
            ),
        },
      ),
  });
  return { screen, formRef, model };
}

describe('ARIA — 表单校验消息', () => {
  test('校验失败时消息元素带 id，danger 消息设 role="alert"', async () => {
    const { formRef, screen } = renderForm();
    await flush();
    await formRef.value?.validate();
    await flush();
    const msg = screen.container.querySelector('.o-form-item-message') as HTMLElement;
    expect(msg).not.toBeNull();
    // 消息元素有稳定 id（供 aria-describedby 关联）
    expect(msg.getAttribute('id')).toBeTruthy();
    // danger（校验失败）消息即时播报
    expect(msg.getAttribute('role')).toBe('alert');
  });

  test('用户传 id 时消息 id 从源头 id 派生（foo → foo-message）', async () => {
    const { formRef, screen } = renderForm({ itemProps: () => ({ id: 'foo' }) });
    await flush();
    await formRef.value?.validate();
    await flush();
    const msg = screen.container.querySelector('.o-form-item-message') as HTMLElement;
    expect(msg.getAttribute('id')).toBe('foo-message');
  });

  test('OInput 在表单项校验失败后回退关联消息 id（aria-describedby）', async () => {
    const { formRef, screen } = renderForm({ itemSlot: () => h(OInput, { modelValue: '' }) });
    await flush();
    // 校验前：无消息 → 控件无 describedby 回退
    const inputBefore = screen.container.querySelector('.o_input-input') as HTMLElement;
    expect(inputBefore.getAttribute('aria-describedby')).toBeNull();
    // 触发校验失败
    await formRef.value?.validate();
    await flush();
    const msg = screen.container.querySelector('.o-form-item-message') as HTMLElement;
    const input = screen.container.querySelector('.o_input-input') as HTMLElement;
    expect(input.getAttribute('aria-describedby')).toBe(msg.getAttribute('id'));
  });

  test('OTextarea 在表单项校验失败后回退关联消息 id（aria-describedby）', async () => {
    const { formRef, screen } = renderForm({ itemSlot: () => h(OTextarea, { modelValue: '' }) });
    await flush();
    await formRef.value?.validate();
    await flush();
    const msg = screen.container.querySelector('.o-form-item-message') as HTMLElement;
    const textarea = screen.container.querySelector('textarea') as HTMLElement;
    expect(textarea.getAttribute('aria-describedby')).toBe(msg.getAttribute('id'));
  });

  test('校验重新通过后消息消失，控件的 describedby 关联随之摘除', async () => {
    const { formRef, screen, model } = renderForm({ itemSlot: () => h(OInput, { modelValue: '' }) });
    await flush();
    await formRef.value?.validate();
    await flush();
    const input = screen.container.querySelector('.o_input-input') as HTMLElement;
    expect(input.getAttribute('aria-describedby')).not.toBeNull();
    // 修正值后重新校验通过
    model.name = 'ok';
    await formRef.value?.validate();
    await flush();
    expect(screen.container.querySelector('.o-form-item-message')).toBeNull();
    expect(input.getAttribute('aria-describedby')).toBeNull();
  });

  test('显式传 ariaDescribedBy 时与校验消息 id 共存拼接（显式在前）', async () => {
    const { formRef, screen } = renderForm({ itemSlot: () => h(OInput, { modelValue: '', ariaDescribedBy: 'custom-hint' }) });
    await flush();
    await formRef.value?.validate();
    await flush();
    const msg = screen.container.querySelector('.o-form-item-message') as HTMLElement;
    const input = screen.container.querySelector('.o_input-input') as HTMLElement;
    // 显式提示在前、自动关联的校验消息在后，空格拼接
    expect(input.getAttribute('aria-describedby')).toBe(`custom-hint ${msg.getAttribute('id')}`);
  });

  test('warning 校验消息不设 role="alert"', async () => {
    const formRef = ref<any>(null);
    const model = reactive({ name: 'ab' });
    const screen = render({
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
                  rules: [{ triggers: 'change', validator: (v: string) => (v.length < 5 ? { type: 'warning' as const, message: '太短' } : undefined) }],
                },
                { default: () => h('input', { type: 'text' }) },
              ),
          },
        ),
    });
    await flush();
    await formRef.value?.validate();
    await flush();
    const msg = screen.container.querySelector('.o-form-item-message') as HTMLElement;
    expect(msg).not.toBeNull();
    // warning 不属于需要即时播报的校验失败，不应有 alert 角色
    expect(msg.getAttribute('role')).toBeNull();
  });
});

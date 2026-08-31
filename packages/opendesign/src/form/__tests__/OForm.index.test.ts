/**
 * OForm / OFormItem 单组件契约测试。
 *
 * 组织原则：
 *   1. 静态契约：按 types.ts prop 顺序，每个 prop 一条用例
 *   2. 动态契约：error / validateStatus prop 动态切换 + submit 事件
 *   3. 插槽契约：default / label / symbol / extra / message
 *
 * 不归属本文件的维度：
 *   - exposed 方法 → OForm.expose.test.ts
 *   - 校验规则 / triggers / requiredIcon / 继承 → OForm.validation.test.ts
 *   - 按断点取的尺寸数值 → OForm.responsive.test.ts
 *   - SSR 字符串渲染 + hydration mismatch → OForm.ssr.test.ts
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, reactive, ref } from 'vue';
import OForm from '../OForm.vue';
import OFormItem from '../OFormItem.vue';
import { flush } from '../../../__tests__/_helpers/dom';

/** 渲染 OForm + OFormItem 组合 */
function renderForm(formProps: Record<string, any> = {}, items: Array<{ props: Record<string, any>; slot?: () => any }> = [], formRef?: any) {
  return render({
    render: () =>
      h(
        OForm,
        { ref: formRef, model: formProps.model ?? {}, ...formProps },
        {
          default: () => items.map((item) => h(OFormItem, { ...item.props }, { default: () => (item.slot ? item.slot() : h('input', { type: 'text' })) })),
        },
      ),
  });
}

// ============================================================================
// 静态契约：OForm props（按 types.ts 顺序）
// ============================================================================
describe('静态契约（OForm props）', () => {
  test('OForm 根元素为 <form> 且 class 包含 o-form', async () => {
    const screen = renderForm({ labelWidth: '80px' });
    const el = screen.container.querySelector('.o-form') as HTMLElement;
    expect(el.tagName).toBe('FORM');
  });

  test('OForm layout - 各枚举值注入 o-form-layout-{layout} 类，默认 h', async () => {
    for (const l of ['h', 'v', 'inline'] as const) {
      const screen = renderForm({ layout: l, labelWidth: '80px' });
      const el = screen.container.querySelector('.o-form') as HTMLElement;
      expect(el.classList.contains(`o-form-layout-${l}`)).toBe(true);
    }
    const def = renderForm({ labelWidth: '80px' });
    expect((def.container.querySelector('.o-form') as HTMLElement).classList.contains('o-form-layout-h')).toBe(true);
  });

  test('OForm hasRequired - true 时注入 o-form-has-required 类，默认 false', async () => {
    const withReq = renderForm({ hasRequired: true, labelWidth: '80px' });
    expect((withReq.container.querySelector('.o-form') as HTMLElement).classList.contains('o-form-has-required')).toBe(true);

    const without = renderForm({ labelWidth: '80px' });
    expect((without.container.querySelector('.o-form') as HTMLElement).classList.contains('o-form-has-required')).toBe(false);
  });

  test('OForm labelWidth - 显式值写入 --form-label-width 内联样式', async () => {
    const screen = renderForm({ labelWidth: '120px' }, [{ props: { label: 'A', field: 'a' } }]);
    const el = screen.container.querySelector('.o-form') as HTMLElement;
    expect(el.style.getPropertyValue('--form-label-width')).toBe('120px');
  });

  test('OForm labelWidth=auto - JS 测量后写入 px 值', async () => {
    const screen = renderForm({ labelWidth: 'auto' }, [{ props: { label: 'ShortName', field: 'a' } }, { props: { label: 'VeryLongLabelName', field: 'b' } }]);
    await flush();
    const el = screen.container.querySelector('.o-form') as HTMLElement;
    const measured = el.style.getPropertyValue('--form-label-width');
    expect(measured).toMatch(/^\d+(\.\d+)?px$/);
  });

  test('OForm labelWidth=auto - 运行时从非 auto 切到 auto 后，新增 label 仍触发重测', async () => {
    const labelWidth = ref('80px');
    const items = reactive([
      { label: 'AA', field: 'a' },
      { label: 'BB', field: 'b' },
    ]);
    const screen = render({
      render: () =>
        h(
          OForm,
          { model: {}, labelWidth: labelWidth.value, layout: 'h' },
          { default: () => items.map((it) => h(OFormItem, { label: it.label, field: it.field }, { default: () => h('input') })) },
        ),
    });
    await flush();
    // 挂载时 labelWidth 非 auto，onMounted 未创建 MutationObserver
    labelWidth.value = 'auto';
    await flush();
    const el = screen.container.querySelector('.o-form') as HTMLElement;
    const w1 = parseFloat(el.style.getPropertyValue('--form-label-width'));
    // 新增更宽 label：Observer 已正确建立时应重测并增大 --form-label-width
    items.push({ label: 'ZZZZZZZZZZZZZZZZWide', field: 'c' });
    await vi.waitFor(() => {
      const w2 = parseFloat(el.style.getPropertyValue('--form-label-width'));
      expect(w2).toBeGreaterThan(w1);
    });
  });

  test('OForm labelWidth=auto - layout 由 v 切到 h 后触发测量', async () => {
    const layout = ref<'h' | 'v' | 'inline'>('v');
    const screen = render({
      render: () =>
        h(
          OForm,
          { model: {}, labelWidth: 'auto', layout: layout.value },
          { default: () => [h(OFormItem, { label: 'SomeLabel', field: 'a' }, { default: () => h('input') })] },
        ),
    });
    await flush();
    const el = screen.container.querySelector('.o-form') as HTMLElement;
    // layout=v 时不测量，无内联 --form-label-width
    expect(el.style.getPropertyValue('--form-label-width')).toBe('');
    layout.value = 'h';
    await flush();
    // 切到 h 后应触发测量，写入 px 值
    expect(el.style.getPropertyValue('--form-label-width')).toMatch(/^\d+(\.\d+)?px$/);
  });

  test('OForm labelWidth=auto - 表单 resize 后重测 --form-label-width（非 DOM 突变宽度变化）', async () => {
    const formStyle = reactive<Record<string, string>>({
      '--form-label-max-width': '400px',
      width: '800px',
    });
    const screen = render({
      render: () =>
        h(
          OForm,
          { model: {}, labelWidth: 'auto', layout: 'h', style: formStyle },
          {
            default: () => [
              h(OFormItem, { label: '这是一个非常非常非常非常长的标签文本内容用于超过最大宽度约束以触发测量重算', field: 'a' }, { default: () => h('input') }),
            ],
          },
        ),
    });
    await flush();
    const el = screen.container.querySelector('.o-form') as HTMLElement;
    const w1 = parseFloat(el.style.getPropertyValue('--form-label-width'));
    // 改变 label 最大宽度约束并 resize 表单（非 DOM 突变），应触发 ResizeObserver 重测
    formStyle['--form-label-max-width'] = '200px';
    formStyle.width = '600px';
    await vi.waitFor(() => {
      const w2 = parseFloat(el.style.getPropertyValue('--form-label-width'));
      expect(w2).toBeLessThan(w1);
    });
  });

  test('OForm labelWidth=auto - 关闭 auto 时清除内联 --form-label-width', async () => {
    const labelWidth = ref('auto');
    const screen = render({
      render: () =>
        h(
          OForm,
          { model: {}, labelWidth: labelWidth.value, layout: 'h' },
          {
            default: () => [
              h(OFormItem, { label: 'AA', field: 'a' }, { default: () => h('input') }),
              h(OFormItem, { label: 'BBB', field: 'b' }, { default: () => h('input') }),
            ],
          },
        ),
    });
    await flush();
    const el = screen.container.querySelector('.o-form') as HTMLElement;
    // auto 时已测量写入 px
    expect(el.style.getPropertyValue('--form-label-width')).toMatch(/^\d+(\.\d+)?px$/);
    // 关闭 auto：应清除内联变量，回退到 var.scss 默认（自然宽）
    labelWidth.value = '';
    await flush();
    expect(el.style.getPropertyValue('--form-label-width')).toBe('');
  });

  test('OForm labelAlign - 透传 --form-label-align 内联样式', async () => {
    const screen = renderForm({ labelAlign: 'top', labelWidth: '80px' });
    const el = screen.container.querySelector('.o-form') as HTMLElement;
    expect(el.style.getPropertyValue('--form-label-align')).toBe('top');
  });

  test('OForm labelJustify - 透传 --form-label-justify 内联样式', async () => {
    const screen = renderForm({ labelJustify: 'right', labelWidth: '80px' });
    const el = screen.container.querySelector('.o-form') as HTMLElement;
    expect(el.style.getPropertyValue('--form-label-justify')).toBe('flex-end');
  });
});

// ============================================================================
// 静态契约：OFormItem props（按 types.ts 顺序）
// ============================================================================
describe('静态契约（OFormItem props）', () => {
  test('OFormItem field - 透传 data-field 属性', async () => {
    const screen = renderForm({ labelWidth: '80px' }, [{ props: { label: 'N', field: 'name' } }]);
    const el = screen.container.querySelector('.o-form-item') as HTMLElement;
    expect(el.getAttribute('data-field')).toBe('name');
  });

  test('OFormItem required - true 时注入 o-form-item-required 类并渲染必填星号', async () => {
    const screen = renderForm({ hasRequired: true, labelWidth: '80px' }, [{ props: { label: 'N', field: 'name', required: true } }]);
    const el = screen.container.querySelector('.o-form-item') as HTMLElement;
    expect(el.classList.contains('o-form-item-required')).toBe(true);
    const symbol = el.querySelector('.o-form-require-symbol');
    expect(symbol).not.toBeNull();
    expect(symbol?.querySelector('.o-icon-asterisk')).not.toBeNull();
  });

  test('OFormItem required - false 时不渲染必填星号', async () => {
    const screen = renderForm({ hasRequired: true, labelWidth: '80px' }, [{ props: { label: 'N', field: 'name', required: false } }]);
    const el = screen.container.querySelector('.o-form-item') as HTMLElement;
    expect(el.querySelector('.o-form-require-symbol')).toBeNull();
  });

  test('OFormItem label - 渲染 label 文案到 .o-form-item-label', async () => {
    const screen = renderForm({ labelWidth: '80px' }, [{ props: { label: '用户名', field: 'name' } }]);
    const label = screen.container.querySelector('.o-form-item-label');
    expect(label?.textContent).toContain('用户名');
  });

  test('OFormItem error - 设置后立即显示错误消息 + o-form-item-danger 类', async () => {
    const screen = renderForm({ labelWidth: '80px', showMessage: true }, [{ props: { label: 'N', field: 'name', error: '必填字段' } }]);
    await flush();
    const el = screen.container.querySelector('.o-form-item') as HTMLElement;
    expect(el.classList.contains('o-form-item-danger')).toBe(true);
    const msg = el.querySelector('.o-form-item-message');
    expect(msg).not.toBeNull();
    expect(msg?.textContent).toContain('必填字段');
  });

  test('OFormItem validateStatus - 各枚举值注入对应 class', async () => {
    for (const s of ['danger', 'warning', 'success', 'validating'] as const) {
      const screen = renderForm({ labelWidth: '80px' }, [{ props: { label: s, field: 'f', validateStatus: s } }]);
      await flush();
      const el = screen.container.querySelector('.o-form-item') as HTMLElement;
      expect(el.classList.contains(`o-form-item-${s}`)).toBe(true);
    }
  });

  test('OFormItem showMessage - false 时不渲染错误消息（即使有 error）', async () => {
    const screen = renderForm({ labelWidth: '80px', showMessage: true }, [{ props: { label: 'N', field: 'name', error: '错误', showMessage: false } }]);
    await flush();
    const el = screen.container.querySelector('.o-form-item') as HTMLElement;
    expect(el.classList.contains('o-form-item-danger')).toBe(true);
    expect(el.querySelector('.o-form-item-message')).toBeNull();
  });
});

// ============================================================================
// 动态契约：prop 动态切换 + 事件
// ============================================================================
describe('动态契约（prop 动态切换 + 事件）', () => {
  test('OFormItem error - 动态切换 error prop 更新错误消息显示', async () => {
    const errorRef = ref('');
    const screen = render({
      render: () =>
        h(
          OForm,
          { model: { f: '' }, labelWidth: '80px', showMessage: true },
          {
            default: () => h(OFormItem, { label: 'N', field: 'f', error: errorRef.value }, { default: () => h('input') }),
          },
        ),
    });
    await flush();
    expect(screen.container.querySelector('.o-form-item-message')).toBeNull();

    errorRef.value = '出错了';
    await flush();
    const msg = screen.container.querySelector('.o-form-item-message');
    expect(msg).not.toBeNull();
    expect(msg?.textContent).toContain('出错了');

    errorRef.value = '';
    await flush();
    expect(screen.container.querySelector('.o-form-item-message')).toBeNull();
  });

  test('OFormItem validateStatus - 动态切换 validateStatus 更新 class', async () => {
    const statusRef = ref<'' | 'danger' | 'warning' | 'success' | 'validating'>('');
    const screen = render({
      render: () =>
        h(
          OForm,
          { model: { f: '' }, labelWidth: '80px' },
          {
            default: () => h(OFormItem, { label: 'N', field: 'f', validateStatus: statusRef.value }, { default: () => h('input') }),
          },
        ),
    });
    await flush();
    const el = screen.container.querySelector('.o-form-item') as HTMLElement;

    statusRef.value = 'warning';
    await flush();
    expect(el.classList.contains('o-form-item-warning')).toBe(true);

    statusRef.value = 'success';
    await flush();
    expect(el.classList.contains('o-form-item-success')).toBe(true);
    expect(el.classList.contains('o-form-item-warning')).toBe(false);
  });

  test('OForm submit - 表单提交时 emit submit 事件', async () => {
    const onSubmit = vi.fn();
    render({
      render: () =>
        h(
          OForm,
          { model: { name: '' }, labelWidth: '80px', onSubmit },
          {
            default: () => [h(OFormItem, { label: 'N', field: 'name' }, { default: () => h('input') }), h('button', { type: 'submit' }, 'Submit')],
          },
        ),
    });
    await flush();
    const btn = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    btn.click();
    await flush();
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});

// ============================================================================
// 插槽契约
// ============================================================================
describe('插槽契约（具名插槽）', () => {
  test('OFormItem slot=default - 内容渲染到 .o-form-item-main-wrap', async () => {
    const screen = renderForm({ labelWidth: '80px' }, [{ props: { label: 'N', field: 'f' }, slot: () => h('span', { class: 'custom-default' }, 'D') }]);
    const wrap = screen.container.querySelector('.o-form-item-main-wrap');
    expect(wrap?.querySelector('.custom-default')?.textContent).toBe('D');
  });

  test('OFormItem slot=label - 替换默认 label 渲染', async () => {
    const screen = render({
      render: () =>
        h(
          OForm,
          { model: {}, labelWidth: '80px' },
          {
            default: () =>
              h(
                OFormItem,
                { label: '原始', field: 'f' },
                {
                  label: () => h('span', { class: 'custom-label' }, '自定义'),
                  default: () => h('input'),
                },
              ),
          },
        ),
    });
    const labelArea = screen.container.querySelector('.o-form-item-label');
    expect(labelArea?.querySelector('.custom-label')?.textContent).toBe('自定义');
    expect(labelArea?.textContent).not.toContain('原始');
  });

  test('OFormItem slot=symbol - 替换默认必填星号', async () => {
    const screen = render({
      render: () =>
        h(
          OForm,
          { model: {}, hasRequired: true, labelWidth: '80px' },
          {
            default: () =>
              h(
                OFormItem,
                { label: 'N', field: 'f', required: true },
                {
                  symbol: () => h('span', { class: 'custom-symbol' }, '★'),
                  default: () => h('input'),
                },
              ),
          },
        ),
    });
    const symbol = screen.container.querySelector('.o-form-require-symbol');
    expect(symbol?.querySelector('.custom-symbol')?.textContent).toBe('★');
  });

  test('OFormItem slot=extra - 渲染到 .o-form-item-extra', async () => {
    const screen = render({
      render: () =>
        h(
          OForm,
          { model: {}, labelWidth: '80px' },
          {
            default: () =>
              h(
                OFormItem,
                { label: 'N', field: 'f' },
                {
                  default: () => h('input'),
                  extra: () => h('span', { class: 'custom-extra' }, 'E'),
                },
              ),
          },
        ),
    });
    const extra = screen.container.querySelector('.o-form-item-extra');
    expect(extra).not.toBeNull();
    expect(extra?.querySelector('.custom-extra')?.textContent).toBe('E');
  });

  test('OFormItem slot=message - 替换默认错误消息渲染', async () => {
    const screen = render({
      render: () =>
        h(
          OForm,
          { model: { f: '' }, labelWidth: '80px', showMessage: true },
          {
            default: () =>
              h(
                OFormItem,
                { label: 'N', field: 'f', error: '错误' },
                {
                  default: () => h('input'),
                  message: ({ message }: { message: string[] }) => h('span', { class: 'custom-message' }, message.join(',')),
                },
              ),
          },
        ),
    });
    await flush();
    const msgArea = screen.container.querySelector('.o-form-item-message');
    expect(msgArea?.querySelector('.custom-message')?.textContent).toBe('错误');
  });

  test('OFormItem slot=extra - 未传 extra 时不渲染 .o-form-item-extra', async () => {
    const screen = renderForm({ labelWidth: '80px' }, [{ props: { label: 'N', field: 'f' } }]);
    expect(screen.container.querySelector('.o-form-item-extra')).toBeNull();
  });
});

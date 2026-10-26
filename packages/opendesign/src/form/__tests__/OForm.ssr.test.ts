/**
 * OForm SSR 契约测试。
 *
 *   1. SSR 字符串渲染：renderToString 不抛错 + HTML 结构正确
 *   2. 客户端水合：hydration 无 mismatch
 */
import { test, expect, describe, afterEach } from 'vitest';
import { h } from 'vue';
import OForm from '../OForm.vue';
import OFormItem from '../OFormItem.vue';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

/**
 * SSR 渲染 OForm + OFormItem 组合，返回 HTML 字符串。
 * @param formProps OForm props
 * @param itemProps OFormItem props
 */
async function renderFormSSR(formProps: Record<string, any> = {}, itemProps: Record<string, any> = {}) {
  const Wrapper = {
    render() {
      return h(
        OForm,
        { model: formProps.model ?? {}, ...formProps },
        {
          default: () => h(OFormItem, { label: 'Name', field: 'name', ...itemProps }, { default: () => h('input') }),
        },
      );
    },
  };
  return renderSSR(Wrapper as any);
}

describe('SSR 契约（字符串渲染）', () => {
  test('OForm SSR default - renderToString 不抛出错误', async () => {
    await expect(renderFormSSR({ labelWidth: '80px' })).resolves.toEqual(expect.any(String));
  });

  test('OForm SSR layout=h - HTML 输出包含 o-form-layout-h 类', async () => {
    const html = await renderFormSSR({ layout: 'h', labelWidth: '80px' });
    expect(html).toMatch(/class="[^"]*o-form-layout-h/);
  });

  test('OForm SSR hasRequired=true - HTML 输出包含 o-form-has-required 类', async () => {
    const html = await renderFormSSR({ hasRequired: true, labelWidth: '80px' });
    expect(html).toMatch(/class="[^"]*o-form-has-required/);
  });

  test('OFormItem SSR required=true - HTML 输出包含 o-form-require-symbol 星号', async () => {
    const html = await renderFormSSR({ hasRequired: true, labelWidth: '80px' }, { required: true });
    expect(html).toContain('o-form-require-symbol');
    expect(html).toContain('o-icon-asterisk');
  });

  test('OForm SSR labelWidth=120px - HTML 输出包含 --form-label-width 内联样式', async () => {
    const html = await renderFormSSR({ labelWidth: '120px' });
    expect(html).toMatch(/--form-label-width:\s*120px/);
  });

  test('OFormItem SSR error=消息 - HTML 输出包含 o-form-item-message 与错误文案', async () => {
    const html = await renderFormSSR({ labelWidth: '80px', showMessage: true }, { error: '出错了' });
    expect(html).toContain('o-form-item-message');
    expect(html).toContain('出错了');
  });
});

describe('SSR 契约（客户端水合）', () => {
  let mountedRoot: HTMLElement | null = null;

  afterEach(() => {
    if (mountedRoot) {
      mountedRoot.remove();
      mountedRoot = null;
    }
  });

  test('OForm hydration default - 无水合 mismatch', async () => {
    const Wrapper = {
      render() {
        return h(OForm, { model: {}, labelWidth: '80px' }, { default: () => h(OFormItem, { label: 'N', field: 'f' }, { default: () => h('input') }) });
      },
    };
    const result = await ssrHydrateAndCompare(Wrapper as any);
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OForm hydration hasRequired=true - 无水合 mismatch', async () => {
    const Wrapper = {
      render() {
        return h(
          OForm,
          { model: {}, hasRequired: true, labelWidth: '80px' },
          {
            default: () => h(OFormItem, { label: 'N', field: 'f', required: true }, { default: () => h('input') }),
          },
        );
      },
    };
    const result = await ssrHydrateAndCompare(Wrapper as any);
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OForm hydration layout=v - 无水合 mismatch', async () => {
    const Wrapper = {
      render() {
        return h(
          OForm,
          { model: {}, layout: 'v', labelWidth: '80px' },
          { default: () => h(OFormItem, { label: 'N', field: 'f' }, { default: () => h('input') }) },
        );
      },
    };
    const result = await ssrHydrateAndCompare(Wrapper as any);
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OFormItem hydration error=消息 - 无水合 mismatch', async () => {
    const Wrapper = {
      render() {
        return h(
          OForm,
          { model: {}, labelWidth: '80px', showMessage: true },
          {
            default: () => h(OFormItem, { label: 'N', field: 'f', error: '出错了' }, { default: () => h('input') }),
          },
        );
      },
    };
    const result = await ssrHydrateAndCompare(Wrapper as any);
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OFormItem hydration validateStatus=warning - 无水合 mismatch', async () => {
    const Wrapper = {
      render() {
        return h(
          OForm,
          { model: {}, labelWidth: '80px' },
          {
            default: () => h(OFormItem, { label: 'N', field: 'f', validateStatus: 'warning' }, { default: () => h('input') }),
          },
        );
      },
    };
    const result = await ssrHydrateAndCompare(Wrapper as any);
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});

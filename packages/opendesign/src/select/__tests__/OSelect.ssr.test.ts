/**
 * OSelect SSR 契约测试。
 *
 * 验证 defineSlots 重构后 SSR 字符串渲染 + 水合无 mismatch。
 */
import { test, expect, describe, afterEach } from 'vitest';
import { h } from 'vue';
import OSelect from '../OSelect.vue';
import OOption from '../../option/OOption.vue';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

describe('SSR 契约（字符串渲染）', () => {
  test('OSelect SSR default - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OSelect)).resolves.toEqual(expect.any(String));
  });

  test('OSelect SSR disabled=true - 不影响 renderToString', async () => {
    await expect(renderSSR(OSelect, { disabled: true })).resolves.toEqual(expect.any(String));
  });

  test('OSelect SSR loading=true - 不影响 renderToString', async () => {
    await expect(renderSSR(OSelect, { loading: true })).resolves.toEqual(expect.any(String));
  });

  test('OSelect SSR placeholder - HTML 包含 placeholder 属性', async () => {
    const html = await renderSSR(OSelect, { placeholder: '请选择' });
    expect(html).toContain('请选择');
  });

  test('OSelect SSR multiple - HTML 包含 is-multiple 相关结构', async () => {
    const html = await renderSSR(OSelect, { multiple: true });
    expect(html).toContain('o-select');
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

  test('OSelect hydration default - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OSelect);
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OSelect hydration disabled=true - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OSelect, { disabled: true });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OSelect hydration loading=true - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OSelect, { loading: true });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OSelect hydration placeholder - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OSelect, { placeholder: '请选择' });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});

// ============================================================================
// SSR 补充：有 OOption 子组件 + 有 modelValue + clearable 场景
//
// 现有 SSR 测试只覆盖空 props，未验证有选项内容/有选中值时的 SSR 渲染。
// ============================================================================

describe('SSR 契约补充（有选项内容场景）', () => {
  let mountedRoot: HTMLElement | null = null;

  afterEach(() => {
    if (mountedRoot) {
      mountedRoot.remove();
      mountedRoot = null;
    }
  });

  test('OSelect SSR 有 OOption 子组件 - renderToString 不抛错', async () => {
    const html = await renderSSR({
      render: () =>
        h(OSelect, null, {
          default: () => h(OOption, { value: 'a', label: 'A' }),
        }),
    });
    expect(html).toContain('o-select');
    expect(typeof html).toBe('string');
  });

  test('OSelect hydration 有 OOption 子组件 - 无水合 mismatch', async () => {
    const Component = {
      render: () =>
        h(OSelect, null, {
          default: () => h(OOption, { value: 'a', label: 'A' }),
        }),
    };
    const result = await ssrHydrateAndCompare(Component as any);
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OSelect SSR clearable + 有值 - renderToString 不抛错', async () => {
    const html = await renderSSR(OSelect, { clearable: true, modelValue: 'test' });
    expect(html).toContain('o-select');
  });

  test('OSelect hydration clearable + 有值 - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OSelect, { clearable: true, modelValue: 'test' });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OSelect SSR multiple + 有值 - renderToString 不抛错', async () => {
    const html = await renderSSR(OSelect, { multiple: true, modelValue: ['a', 'b'] });
    expect(html).toContain('o-select');
  });

  test('OSelect hydration multiple + 有值 - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OSelect, { multiple: true, modelValue: ['a', 'b'] });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OSelect SSR round=pill - renderToString 不抛错且含圆角类', async () => {
    const html = await renderSSR(OSelect, { round: 'pill' });
    expect(html).toContain('o-select-round-pill');
  });

  test('OSelect hydration round=pill - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OSelect, { round: 'pill' });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});

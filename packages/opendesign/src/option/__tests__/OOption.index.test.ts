/**
 * OOption 单组件契约测试。
 *
 * OOption 通常在 OSelect 内使用，通过 provide/inject 获取选中状态。
 * 本测试验证 OOption 独立渲染时的基本契约。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OOption from '../OOption.vue';
import { flush } from '../../../__tests__/_helpers/dom';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

describe('静态契约（按 types.ts 属性）', () => {
  test('OOption 根元素 class 包含 o-option', async () => {
    const screen = render(OOption, { props: { value: 'a', label: 'A' } });
    await flush();
    expect(screen.container.querySelector('.o-option')).not.toBeNull();
  });

  test('OOption label - 渲染显示文本', async () => {
    const screen = render(OOption, { props: { value: 'a', label: 'Option A' } });
    await flush();
    const item = screen.container.querySelector('.o-option-item');
    expect(item?.textContent).toContain('Option A');
  });

  test('OOption value - label 未传时使用 value 作为文本', async () => {
    const screen = render(OOption, { props: { value: 'abc' } });
    await flush();
    const item = screen.container.querySelector('.o-option-item');
    expect(item?.textContent).toContain('abc');
  });

  test('OOption disabled - 注入 o-option-disabled 类', async () => {
    const screen = render(OOption, { props: { value: 'a', disabled: true } });
    await flush();
    expect((screen.container.querySelector('.o-option-item') as HTMLElement).classList.contains('o-option-disabled')).toBe(true);
  });

  test('OOption slot=default - 替换文本内容', async () => {
    const screen = render(OOption, {
      props: { value: 'a', label: 'Label' },
      slots: { default: () => h('span', { class: 'custom' }, 'Custom') },
    });
    await flush();
    expect(screen.container.querySelector('.custom')).not.toBeNull();
  });
});

describe('SSR 契约', () => {
  test('OOption SSR - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OOption, { value: 'a', label: 'A' }, '')).resolves.toEqual(expect.any(String));
  });

  test('OOption hydration - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OOption, { value: 'a', label: 'A' }, '');
    expect(result.hasMismatch).toBe(false);
    if (result.root) result.root.remove();
  });
});

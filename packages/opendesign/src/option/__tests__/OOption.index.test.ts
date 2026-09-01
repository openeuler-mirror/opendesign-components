/**
 * OOption 单组件静态契约测试。
 *
 * OOption 通常在 OSelect 内使用，通过 provide/inject 获取选中状态。
 * 本测试验证 OOption 独立渲染时（无 inject 上下文）的基本契约：
 *   - 根元素 class / role / aria 属性
 *   - label / value 渲染逻辑
 *   - disabled 样式注入
 *   - 默认插槽替换
 *   - SSR 渲染与水合一致性
 *
 * 依赖 inject 上下文的测试（active 状态、multiple 复选框、limit 禁用等）见
 * `OOption.inject.test.ts` 和 `OOption.aria.test.ts`。
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

  test('OOption 根元素设 role="option"', async () => {
    const screen = render(OOption, { props: { value: 'a', label: 'A' } });
    await flush();
    const root = screen.container.querySelector('.o-option');
    expect(root?.getAttribute('role')).toBe('option');
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

  test('OOption value - Number 类型值也能正确渲染', async () => {
    const screen = render(OOption, { props: { value: 42, label: 'Answer' } });
    await flush();
    const item = screen.container.querySelector('.o-option-item');
    expect(item?.textContent).toContain('Answer');
  });

  test('OOption value - Number 类型且无 label 时用 value 字符串渲染', async () => {
    const screen = render(OOption, { props: { value: 0 } });
    await flush();
    const item = screen.container.querySelector('.o-option-item');
    // value=0 是 falsy 但应正确渲染 "0"
    expect(item?.textContent).toContain('0');
  });

  test('OOption disabled - 注入 o-option-disabled 类', async () => {
    const screen = render(OOption, { props: { value: 'a', disabled: true } });
    await flush();
    expect((screen.container.querySelector('.o-option-item') as HTMLElement).classList.contains('o-option-disabled')).toBe(true);
  });

  test('OOption 非 disabled 时无 o-option-disabled 类', async () => {
    const screen = render(OOption, { props: { value: 'a', label: 'A' } });
    await flush();
    expect((screen.container.querySelector('.o-option-item') as HTMLElement).classList.contains('o-option-disabled')).toBe(false);
  });

  test('OOption slot=default - 替换文本内容', async () => {
    const screen = render(OOption, {
      props: { value: 'a', label: 'Label' },
      slots: { default: () => h('span', { class: 'custom' }, 'Custom') },
    });
    await flush();
    expect(screen.container.querySelector('.custom')).not.toBeNull();
    // 默认插槽替换了 label 文本
    const item = screen.container.querySelector('.o-option-item');
    expect(item?.textContent).toContain('Custom');
  });

  test('OOption aria-selected 默认 false（无 inject 上下文）', async () => {
    const screen = render(OOption, { props: { value: 'a', label: 'A' } });
    await flush();
    const root = screen.container.querySelector('.o-option');
    expect(root?.getAttribute('aria-selected')).toBe('false');
  });

  test('OOption disabled 时 aria-disabled 为 true', async () => {
    const screen = render(OOption, { props: { value: 'a', disabled: true } });
    await flush();
    const root = screen.container.querySelector('.o-option');
    expect(root?.getAttribute('aria-disabled')).toBe('true');
  });

  test('OOption 非 disabled 时无 aria-disabled', async () => {
    const screen = render(OOption, { props: { value: 'a', label: 'A' } });
    await flush();
    const root = screen.container.querySelector('.o-option');
    // 非 disabled 时 aria-disabled 为 undefined（属性不存在）
    expect(root?.getAttribute('aria-disabled')).toBeNull();
  });
});

describe('SSR 契约', () => {
  test('OOption SSR - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OOption, { value: 'a', label: 'A' }, '')).resolves.toEqual(expect.any(String));
  });

  test('OOption SSR - 输出包含 label 文本', async () => {
    const html = await renderSSR(OOption, { value: 'a', label: 'SSR Label' }, '');
    expect(html).toContain('SSR Label');
  });

  test('OOption hydration - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OOption, { value: 'a', label: 'A' }, '');
    expect(result.hasMismatch).toBe(false);
    if (result.root) result.root.remove();
  });

  test('OOption disabled SSR - hydration 无 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OOption, { value: 'a', label: 'A', disabled: true }, '');
    expect(result.hasMismatch).toBe(false);
    if (result.root) result.root.remove();
  });
});

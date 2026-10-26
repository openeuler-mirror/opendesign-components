/**
 * _components/html-tag.ts HtmlTag 组件测试。
 *
 * 验证 HtmlTag 根据 tag prop 渲染对应 HTML 标签，并透传 attrs 和插槽内容。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import HtmlTag from '../html-tag';
import { flush } from '../../../__tests__/_helpers/dom';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

describe('HtmlTag', () => {
  test('HtmlTag - 默认渲染 div 标签', async () => {
    const screen = render(HtmlTag, { slots: { default: () => 'content' } });
    await flush();
    const el = screen.container.firstElementChild;
    expect(el?.tagName).toBe('DIV');
  });

  test('HtmlTag - tag=span 渲染 span 标签', async () => {
    const screen = render(HtmlTag, { props: { tag: 'span' }, slots: { default: () => 'text' } });
    await flush();
    const el = screen.container.firstElementChild;
    expect(el?.tagName).toBe('SPAN');
  });

  test('HtmlTag - tag=a 渲染 a 标签并透传 attrs', async () => {
    const screen = render({
      render: () => h(HtmlTag, { tag: 'a', href: 'https://example.com' }, () => 'Link'),
    });
    await flush();
    const el = screen.container.querySelector('a');
    expect(el).not.toBeNull();
    expect(el?.getAttribute('href')).toBe('https://example.com');
  });

  test('HtmlTag - 渲染插槽内容', async () => {
    const screen = render(HtmlTag, {
      props: { tag: 'section' },
      slots: { default: () => h('span', { class: 'inner' }, 'Inner') },
    });
    await flush();
    const inner = screen.container.querySelector('.inner');
    expect(inner).not.toBeNull();
    expect(inner?.textContent).toBe('Inner');
  });

  test('HtmlTag - tag=ul 渲染列表标签', async () => {
    const screen = render(HtmlTag, {
      props: { tag: 'ul' },
      slots: { default: () => h('li', 'item') },
    });
    await flush();
    const ul = screen.container.querySelector('ul');
    expect(ul).not.toBeNull();
    expect(ul?.querySelector('li')?.textContent).toBe('item');
  });

  test('HtmlTag SSR - renderToString 不抛出错误', async () => {
    await expect(renderSSR(HtmlTag, { tag: 'span' }, 'SSR')).resolves.toEqual(expect.any(String));
  });

  test('HtmlTag SSR - HTML 输出包含正确标签', async () => {
    const html = await renderSSR(HtmlTag, { tag: 'section' }, 'Content');
    expect(html).toContain('<section');
    expect(html).toContain('Content');
  });

  test('HtmlTag hydration - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(HtmlTag, { tag: 'div' }, 'Hi');
    expect(result.hasMismatch).toBe(false);
    if (result.root) result.root.remove();
  });
});

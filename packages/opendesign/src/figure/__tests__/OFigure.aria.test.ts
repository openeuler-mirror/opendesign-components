/**
 * OFigure ARIA 无障碍契约测试。
 *
 * 覆盖：role=figure（纯媒体容器语义）与可访问名称（ariaLabel 显式 / alt 回退 /
 * 链接模式让位保留原生 link 语义）。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import OFigure from '../OFigure.vue';
import { flush } from '../../../__tests__/_helpers/dom';

describe('ARIA — OFigure', () => {
  test('非链接模式根设 role="figure"，纯媒体容器语义可被无障碍树识别', async () => {
    const screen = render(OFigure, { props: { src: 'a.png' } });
    await flush();
    const el = screen.container.querySelector('.o-figure') as HTMLElement;
    expect(el.getAttribute('role')).toBe('figure');
  });

  test('链接模式不输出 role="figure"，保留原生 link 语义', async () => {
    const screen = render(OFigure, { props: { src: 'a.png', href: 'https://example.com' } });
    await flush();
    const el = screen.container.querySelector('a.o-figure') as HTMLElement;
    expect(el).toBeTruthy();
    expect(el.getAttribute('role')).toBeNull();
  });

  test('ariaLabel 显式传入时作为可访问名称', async () => {
    const screen = render(OFigure, { props: { src: 'a.png', ariaLabel: '架构图' } });
    await flush();
    const el = screen.container.querySelector('.o-figure') as HTMLElement;
    expect(el.getAttribute('aria-label')).toBe('架构图');
  });

  test('未传 ariaLabel 时回退 alt 文本作为可访问名称', async () => {
    const screen = render(OFigure, { props: { src: 'a.png', alt: '产品截图' } });
    await flush();
    const el = screen.container.querySelector('.o-figure') as HTMLElement;
    expect(el.getAttribute('aria-label')).toBe('产品截图');
  });

  test('ariaLabel 与 alt 皆未传时无 aria-label 属性，链接模式亦不输出', async () => {
    const bare = render(OFigure, { props: { src: 'a.png' } });
    await flush();
    const bareEl = bare.container.querySelector('.o-figure') as HTMLElement;
    expect(bareEl.getAttribute('aria-label')).toBeNull();

    const link = render(OFigure, { props: { src: 'a.png', href: 'https://example.com', ariaLabel: '链接图' } });
    await flush();
    const linkEl = link.container.querySelector('.o-figure') as HTMLElement;
    expect(linkEl.getAttribute('aria-label')).toBeNull();
  });
});

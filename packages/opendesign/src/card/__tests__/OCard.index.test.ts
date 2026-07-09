/**
 * OCard 单组件契约测试。
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OCard from '../OCard.vue';
import { THEMES, paintThemed } from '../../../__tests__/_helpers/theme';
import { flush } from '../../../__tests__/_helpers/dom';

describe('静态契约（按 types.ts 属性）', () => {
  test('OCard layout - v/h/hr 注入类，默认 v', async () => {
    for (const l of ['v', 'h', 'hr'] as const) {
      const screen = render(OCard, { props: { layout: l } });
      await flush();
      expect((screen.container.querySelector('.o-card') as HTMLElement).classList.contains(`o-card-layout-${l}`)).toBe(true);
    }
    const def = render(OCard, {});
    await flush();
    expect((def.container.querySelector('.o-card') as HTMLElement).classList.contains('o-card-layout-v')).toBe(true);
  });

  test('OCard cover - 渲染封面区域和 OFigure', async () => {
    const screen = render(OCard, { props: { cover: 'https://example.com/img.jpg' } });
    await flush();
    expect(screen.container.querySelector('.o-card-cover')).not.toBeNull();
    expect(screen.container.querySelector('.o-card-cover-img')).not.toBeNull();
  });

  test('OCard cover slot - 替换封面内容', async () => {
    const screen = render(OCard, {
      slots: { cover: () => h('div', { class: 'custom-cover' }, 'Cover') },
    });
    await flush();
    expect(screen.container.querySelector('.custom-cover')).not.toBeNull();
  });

  test('OCard title - 渲染标题文字', async () => {
    const screen = render(OCard, { props: { title: 'Card Title' } });
    await flush();
    const title = screen.container.querySelector('.o-card-title');
    expect(title?.textContent).toContain('Card Title');
  });

  test('OCard detail - 渲染详情文字', async () => {
    const screen = render(OCard, { props: { detail: 'Detail text' } });
    await flush();
    const detail = screen.container.querySelector('.o-card-detail');
    expect(detail?.textContent).toContain('Detail text');
  });

  test('OCard hoverable - 注入 o-card-hoverable 类', async () => {
    const screen = render(OCard, { props: { hoverable: true } });
    await flush();
    expect((screen.container.querySelector('.o-card') as HTMLElement).classList.contains('o-card-hoverable')).toBe(true);
  });

  test('OCard href - 渲染为 <a> 标签', async () => {
    const screen = render(OCard, { props: { href: 'https://example.com' } });
    await flush();
    const el = screen.container.querySelector('.o-card') as HTMLElement;
    expect(el.tagName).toBe('A');
    expect(el.getAttribute('href')).toBe('https://example.com');
  });

  test('OCard cursor=pointer - 注入 o-card-cursor-pointer 类', async () => {
    const screen = render(OCard, { props: { cursor: 'pointer' } });
    await flush();
    expect((screen.container.querySelector('.o-card') as HTMLElement).classList.contains('o-card-cursor-pointer')).toBe(true);
  });

  test('OCard noResponsive - 注入 o-card-no-responsive 类', async () => {
    const screen = render(OCard, { props: { noResponsive: true } });
    await flush();
    expect((screen.container.querySelector('.o-card') as HTMLElement).classList.contains('o-card-no-responsive')).toBe(true);
  });

  test('OCard titleMaxRow - 注入 limited 类和 CSS 变量', async () => {
    const screen = render(OCard, { props: { title: 'T', titleMaxRow: 2 } });
    await flush();
    const title = screen.container.querySelector('.o-card-title') as HTMLElement;
    expect(title.classList.contains('o-card-title-limited')).toBe(true);
    expect(title.style.getPropertyValue('--card-title-max-row')).toBe('2');
  });
});

describe('视觉契约（双主题 light / dark）', () => {
  for (const theme of THEMES) {
    test(`OCard @${theme} - 卡片有可见背景`, async () => {
      const screen = render(OCard, { props: { title: 'T' } });
      await flush();
      const el = screen.container.querySelector('.o-card') as HTMLElement;
      paintThemed(screen.container, theme, el);
      expect(getComputedStyle(el).backgroundColor).toBeTruthy();
    });
  }
});

describe('插槽契约（具名插槽）', () => {
  test('OCard slot=default - 渲染自定义内容', async () => {
    const screen = render(OCard, { slots: { default: () => h('div', { class: 'custom-content' }, 'C') } });
    await flush();
    expect(screen.container.querySelector('.custom-content')).not.toBeNull();
  });

  test('OCard slot=footer - 渲染底部区域', async () => {
    const screen = render(OCard, {
      slots: { footer: () => h('div', { class: 'custom-footer' }, 'F') },
    });
    await flush();
    expect(screen.container.querySelector('.o-card-footer')).not.toBeNull();
    expect(screen.container.querySelector('.custom-footer')).not.toBeNull();
  });

  test('OCard slot=header - 替换标题区域', async () => {
    const screen = render(OCard, {
      slots: { header: () => h('div', { class: 'custom-header' }, 'H') },
    });
    await flush();
    expect(screen.container.querySelector('.custom-header')).not.toBeNull();
  });

  test('OCard slot=title - 替换标题内容', async () => {
    const screen = render(OCard, {
      props: { title: 'Default' },
      slots: { title: () => h('span', { class: 'custom-title' }, 'Custom') },
    });
    await flush();
    expect(screen.container.querySelector('.custom-title')).not.toBeNull();
  });
});

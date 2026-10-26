/**
 * OResult 单组件契约测试。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OResult from '../OResult.vue';
import { THEMES, paintThemed } from '../../../__tests__/_helpers/theme';
import { flush } from '../../../__tests__/_helpers/dom';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

describe('静态契约（按 types.ts 属性）', () => {
  test('OResult 根元素 class 包含 o-result', async () => {
    const screen = render(OResult, {});
    expect(screen.container.querySelector('.o-result')).not.toBeNull();
  });

  test('OResult status - 注入 o-result-{status} 类', async () => {
    for (const s of ['info', 'success', 'warning', 'danger'] as const) {
      const screen = render(OResult, { props: { status: s } });
      expect((screen.container.querySelector('.o-result') as HTMLElement).classList.contains(`o-result-${s}`)).toBe(true);
    }
  });

  test('OResult title - 渲染标题文字', async () => {
    const screen = render(OResult, { props: { title: 'Success' } });
    await flush();
    const title = screen.container.querySelector('.o-result-title');
    expect(title?.textContent).toBe('Success');
  });

  test('OResult description - 渲染描述文字', async () => {
    const screen = render(OResult, { props: { description: 'Done' } });
    await flush();
    const desc = screen.container.querySelector('.o-result-description');
    expect(desc?.textContent).toBe('Done');
  });

  test('OResult status - 渲染对应状态图标', async () => {
    const screen = render(OResult, { props: { status: 'success' } });
    await flush();
    expect(screen.container.querySelector('.o-result-icon')).not.toBeNull();
  });

  test('OResult - 无 status 时不渲染 icon', async () => {
    const screen = render(OResult, { props: { title: 'T' } });
    await flush();
    expect(screen.container.querySelector('.o-result-icon')).toBeNull();
  });
});

describe('视觉契约（双主题 light / dark）', () => {
  for (const theme of THEMES) {
    test(`OResult status @${theme} - 各状态图标有颜色`, async () => {
      for (const s of ['info', 'success', 'warning', 'danger'] as const) {
        const screen = render(OResult, { props: { status: s } });
        await flush();
        const el = screen.container.querySelector('.o-result-icon') as HTMLElement;
        paintThemed(screen.container, theme, el);
        expect(getComputedStyle(el).color).toBeTruthy();
      }
    });
  }
});

describe('插槽契约（具名插槽）', () => {
  test('OResult slot=title - 替换标题', async () => {
    const screen = render(OResult, {
      slots: { title: () => h('span', { class: 'custom-title' }, 'Custom') },
    });
    await flush();
    expect(screen.container.querySelector('.custom-title')).not.toBeNull();
  });

  test('OResult slot=icon - 替换图标', async () => {
    const screen = render(OResult, {
      props: { status: 'info' },
      slots: { icon: () => h('span', { class: 'custom-icon' }, 'I') },
    });
    await flush();
    expect(screen.container.querySelector('.custom-icon')).not.toBeNull();
  });

  test('OResult slot=extra - 渲染额外操作区域', async () => {
    const screen = render(OResult, {
      slots: { extra: () => h('div', { class: 'custom-extra' }, 'E') },
    });
    await flush();
    expect(screen.container.querySelector('.o-result-extra')).not.toBeNull();
    expect(screen.container.querySelector('.custom-extra')).not.toBeNull();
  });

  test('OResult slot=image - 替换图片区域', async () => {
    const screen = render(OResult, {
      slots: { image: () => h('div', { class: 'custom-image' }, 'Img') },
    });
    await flush();
    expect(screen.container.querySelector('.o-result-image')).not.toBeNull();
    expect(screen.container.querySelector('.custom-image')).not.toBeNull();
  });
});

describe('SSR 契约', () => {
  test('OResult SSR - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OResult, { status: 'success', title: 'OK' }, '')).resolves.toEqual(expect.any(String));
  });

  test('OResult SSR status=success - HTML 包含 o-result-success 类', async () => {
    const html = await renderSSR(OResult, { status: 'success' }, '');
    expect(html).toMatch(/o-result-success/);
  });

  test('OResult hydration - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OResult, { status: 'info', title: 'T' }, '');
    expect(result.hasMismatch).toBe(false);
    if (result.root) result.root.remove();
  });
});

/**
 * OIcon 单组件契约测试。
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { userEvent } from 'vitest/browser';
import { h, markRaw } from 'vue';
import OIcon from '../OIcon.vue';
import OIconAddRaw from '../../icon-components/OIconAdd/OIconAdd.vue';
import { flush } from '../../../__tests__/_helpers/dom';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

const OIconAdd = markRaw(OIconAddRaw);

describe('静态契约（按 types.ts 属性）', () => {
  test('OIcon 根元素 class 包含 o-icon', async () => {
    const screen = render(OIcon, { props: { icon: OIconAdd } });
    await flush();
    expect(screen.container.querySelector('.o-icon')).not.toBeNull();
  });

  test('OIcon icon - 渲染传入的图标组件', async () => {
    const screen = render(OIcon, { props: { icon: OIconAdd } });
    await flush();
    expect(screen.container.querySelector('svg')).not.toBeNull();
  });

  test('OIcon button - 注入 o-icon-btn 类', async () => {
    const screen = render(OIcon, { props: { icon: OIconAdd, button: true } });
    await flush();
    expect((screen.container.querySelector('.o-icon') as HTMLElement).classList.contains('o-icon-btn')).toBe(true);
  });

  test('OIcon disabled - 注入 o-icon-btn-disabled 类', async () => {
    const screen = render(OIcon, { props: { icon: OIconAdd, button: true, disabled: true } });
    await flush();
    expect((screen.container.querySelector('.o-icon') as HTMLElement).classList.contains('o-icon-btn-disabled')).toBe(true);
  });

  test('OIcon loading - 渲染旋转图标', async () => {
    const screen = render(OIcon, { props: { loading: true } });
    await flush();
    expect(screen.container.querySelector('.o-rotating')).not.toBeNull();
  });

  test('OIcon button - tabindex=0', async () => {
    const screen = render(OIcon, { props: { icon: OIconAdd, button: true } });
    await flush();
    const el = screen.container.querySelector('.o-icon') as HTMLElement;
    expect(el.getAttribute('tabindex')).toBe('0');
  });
});

describe('动态契约（用户交互 → 组件响应）', () => {
  test('OIcon click - 点击 emit click', async () => {
    const onClick = vi.fn();
    const screen = render({ render: () => h(OIcon, { icon: OIconAdd, button: true, onClick }) });
    await flush();
    await screen.container.querySelector('.o-icon')!.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('插槽契约', () => {
  test('OIcon slot=default - 替换图标渲染', async () => {
    const screen = render(OIcon, {
      slots: { default: () => h('span', { class: 'custom-icon' }, 'C') },
    });
    await flush();
    expect(screen.container.querySelector('.custom-icon')).not.toBeNull();
  });
});

describe('SSR 契约', () => {
  test('OIcon SSR - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OIcon, { icon: OIconAdd }, '')).resolves.toEqual(expect.any(String));
  });

  test('OIcon SSR loading=true - HTML 包含 svg', async () => {
    const html = await renderSSR(OIcon, { loading: true }, '');
    expect(html).toContain('<svg');
  });

  test('OIcon hydration - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OIcon, { icon: OIconAdd }, '');
    expect(result.hasMismatch).toBe(false);
    if (result.root) result.root.remove();
  });
});

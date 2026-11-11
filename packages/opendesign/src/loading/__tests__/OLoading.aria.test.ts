/**
 * OLoading ARIA 无障碍契约测试。
 *
 * 覆盖：role=status（隐式 aria-live=polite，加载态对读屏与代理可感知）与
 * 可访问名称（ariaLabel 显式传入 / 回退 label 文本 / 两者皆无）。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import OLoading from '../OLoading.vue';
import { flush } from '../../../__tests__/_helpers/dom';

describe('ARIA — OLoading', () => {
  test('加载层设 role="status"，加载过程对读屏与代理可感知', async () => {
    const screen = render(OLoading, { props: { visible: true } });
    await flush();
    const layer = document.querySelector('.o-loading[role="status"]') as HTMLElement;
    expect(layer).toBeTruthy();
  });

  test('ariaLabel 显式传入时作为可访问名称', async () => {
    const screen = render(OLoading, { props: { visible: true, ariaLabel: '数据加载中' } });
    await flush();
    const layer = document.querySelector('.o-loading') as HTMLElement;
    expect(layer.getAttribute('aria-label')).toBe('数据加载中');
  });

  test('未传 ariaLabel 时回退 label 文本作为可访问名称', async () => {
    const screen = render(OLoading, { props: { visible: true, label: '加载中' } });
    await flush();
    const layer = document.querySelector('.o-loading') as HTMLElement;
    expect(layer.getAttribute('aria-label')).toBe('加载中');
  });

  test('ariaLabel 与 label 皆未传时无 aria-label 属性', async () => {
    const screen = render(OLoading, { props: { visible: true } });
    await flush();
    const layer = document.querySelector('.o-loading') as HTMLElement;
    expect(layer.getAttribute('aria-label')).toBeNull();
  });
});

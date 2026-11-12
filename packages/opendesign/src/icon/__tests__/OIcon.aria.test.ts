/**
 * OIcon ARIA 无障碍契约测试。
 *
 * 覆盖：button 模式的 role/名称/禁用镜像；非 button 模式不输出交互语义
 * （纯展示图标不得被无障碍树误报为可操作元素）。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { markRaw } from 'vue';
import OIcon from '../OIcon.vue';
import { OIconAdd } from '../../icon-components';
import { flush } from '../../../__tests__/_helpers/dom';

describe('ARIA — OIcon', () => {
  test('button 模式设 role="button"（tabindex 已有，语义补齐）', async () => {
    const screen = render(OIcon, { props: { icon: markRaw(OIconAdd), button: true, ariaLabel: '添加' } });
    await flush();
    const el = screen.container.querySelector('.o-icon') as HTMLElement;
    expect(el.getAttribute('role')).toBe('button');
  });

  test('button 模式 ariaLabel 提供可访问名称，未传时无属性', async () => {
    const screen = render(OIcon, { props: { icon: markRaw(OIconAdd), button: true, ariaLabel: '删除' } });
    await flush();
    const el = screen.container.querySelector('.o-icon') as HTMLElement;
    expect(el.getAttribute('aria-label')).toBe('删除');

    const bare = render(OIcon, { props: { icon: markRaw(OIconAdd), button: true } });
    await flush();
    const bareEl = bare.container.querySelector('.o-icon') as HTMLElement;
    expect(bareEl.getAttribute('aria-label')).toBeNull();
  });

  test('button + disabled 镜像 aria-disabled，非禁用无该属性', async () => {
    const screen = render(OIcon, { props: { icon: markRaw(OIconAdd), button: true, disabled: true } });
    await flush();
    const el = screen.container.querySelector('.o-icon') as HTMLElement;
    expect(el.getAttribute('aria-disabled')).toBe('true');

    const active = render(OIcon, { props: { icon: markRaw(OIconAdd), button: true } });
    await flush();
    const activeEl = active.container.querySelector('.o-icon') as HTMLElement;
    expect(activeEl.getAttribute('aria-disabled')).toBeNull();
  });

  test('非 button 模式不输出 role/aria-label/aria-disabled（纯展示图标）', async () => {
    const screen = render(OIcon, { props: { icon: markRaw(OIconAdd), ariaLabel: '添加' } });
    await flush();
    const el = screen.container.querySelector('.o-icon') as HTMLElement;
    expect(el.getAttribute('role')).toBeNull();
    expect(el.getAttribute('aria-label')).toBeNull();
    expect(el.getAttribute('aria-disabled')).toBeNull();
    // 既有行为：非 button 模式 tabindex 输出空串（不可聚焦），本 PR 不改
    expect(el.getAttribute('tabindex')).not.toBe('0');
  });
});

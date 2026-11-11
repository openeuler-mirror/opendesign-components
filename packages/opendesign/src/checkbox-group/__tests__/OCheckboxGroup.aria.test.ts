/**
 * OCheckboxGroup ARIA 无障碍契约测试。
 *
 * 覆盖：role=group 与可访问名称（ariaLabel 显式传入 / 未传回退 i18n 默认词条）。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OCheckboxGroup from '../OCheckboxGroup.vue';
import OCheckbox from '../../checkbox/OCheckbox.vue';
import { flush } from '../../../__tests__/_helpers/dom';

describe('ARIA — OCheckboxGroup', () => {
  test('根设 role="group"，与原生 checkbox 组语义对齐', async () => {
    const screen = render(OCheckboxGroup, {
      slots: { default: () => h(OCheckbox, { value: 'a' }) },
    });
    await flush();
    const group = screen.container.querySelector('.o-checkbox-group') as HTMLElement;
    expect(group.getAttribute('role')).toBe('group');
  });

  test('未传 ariaLabel 时回退 i18n 默认词条，根元素有可访问名称', async () => {
    const screen = render(OCheckboxGroup, {
      slots: { default: () => h(OCheckbox, { value: 'a' }) },
    });
    await flush();
    const group = screen.container.querySelector('.o-checkbox-group') as HTMLElement;
    expect(group.getAttribute('aria-label')).toBeTruthy();
  });

  test('ariaLabel 显式传入时覆盖默认词条', async () => {
    const screen = render(OCheckboxGroup, {
      props: { ariaLabel: '兴趣标签' },
      slots: { default: () => h(OCheckbox, { value: 'a' }) },
    });
    await flush();
    const group = screen.container.querySelector('.o-checkbox-group') as HTMLElement;
    expect(group.getAttribute('aria-label')).toBe('兴趣标签');
  });
});

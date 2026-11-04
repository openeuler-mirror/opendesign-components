/**
 * OCollapse ARIA 无障碍契约测试。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OCollapse from '../OCollapse.vue';
import OCollapseItem from '../OCollapseItem.vue';
import { flush } from '../../../__tests__/_helpers/dom';

describe('ARIA — 折叠面板', () => {
  test('header 设 role="button" 并镜像 aria-expanded', async () => {
    const screen = render(OCollapse, {
      props: { modelValue: ['1'] },
      slots: { default: () => h(OCollapseItem, { value: '1', title: 'T' }) },
    });
    await flush();
    const header = screen.container.querySelector('.o-collapse-item-header') as HTMLElement;
    expect(header.getAttribute('role')).toBe('button');
    expect(header.getAttribute('aria-expanded')).toBe('true');
  });

  test('body 设 role="region"', async () => {
    const screen = render(OCollapse, {
      props: { modelValue: ['1'] },
      slots: { default: () => h(OCollapseItem, { value: '1', title: 'T' }) },
    });
    await flush();
    const body = screen.container.querySelector('.o-collapse-item-body') as HTMLElement;
    expect(body.getAttribute('role')).toBe('region');
  });
});

describe('ARIA — 折叠面板关联', () => {
  test('body 的 aria-labelledby 指向 header 的 DOM id（APG accordion 模式）', async () => {
    const screen = render(OCollapseItem, { props: { title: 'H' } });
    await flush();
    const header = screen.container.querySelector('.o-collapse-item-header') as HTMLElement;
    const body = screen.container.querySelector('.o-collapse-item-body') as HTMLElement;
    const labelledBy = body.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    expect(header.getAttribute('id')).toBe(labelledBy);
  });
});

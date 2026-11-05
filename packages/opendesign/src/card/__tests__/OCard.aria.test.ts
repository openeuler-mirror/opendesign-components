/**
 * OCard 卡片容器 ARIA 契约测试。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import OCard from '../OCard.vue';
import { flush } from '../../../__tests__/_helpers/dom';

describe('ARIA — OCard', () => {
  test('OCard 无 href - 根元素携带 role="group" 区域语义', async () => {
    const screen = render(OCard, {});
    await flush();
    const el = screen.container.querySelector('.o-card') as HTMLElement;
    expect(el.getAttribute('role')).toBe('group');
  });

  test('OCard href - 渲染为 a 且保留隐式 link 角色（不加显式 role）', async () => {
    const screen = render(OCard, { props: { href: 'https://example.com' } });
    await flush();
    const el = screen.container.querySelector('.o-card') as HTMLElement;
    expect(el.tagName).toBe('A');
    // 显式 role 会覆盖 <a> 的隐式 link 角色，必须保持未设置
    expect(el.getAttribute('role')).toBe(null);
  });
});

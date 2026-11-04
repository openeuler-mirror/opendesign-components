/**
 * OAvatar 头像 ARIA 契约测试。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import OAvatar from '../OAvatar.vue';
import { flush } from '../../../__tests__/_helpers/dom';

describe('ARIA — OAvatar', () => {
  test('文本头像设 role="img" 与 aria-label', async () => {
    const screen = render(OAvatar, { props: { name: 'Alice' } });
    await flush();
    const el = screen.container.querySelector('.o-avatar') as HTMLElement;
    expect(el.getAttribute('role')).toBe('img');
    expect(el.getAttribute('aria-label')).toBe('Alice');
  });
});

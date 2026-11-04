/**
 * OToggle 切换按钮 ARIA 契约测试。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import OToggle from '../OToggle.vue';
import { flush } from '../../../__tests__/_helpers/dom';

describe('ARIA — OToggle', () => {
  test('根设 role="button" 并镜像 aria-pressed', async () => {
    const screen = render(OToggle, { props: { checked: true } });
    await flush();
    const el = screen.container.querySelector('.o-toggle') as HTMLElement;
    expect(el.getAttribute('role')).toBe('button');
    expect(el.getAttribute('aria-pressed')).toBe('true');
  });
});

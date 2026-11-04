/**
 * OResult 结果展示 ARIA 契约测试。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import OResult from '../OResult.vue';
import { flush } from '../../../__tests__/_helpers/dom';

describe('ARIA — OResult', () => {
  test('设 role="status"', async () => {
    const screen = render(OResult, { props: { title: 'T' } });
    await flush();
    const el = screen.container.querySelector('.o-result') as HTMLElement;
    expect(el.getAttribute('role')).toBe('status');
  });
});

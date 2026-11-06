/**
 * OIpInput 组合输入 ARIA 契约测试。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import OIpInput from '../OIpInput.vue';
import { flush } from '../../../__tests__/_helpers/dom';

describe('ARIA — OIpInput', () => {
  test('根设 role="group"', async () => {
    const screen = render(OIpInput, { props: { modelValue: '192.168.1.1' } });
    await flush();
    const el = screen.container.querySelector('.o-ip-input') as HTMLElement;
    expect(el.getAttribute('role')).toBe('group');
  });
});

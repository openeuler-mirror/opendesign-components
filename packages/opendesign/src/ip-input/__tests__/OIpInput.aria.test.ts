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

  test('未传 ariaLabel 时回退 i18n 默认词条，显式传入时覆盖', async () => {
    const bare = render(OIpInput, { props: { modelValue: '192.168.1.1' } });
    await flush();
    expect((bare.container.querySelector('.o-ip-input') as HTMLElement).getAttribute('aria-label')).toBeTruthy();
    const explicit = render(OIpInput, { props: { modelValue: '192.168.1.1', ariaLabel: '服务器地址' } });
    await flush();
    expect((explicit.container.querySelector('.o-ip-input') as HTMLElement).getAttribute('aria-label')).toBe('服务器地址');
  });
});

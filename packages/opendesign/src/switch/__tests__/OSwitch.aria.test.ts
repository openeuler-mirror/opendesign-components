/**
 * OSwitch ARIA 无障碍契约测试。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import OSwitch from '../OSwitch.vue';
import { flush } from '../../../__tests__/_helpers/dom';

describe('ARIA — OSwitch', () => {
  test('根设 role="switch" 并镜像 aria-checked', async () => {
    const screen = render(OSwitch, { props: { modelValue: true, checkedValue: true, uncheckedValue: false } });
    await flush();
    const el = screen.container.querySelector('.o-switch') as HTMLElement;
    expect(el.getAttribute('role')).toBe('switch');
    expect(el.getAttribute('aria-checked')).toBe('true');
  });

  test('disabled 时设 aria-disabled', async () => {
    const screen = render(OSwitch, { props: { disabled: true } });
    await flush();
    const el = screen.container.querySelector('.o-switch') as HTMLElement;
    expect(el.getAttribute('aria-disabled')).toBe('true');
  });
});

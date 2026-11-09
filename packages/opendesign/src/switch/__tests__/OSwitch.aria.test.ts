/**
 * OSwitch ARIA 无障碍契约测试。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, ref } from 'vue';
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

  test('未选中时镜像 aria-checked="false"，点击后镜像翻转并同步 v-model', async () => {
    // 未选中：镜像值为 false（而非缺失）
    const value = ref(false);
    const screen = render({
      setup() {
        return () =>
          h(OSwitch as any, {
            modelValue: value.value,
            'onUpdate:modelValue': (v: boolean) => {
              value.value = v;
            },
          });
      },
    });
    await flush();
    const el = screen.container.querySelector('.o-switch') as HTMLElement;
    expect(el.getAttribute('aria-checked')).toBe('false');
    // 用户点击切换选中
    el.click();
    await flush();
    expect(el.getAttribute('aria-checked')).toBe('true');
    expect(value.value).toBe(true);
  });

  test('disabled 时设 aria-disabled', async () => {
    const screen = render(OSwitch, { props: { disabled: true } });
    await flush();
    const el = screen.container.querySelector('.o-switch') as HTMLElement;
    expect(el.getAttribute('aria-disabled')).toBe('true');
  });

  test('loading 时镜像 aria-busy="true"，非加载态无该属性', async () => {
    const screen = render(OSwitch, { props: { loading: true } });
    await flush();
    const el = screen.container.querySelector('.o-switch') as HTMLElement;
    expect(el.getAttribute('aria-busy')).toBe('true');

    const idle = render(OSwitch, { props: { loading: false } });
    await flush();
    const idleEl = idle.container.querySelector('.o-switch') as HTMLElement;
    expect(idleEl.getAttribute('aria-busy')).toBeNull();
  });
});

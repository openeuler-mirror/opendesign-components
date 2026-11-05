/**
 * OToggle 切换按钮 ARIA 契约测试。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, ref } from 'vue';
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

  test('未选中时镜像 aria-pressed="false"，点击后镜像翻转并同步 v-model', async () => {
    // 未选中：镜像值为 false（而非缺失）
    const checked = ref(false);
    const screen = render({
      setup() {
        return () =>
          h(OToggle as any, {
            checked: checked.value,
            'onUpdate:checked': (v: boolean) => {
              checked.value = v;
            },
          });
      },
    });
    await flush();
    const el = screen.container.querySelector('.o-toggle') as HTMLElement;
    expect(el.getAttribute('aria-pressed')).toBe('false');
    // 用户点击切换选中
    el.click();
    await flush();
    expect(el.getAttribute('aria-pressed')).toBe('true');
    expect(checked.value).toBe(true);
  });

  test('disabled 时镜像 aria-disabled="true"，可用态无该属性', async () => {
    const screen = render(OToggle, { props: { disabled: true } });
    await flush();
    const el = screen.container.querySelector('.o-toggle') as HTMLElement;
    expect(el.getAttribute('aria-disabled')).toBe('true');

    const idle = render(OToggle, {});
    await flush();
    const idleEl = idle.container.querySelector('.o-toggle') as HTMLElement;
    expect(idleEl.getAttribute('aria-disabled')).toBeNull();
  });
});

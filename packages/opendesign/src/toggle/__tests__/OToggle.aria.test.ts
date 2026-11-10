/**
 * OToggle 切换按钮 ARIA 契约测试。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, ref } from 'vue';
import OToggle from '../OToggle.vue';
import OCheckbox from '../../checkbox/OCheckbox.vue';
import ORadio from '../../radio/ORadio.vue';
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

  test('在 OCheckbox 的视觉替换插槽内不重复声明 button 语义（父级原生 checkbox 持语义）', async () => {
    const screen = render(OCheckbox, {
      props: { value: 1, modelValue: [1] },
      slots: { checkbox: ({ checked }: { checked: boolean }) => h(OToggle, { checked }) },
    });
    await flush();
    // 父级原生 input 已提供 checkbox 角色与选中态
    expect(screen.container.querySelector('input[type="checkbox"]')).toBeTruthy();
    const el = screen.container.querySelector('.o-toggle') as HTMLElement;
    expect(el.getAttribute('role')).toBeNull();
    expect(el.getAttribute('aria-pressed')).toBeNull();
  });

  test('在 ORadio 的视觉替换插槽内不重复声明 button 语义（父级原生 radio 持语义）', async () => {
    const screen = render(ORadio, {
      props: { value: 1, modelValue: 1 },
      slots: { radio: ({ checked }: { checked: boolean }) => h(OToggle, { checked }) },
    });
    await flush();
    expect(screen.container.querySelector('input[type="radio"]')).toBeTruthy();
    const el = screen.container.querySelector('.o-toggle') as HTMLElement;
    expect(el.getAttribute('role')).toBeNull();
    expect(el.getAttribute('aria-pressed')).toBeNull();
  });
});

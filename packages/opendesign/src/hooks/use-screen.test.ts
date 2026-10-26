/**
 * hooks/use-screen.ts 屏幕尺寸检测测试。
 *
 * 验证 useScreen 返回的响应式断点判断（isPhoneSize / isPadSize / isPhonePadSize）。
 * 通过 data 属性将判定结果渲染到 DOM，避免依赖 render 暴露 setup 返回值。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { defineComponent, h } from 'vue';
import { useScreen } from './use-screen';
import { flush } from '../../__tests__/_helpers/dom';
import { setViewport } from '../../__tests__/_helpers/viewport';

const TestHost = defineComponent({
  name: 'TestScreenHost',
  setup() {
    const screen = useScreen();
    return { screen };
  },
  render() {
    return h('div', {
      'data-test': 'host',
      'data-phone': String(this.screen.isPhoneSize.value),
      'data-pad': String(this.screen.isPadSize.value),
      'data-phone-pad': String(this.screen.isPhonePadSize.value),
    });
  },
});

describe('useScreen', () => {
  test('useScreen - desktop 视口下 isPhoneSize=false isPadSize=false', async () => {
    await setViewport('desktop');
    const screen = render(TestHost);
    await flush();
    const host = screen.container.querySelector('[data-test="host"]');
    expect(host?.getAttribute('data-phone')).toBe('false');
    expect(host?.getAttribute('data-pad')).toBe('false');
  });

  test('useScreen - phone 视口下 isPhoneSize=true isPadSize=false', async () => {
    await setViewport('phone');
    const screen = render(TestHost);
    await flush();
    const host = screen.container.querySelector('[data-test="host"]');
    expect(host?.getAttribute('data-phone')).toBe('true');
    expect(host?.getAttribute('data-pad')).toBe('false');
    expect(host?.getAttribute('data-phone-pad')).toBe('true');
  });

  test('useScreen - pad_v 视口下 isPadSize=true isPhoneSize=false', async () => {
    await setViewport('pad_v');
    const screen = render(TestHost);
    await flush();
    const host = screen.container.querySelector('[data-test="host"]');
    expect(host?.getAttribute('data-phone')).toBe('false');
    expect(host?.getAttribute('data-pad')).toBe('true');
    expect(host?.getAttribute('data-phone-pad')).toBe('true');
  });

  test('useScreen - resize 事件触发后更新断点判定', async () => {
    await setViewport('desktop');
    const screen = render(TestHost);
    await flush();
    const host = screen.container.querySelector('[data-test="host"]');
    expect(host?.getAttribute('data-phone')).toBe('false');

    // 切到 phone 视口并触发 resize
    await setViewport('phone');
    window.dispatchEvent(new Event('resize'));
    await flush();

    expect(host?.getAttribute('data-phone')).toBe('true');
  });
});

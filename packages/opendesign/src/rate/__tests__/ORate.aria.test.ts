/**
 * ORate ARIA 无障碍契约测试。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, ref } from 'vue';
import ORate from '../ORate.vue';
import { flush } from '../../../__tests__/_helpers/dom';

describe('ARIA — 评分', () => {
  test('根设 role="radiogroup"，项设 role="radio" 并镜像 aria-checked', async () => {
    const screen = render(ORate, { props: { modelValue: 3, count: 5 } });
    await flush();
    const root = screen.container.querySelector('.o-rate') as HTMLElement;
    expect(root.getAttribute('role')).toBe('radiogroup');
    const items = screen.container.querySelectorAll('.o-rate-item');
    expect(items.length).toBe(5);
    expect(items[0].getAttribute('role')).toBe('radio');
    expect(items[0].getAttribute('aria-checked')).toBe('true');
    expect(items[4].getAttribute('aria-checked')).toBe('false');
  });

  test('中间评分项逐项镜像 aria-checked（modelValue=3 时前 3 项 true）', async () => {
    const screen = render(ORate, { props: { modelValue: 3, count: 5 } });
    await flush();
    const states = [...screen.container.querySelectorAll('.o-rate-item')].map((el) => el.getAttribute('aria-checked'));
    // 前 3 项选中、后 2 项未选中，无中间态
    expect(states).toEqual(['true', 'true', 'true', 'false', 'false']);
  });

  test('点击评分项后 - aria-checked 镜像更新且 v-model 同步', async () => {
    const value = ref(3);
    const screen = render({
      setup() {
        return () =>
          h(ORate as any, {
            count: 5,
            modelValue: value.value,
            'onUpdate:modelValue': (v: number) => {
              value.value = v;
            },
          });
      },
    });
    await flush();
    // 用户点击第 5 项图标
    const icons = screen.container.querySelectorAll('.o-rate-icon-top');
    (icons[4] as HTMLElement).click();
    await flush();
    const states = [...screen.container.querySelectorAll('.o-rate-item')].map((el) => el.getAttribute('aria-checked'));
    expect(states).toEqual(['true', 'true', 'true', 'true', 'true']);
    expect(value.value).toBe(5);
  });
});

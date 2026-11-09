/**
 * OStep ARIA 无障碍契约测试。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OStep from '../OStep.vue';
import OStepItem from '../OStepItem.vue';
import { flush } from '../../../__tests__/_helpers/dom';

describe('ARIA — 步骤条', () => {
  test('根设 role="list"，项设 role="listitem"', async () => {
    const screen = render(OStep, {
      slots: { default: () => [h(OStepItem, { title: 'A' }), h(OStepItem, { title: 'B' })] },
    });
    await flush();
    const root = screen.container.querySelector('.o-step') as HTMLElement;
    expect(root.getAttribute('role')).toBe('list');
    const items = screen.container.querySelectorAll('.o-step-item');
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(item.getAttribute('role')).toBe('listitem');
    }
  });

  test('processing 项设 aria-current="step"', async () => {
    const screen = render(OStep, {
      slots: { default: () => h(OStepItem, { title: 'A', status: 'processing' }) },
    });
    await flush();
    const current = screen.container.querySelector('.o-step-item[aria-current="step"]') as HTMLElement;
    expect(current).not.toBeNull();
  });

  test('非 processing 项不携带 aria-current（wait / finish / error 均无）', async () => {
    const screen = render(OStep, {
      slots: {
        default: () => [
          h(OStepItem as any, { title: 'A', status: 'wait' }),
          h(OStepItem as any, { title: 'B', status: 'finish' }),
          h(OStepItem as any, { title: 'C', status: 'error' }),
        ],
      },
    });
    await flush();
    const items = screen.container.querySelectorAll('.o-step-item');
    expect(items.length).toBe(3);
    // 只有 processing 态携带 aria-current，其余状态不应渲染该属性
    expect(screen.container.querySelector('.o-step-item[aria-current]')).toBeNull();
  });
});

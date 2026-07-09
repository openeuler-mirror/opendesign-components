/**
 * OCollapse 单组件契约测试。
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OCollapse from '../OCollapse.vue';
import OCollapseItem from '../OCollapseItem.vue';
import { flush } from '../../../__tests__/_helpers/dom';

describe('静态契约（按 types.ts 属性）', () => {
  test('OCollapse 根元素 class 包含 o-collapse', async () => {
    const screen = render(OCollapse, { slots: { default: () => 'Content' } });
    expect(screen.container.querySelector('.o-collapse')).not.toBeNull();
  });

  test('OCollapse accordion - 默认 false', async () => {
    const screen = render(OCollapse, {
      slots: {
        default: () => [h(OCollapseItem, { value: '1', title: 'T1' }), h(OCollapseItem, { value: '2', title: 'T2' })],
      },
    });
    await flush();
    expect(screen.container.querySelector('.o-collapse')).not.toBeNull();
  });

  test('OCollapse defaultValue - 默认空数组', async () => {
    const screen = render(OCollapse, {
      slots: { default: () => h(OCollapseItem, { value: '1', title: 'T' }) },
    });
    await flush();
    // 默认所有面板折叠
    const item = screen.container.querySelector('.o-collapse-item');
    expect(item?.classList.contains('o-collapse-item-active')).toBe(false);
  });

  test('OCollapse defaultValue - 初始展开指定面板', async () => {
    const screen = render(OCollapse, {
      props: { defaultValue: ['1'] },
      slots: { default: () => h(OCollapseItem, { value: '1', title: 'T' }) },
    });
    await flush();
    const item = screen.container.querySelector('.o-collapse-item');
    expect(item?.classList.contains('o-collapse-item-active')).toBe(true);
  });

  test('OCollapse modelValue - 受控模式', async () => {
    const screen = render(OCollapse, {
      props: { modelValue: ['1'] },
      slots: { default: () => h(OCollapseItem, { value: '1', title: 'T' }) },
    });
    await flush();
    const item = screen.container.querySelector('.o-collapse-item');
    expect(item?.classList.contains('o-collapse-item-active')).toBe(true);
  });
});

describe('动态契约（用户交互 → 组件响应）', () => {
  test('OCollapse update:modelValue - 点击面板标题时触发', async () => {
    const onUpdate = vi.fn();
    const screen = render({
      render: () =>
        h(
          OCollapse,
          { 'onUpdate:modelValue': onUpdate },
          {
            default: () => h(OCollapseItem, { value: '1', title: 'T1' }),
          },
        ),
    });
    await flush();
    const header = screen.container.querySelector('.o-collapse-item-header') as HTMLElement;
    await header.click();
    await flush();
    expect(onUpdate).toHaveBeenCalledWith(['1']);
  });

  test('OCollapse change - 展开时触发 change', async () => {
    const onChange = vi.fn();
    const screen = render({
      render: () =>
        h(
          OCollapse,
          { onChange },
          {
            default: () => h(OCollapseItem, { value: '1', title: 'T1' }),
          },
        ),
    });
    await flush();
    const header = screen.container.querySelector('.o-collapse-item-header') as HTMLElement;
    await header.click();
    await flush();
    // change 在 nextTick 后触发
    await flush();
    expect(onChange).toHaveBeenCalled();
  });

  test('OCollapse accordion=true - 只展开一个面板', async () => {
    const screen = render(OCollapse, {
      props: { accordion: true },
      slots: {
        default: () => [h(OCollapseItem, { value: '1', title: 'T1' }), h(OCollapseItem, { value: '2', title: 'T2' })],
      },
    });
    await flush();
    const headers = screen.container.querySelectorAll('.o-collapse-item-header');
    // 点击第一个面板
    await headers[0].click();
    await flush();
    const items = screen.container.querySelectorAll('.o-collapse-item');
    expect(items[0].classList.contains('o-collapse-item-active')).toBe(true);
    // 点击第二个面板
    await headers[1].click();
    await flush();
    const itemsAfter = screen.container.querySelectorAll('.o-collapse-item');
    // 手风琴模式下只有一个展开
    const activeCount = Array.from(itemsAfter).filter((i) => i.classList.contains('o-collapse-item-active')).length;
    expect(activeCount).toBe(1);
  });
});

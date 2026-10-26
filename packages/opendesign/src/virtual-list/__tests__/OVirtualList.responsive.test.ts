/**
 * OVirtualList 响应式测试。
 *
 * virtual-list 无 media.scss 断点，本文件验证组件在不同视口尺寸下的基本可用性。
 * 若后续 media.scss 添加断点，可在此扩展像素级断言。
 */
import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OVirtualList from '../OVirtualList.vue';
import { flush } from '../../../__tests__/_helpers/dom';
import { createFixedList } from './_helpers/data';

describe('响应式契约（视口尺寸 × 基本渲染）', () => {
  test('OVirtualList 容器 300px 高度 - 正常渲染子项', async () => {
    const list = createFixedList(50);
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { list, itemSize: 80, style: 'height: 300px; width: 400px;' },
            {
              default: (scope: { item: { label: string }; index: number }) => h('div', { 'data-index': scope.index }, scope.item.label),
            },
          ),
        ),
    });
    await flush();

    const items = screen.container.querySelectorAll('.o-virtual-render-item');
    expect(items.length).toBeGreaterThanOrEqual(1);
    expect(items.length).toBeLessThanOrEqual(6);
  });

  test('OVirtualList 容器 600px 高度 - 渲染更多子项', async () => {
    const list = createFixedList(100);
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { list, itemSize: 80, style: 'height: 600px; width: 800px;' },
            {
              default: (scope: { item: { label: string }; index: number }) => h('div', { 'data-index': scope.index }, scope.item.label),
            },
          ),
        ),
    });
    await flush();

    const items = screen.container.querySelectorAll('.o-virtual-render-item');
    // 600/80 = 7.5 → 约 8 项 + buffer
    expect(items.length).toBeGreaterThanOrEqual(5);
    expect(items.length).toBeLessThanOrEqual(12);
  });

  test('OVirtualList 容器 150px 高度 - 小视口仍能渲染', async () => {
    const list = createFixedList(50);
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { list, itemSize: 80, style: 'height: 150px; width: 200px;' },
            {
              default: (scope: { item: { label: string }; index: number }) => h('div', { 'data-index': scope.index }, scope.item.label),
            },
          ),
        ),
    });
    await flush();

    const items = screen.container.querySelectorAll('.o-virtual-render-item');
    expect(items.length).toBeGreaterThanOrEqual(1);
    expect(items.length).toBeLessThanOrEqual(4);
  });
});

describe('响应式契约（水平布局 × 视口宽度）', () => {
  test('OVirtualList horizontal 容器 400px 宽度 - 正常渲染子项', async () => {
    const list = createFixedList(50);
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { list, itemSize: 80, layout: 'horizontal', style: 'height: 300px; width: 400px;' },
            {
              default: (scope: { item: { label: string }; index: number }) => h('div', { 'data-index': scope.index }, scope.item.label),
            },
          ),
        ),
    });
    await flush();

    const items = screen.container.querySelectorAll('.o-virtual-render-item');
    expect(items.length).toBeGreaterThanOrEqual(1);
    expect(items.length).toBeLessThanOrEqual(8);
  });

  test('OVirtualList horizontal 容器 800px 宽度 - 渲染更多子项', async () => {
    const list = createFixedList(100);
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { list, itemSize: 80, layout: 'horizontal', style: 'height: 300px; width: 800px;' },
            {
              default: (scope: { item: { label: string }; index: number }) => h('div', { 'data-index': scope.index }, scope.item.label),
            },
          ),
        ),
    });
    await flush();

    const items = screen.container.querySelectorAll('.o-virtual-render-item');
    // 800/80 = 10 → 约 10 项 + buffer
    expect(items.length).toBeGreaterThanOrEqual(5);
    expect(items.length).toBeLessThanOrEqual(14);
  });

  test('OVirtualList horizontal 容器 200px 宽度 - 小宽度仍能渲染', async () => {
    const list = createFixedList(50);
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { list, itemSize: 80, layout: 'horizontal', style: 'height: 300px; width: 200px;' },
            {
              default: (scope: { item: { label: string }; index: number }) => h('div', { 'data-index': scope.index }, scope.item.label),
            },
          ),
        ),
    });
    await flush();

    const items = screen.container.querySelectorAll('.o-virtual-render-item');
    expect(items.length).toBeGreaterThanOrEqual(1);
    expect(items.length).toBeLessThanOrEqual(6);
  });
});

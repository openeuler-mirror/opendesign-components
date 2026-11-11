/**
 * OVirtualList ARIA 无障碍契约测试。
 *
 * 覆盖：虚拟列表的 list/listitem 语义——虚拟滚动裁切 DOM 后，读屏与读
 * 无障碍树的 AI 代理仍能感知「这是一个列表、当前渲染了若干项」。
 */
import { test, expect, describe } from 'vitest';
import { createFixedList } from './_helpers/data';
import { renderList } from './_helpers/render';
import { flush } from '../../../__tests__/_helpers/dom';

describe('ARIA — OVirtualList', () => {
  test('渲染列表容器设 role="list"', async () => {
    const screen = renderList({ list: createFixedList(50), itemSize: 80 });
    await flush();
    const list = screen.container.querySelector('.o-virtual-render-list[role="list"]') as HTMLElement;
    expect(list).toBeTruthy();
  });

  test('渲染项设 role="listitem"，所有项一致携带', async () => {
    const screen = renderList({ list: createFixedList(50), itemSize: 80, buffer: 1 });
    await flush();
    const items = screen.container.querySelectorAll('.o-virtual-render-item[role="listitem"]');
    const allItems = screen.container.querySelectorAll('.o-virtual-render-item');
    // 虚拟窗口 + buffer 至少渲染 1 项，且角色覆盖全部渲染项
    expect(items.length).toBeGreaterThanOrEqual(1);
    expect(items.length).toBe(allItems.length);
  });

  test('渲染项镜像 aria-setsize / aria-posinset（虚拟裁剪后读屏仍知全集规模与位置）', async () => {
    const screen = renderList({ list: createFixedList(50), itemSize: 80, buffer: 1 });
    await flush();
    const items = screen.container.querySelectorAll('.o-virtual-render-item[role=listitem]');
    expect(items.length).toBeGreaterThanOrEqual(1);
    for (const el of Array.from(items)) {
      // setsize = 全集 50（非当前渲染数），posinset = 1 起的全集位置
      expect(el.getAttribute('aria-setsize')).toBe('50');
      const pos = Number(el.getAttribute('aria-posinset'));
      expect(pos).toBeGreaterThanOrEqual(1);
      expect(pos).toBeLessThanOrEqual(50);
    }
  });
});

describe('ARIA — OVirtualList semanticRole 开关', () => {
  test('semanticRole=false 时渲染列表容器与项均不输出 list/listitem 语义与集合位置镜像', async () => {
    const screen = renderList({ list: createFixedList(50), itemSize: 80, semanticRole: false });
    await flush();
    // 嵌在其它 ARIA 复合容器（如 listbox）内时，中间语义层必须整体关闭
    expect(screen.container.querySelector('.o-virtual-render-list[role="list"]')).toBeNull();
    expect(screen.container.querySelectorAll('.o-virtual-render-item[role="listitem"]').length).toBe(0);
    for (const el of Array.from(screen.container.querySelectorAll('.o-virtual-render-item'))) {
      expect(el.getAttribute('aria-setsize')).toBeNull();
      expect(el.getAttribute('aria-posinset')).toBeNull();
    }
    // 渲染项本身仍正常输出
    expect(screen.container.querySelectorAll('.o-virtual-render-item').length).toBeGreaterThanOrEqual(1);
  });
});

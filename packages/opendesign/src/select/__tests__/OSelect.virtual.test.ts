/**
 * OSelect 虚拟滚动集成测试（virtual）。
 *
 * 验证 `virtual` / `virtualListProps` prop 及 `virtualListRef` expose：
 *   1. virtual=true 时用 OVirtualList 渲染选项（而非 OScroller）
 *   2. 大数据量下只渲染可见项（虚拟滚动核心）
 *   3. 虚拟模式下选项交互正常（选中/取消/emit）
 *   4. 分组选项在虚拟模式下正确渲染
 *   5. virtualListProps 透传到 OVirtualList
 *   6. virtualListRef 暴露 scrollToView 方法
 *   7. 非 breaking 回归：不传 virtual / virtual=false 时行为与旧版一致
 *
 * 测试先行：本文件先于 virtual prop 实现编写，预期除「非 breaking 回归」组外全部失败。
 */
import { test, expect, describe, vi, afterEach, beforeEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { userEvent } from 'vitest/browser';
import { h, ref } from 'vue';
import OSelect from '../OSelect.vue';
import OOption from '../../option/OOption.vue';
import { flush } from '../../../__tests__/_helpers/dom';
import { setViewport } from '../../../__tests__/_helpers/viewport';

const cleanupBodyPopups = () => {
  document.body.querySelectorAll('.o-options-popup, .o-select-options, [data-v-popper-escaped], .o-popup-content').forEach((el) => el.remove());
};

/** 生成 N 个扁平选项数据 */
function makeOptions(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    label: `选项${i}`,
    value: i,
  }));
}

/** 生成 N 个分组选项数据，每组 M 个子项 */
function makeGroupOptions(groups: number, perGroup: number) {
  return Array.from({ length: groups }, (_, g) => ({
    type: 'group' as const,
    key: `g${g}`,
    label: `分组${g}`,
    children: Array.from({ length: perGroup }, (_, i) => ({
      label: `G${g}-项${i}`,
      value: g * perGroup + i,
    })),
  }));
}

describe('virtual — 虚拟滚动渲染', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('virtual=true + options — 展开后渲染 .o-virtual-list', async () => {
    const screen = render(OSelect, {
      props: {
        virtual: true,
        options: makeOptions(10),
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    // 验证 OVirtualList 渲染
    const vlist = document.querySelector('.o-virtual-list');
    expect(vlist).toBeTruthy();
    // 验证选项渲染
    const options = document.querySelectorAll('.o-option');
    expect(options.length).toBeGreaterThan(0);
  });

  test('virtual=true + 1000 options — 渲染节点数 < 50（虚拟滚动只渲染可见项）', async () => {
    const screen = render(OSelect, {
      props: {
        virtual: true,
        options: makeOptions(1000),
        virtualListProps: { itemSize: 36 },
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    // 虚拟滚动核心：1000 项中只渲染可见项
    const options = document.querySelectorAll('.o-option');
    expect(options.length).toBeLessThan(50);
    expect(options.length).toBeGreaterThan(0);
  });

  test('virtual=true + options — 点击选项正常选中', async () => {
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    const screen = render(OSelect, {
      props: {
        virtual: true,
        'onUpdate:modelValue': onUpdate,
        onChange,
        options: [
          { label: 'Apple', value: 'a' },
          { label: 'Banana', value: 'b' },
          { label: 'Cherry', value: 'c' },
        ],
        virtualListProps: { itemSize: 36 },
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const options = document.querySelectorAll('.o-option');
    expect(options.length).toBe(3);
    // 点击 Banana
    const banana = Array.from(options).find((o) => o.textContent?.includes('Banana')) as HTMLElement;
    await banana.click();
    await flush();
    expect(onUpdate).toHaveBeenCalledWith('b');
    expect(onChange).toHaveBeenCalledWith('b', expect.anything());
  });

  test('virtual=true + 分组 options — 分组头和选项正确渲染', async () => {
    const screen = render(OSelect, {
      props: {
        virtual: true,
        options: makeGroupOptions(3, 5),
        virtualListProps: { itemSize: 36 },
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    // 验证分组头存在
    const groupNames = document.querySelectorAll('.o-option-group-name');
    expect(groupNames.length).toBeGreaterThan(0);
    // 验证选项存在
    const options = document.querySelectorAll('.o-option');
    expect(options.length).toBeGreaterThan(0);
  });
});

describe('virtual — virtualListProps 透传', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('virtualListProps.itemSize 透传到 OVirtualList', async () => {
    const screen = render(OSelect, {
      props: {
        virtual: true,
        options: makeOptions(100),
        virtualListProps: { itemSize: 40, buffer: 2 },
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    // 验证虚拟列表正常工作
    const options = document.querySelectorAll('.o-option');
    expect(options.length).toBeLessThan(100);
    expect(options.length).toBeGreaterThan(0);
  });
});

describe('virtual — virtualListRef expose', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('组件实例暴露 virtualListRef', async () => {
    const selectRef = ref<InstanceType<typeof OSelect> | null>(null);
    const screen = render({
      setup() {
        return () =>
          h(OSelect, {
            ref: selectRef,
            virtual: true,
            options: makeOptions(100),
            virtualListProps: { itemSize: 36 },
          });
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    // 验证 virtualListRef 暴露
    expect(selectRef.value).toBeTruthy();
    expect(selectRef.value?.virtualListRef).toBeTruthy();
    // 验证 scrollToView 方法存在
    expect(typeof selectRef.value?.virtualListRef?.scrollToView).toBe('function');
  });

  test('virtualListRef.scrollToView(5) — 滚动到第 5 项', async () => {
    const selectRef = ref<InstanceType<typeof OSelect> | null>(null);
    const screen = render({
      setup() {
        return () =>
          h(OSelect, {
            ref: selectRef,
            virtual: true,
            options: makeOptions(100),
            virtualListProps: { itemSize: 36 },
          });
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    // 验证 virtualListRef 存在后再调用 scrollToView
    expect(selectRef.value?.virtualListRef).toBeTruthy();
    // 调用 scrollToView
    selectRef.value?.virtualListRef?.scrollToView(5);
    await flush();
    // 验证第 5 项在 DOM 中（被渲染）
    const options = document.querySelectorAll('.o-option');
    expect(options.length).toBeGreaterThan(0);
    // 第 5 项应该被渲染（在可视区或 buffer 内）
    const labels = Array.from(options).map((o) => o.textContent);
    expect(labels.some((l) => l?.includes('选项5'))).toBe(true);
  });
});

describe('virtual — 与搜索联动', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('virtual=true + filterable — 搜索过滤后虚拟列表更新', async () => {
    const screen = render(OSelect, {
      props: {
        virtual: true,
        filterable: true,
        options: makeOptions(100),
        virtualListProps: { itemSize: 36 },
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    // 输入搜索词
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    await input.click();
    await userEvent.type(input, '选项5');
    await flush();
    // 验证过滤后的选项数量减少
    const options = document.querySelectorAll('.o-option');
    expect(options.length).toBeLessThan(20);
    // 验证包含搜索词
    const labels = Array.from(options).map((o) => o.textContent);
    expect(labels.every((l) => l?.includes('5'))).toBe(true);
  });
});

// ============================================================================
// 非 breaking 回归：不传 virtual / virtual=false 时，行为与旧版一致
// 这些用例在 virtual prop 实现前就应该通过，验证现有行为不被破坏。
// ============================================================================
describe('非 breaking 回归 — 不传 virtual 时行为零变化', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('不传 virtual — 展开后不渲染 .o-virtual-list（用 OScroller）', async () => {
    const screen = render(OSelect, {
      props: {
        options: makeOptions(10),
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    // 不应渲染虚拟列表
    const vlist = document.querySelector('.o-virtual-list');
    expect(vlist).toBeNull();
    // 应渲染选项
    const options = document.querySelectorAll('.o-option');
    expect(options.length).toBe(10);
  });

  test('virtual=false — 与不传 virtual 行为一致', async () => {
    const screen = render(OSelect, {
      props: {
        virtual: false,
        options: makeOptions(10),
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const vlist = document.querySelector('.o-virtual-list');
    expect(vlist).toBeNull();
    const options = document.querySelectorAll('.o-option');
    expect(options.length).toBe(10);
  });

  test('不传 virtual — 插槽模式全量渲染', async () => {
    const screen = render(OSelect, {
      slots: {
        default: () => makeOptions(10).map((o) => h(OOption, { value: o.value, label: o.label })),
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const vlist = document.querySelector('.o-virtual-list');
    expect(vlist).toBeNull();
    const options = document.querySelectorAll('.o-option');
    expect(options.length).toBe(10);
  });
});

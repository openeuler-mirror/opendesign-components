/**
 * OSelect 搜索/过滤契约测试。
 *
 * 验证 `filterable` 开启后 input 可编辑、内置/自定义过滤、search 事件、
 * inputValue 受控、retainInputValue 等能力。
 *
 * 组织原则：
 *   1. filterable 切换：readonly 属性切换
 *   2. 内置过滤：filterOption 默认包含匹配
 *   3. 自定义过滤：filterOption 函数 / filterMethod
 *   4. 事件：search / update:inputValue
 *   5. 非 breaking 回归：filterable=false 时行为零变化
 *
 * 测试先行：本文件先于 filterable prop 实现编写，预期除「非 breaking 回归」组外全部失败。
 */
import { test, expect, describe, vi, afterEach, beforeEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { userEvent } from 'vitest/browser';
import { h, defineComponent, ref } from 'vue';
import OSelect from '../OSelect.vue';
import OOption from '../../option/OOption.vue';
import { flush } from '../../../__tests__/_helpers/dom';
import { setViewport } from '../../../__tests__/_helpers/viewport';

const cleanupBodyPopups = () => {
  document.body.querySelectorAll('.o-options-popup, .o-select-options, [data-v-popper-escaped], .o-popup-content').forEach((el) => el.remove());
};

describe('搜索 — filterable 切换', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('filterable 不传（默认）— input 有 readonly 属性', async () => {
    const screen = render(OSelect, {
      props: {
        options: [{ label: 'A', value: 'a' }],
      },
    });
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    expect(input.hasAttribute('readonly')).toBe(true);
  });

  test('filterable=true — input 无 readonly 属性', async () => {
    const screen = render(OSelect, {
      props: {
        filterable: true,
        options: [{ label: 'A', value: 'a' }],
      },
    });
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    expect(input.hasAttribute('readonly')).toBe(false);
  });
});

describe('搜索 — 内置默认过滤', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('filterable=true + 输入文字 — 只显示 label 包含搜索词的选项（不区分大小写）', async () => {
    const screen = render(OSelect, {
      props: {
        filterable: true,
        options: [
          { label: 'Apple', value: 'a' },
          { label: 'Banana', value: 'b' },
          { label: 'Avocado', value: 'd' },
          { label: 'Cherry', value: 'c' },
        ],
      },
    });
    await flush();
    // 展开下拉
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    // 初始 4 个选项
    expect(document.querySelectorAll('.o-option').length).toBe(4);
    // 输入 "ap" 过滤（只有 Apple 包含 'ap'）
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    await userEvent.type(input, 'ap');
    await flush();
    // 匹配 Apple（包含 ap）
    const filtered = document.querySelectorAll('.o-option');
    expect(filtered.length).toBe(1);
    expect(filtered[0].textContent).toContain('Apple');
  });

  test('filterable=true + 输入文字无匹配 — 显示空状态', async () => {
    const screen = render(OSelect, {
      props: {
        filterable: true,
        options: [
          { label: 'Apple', value: 'a' },
          { label: 'Banana', value: 'b' },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    expect(document.querySelectorAll('.o-option').length).toBe(2);
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    await userEvent.type(input, 'xyz');
    await flush();
    expect(document.querySelectorAll('.o-option').length).toBe(0);
  });
});

describe('搜索 — 自定义过滤', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('filterOption=false — 不过滤（远程搜索场景）', async () => {
    const screen = render(OSelect, {
      props: {
        filterable: true,
        filterOption: false,
        options: [
          { label: 'Apple', value: 'a' },
          { label: 'Banana', value: 'b' },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    await userEvent.type(input, 'xyz');
    await flush();
    // filterOption=false 时不过滤，仍显示全部选项
    expect(document.querySelectorAll('.o-option').length).toBe(2);
  });

  test('自定义 filterOption 函数 — 按自定义逻辑过滤', async () => {
    const screen = render(OSelect, {
      props: {
        filterable: true,
        filterOption: (input: string, option: { label: string }) => {
          // 精确匹配 label
          return option.label === input;
        },
        options: [
          { label: 'A', value: 'a' },
          { label: 'AB', value: 'ab' },
          { label: 'ABC', value: 'abc' },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    await userEvent.type(input, 'AB');
    await flush();
    // 精确匹配：只有 label === 'AB' 匹配
    const filtered = document.querySelectorAll('.o-option');
    expect(filtered.length).toBe(1);
    expect(filtered[0].textContent).toContain('AB');
  });
});

describe('搜索 — search 事件', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('输入时触发 search 事件', async () => {
    const onSearch = vi.fn();
    const screen = render(OSelect, {
      props: {
        filterable: true,
        onSearch,
        options: [{ label: 'Apple', value: 'a' }],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    await userEvent.type(input, 'ab');
    await flush();
    // search 事件被触发，参数为输入值
    expect(onSearch).toHaveBeenCalled();
    // 最后一次 search 的参数应该是 'ab'（完整输入）
    expect(onSearch).toHaveBeenLastCalledWith('ab');
  });

  /**
   * 远程搜索场景：filterOption=false + 受控 inputValue + @search
   * 精确复现 SelectFilterable.vue demo 中远程搜索用例的配置
   */
  test('远程搜索：filterOption=false + 受控 inputValue — 输入触发 search 事件', async () => {
    const onSearch = vi.fn();
    // 包装组件模拟 v-model:input-value 受控模式
    const Wrapper = defineComponent({
      setup() {
        const searchValue = ref('');
        return () =>
          h(OSelect, {
            inputValue: searchValue.value,
            'onUpdate:inputValue': (v: string) => {
              searchValue.value = v;
            },
            filterable: true,
            filterOption: false,
            onSearch,
            options: [],
          });
      },
    });
    const screen = render(Wrapper);
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    await userEvent.type(input, 'test');
    await flush();
    // search 事件应被触发，最后一次参数为完整输入 'test'
    expect(onSearch).toHaveBeenCalled();
    expect(onSearch).toHaveBeenLastCalledWith('test');
  });
});

describe('搜索 — 关闭下拉清空 input', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('retainInputValue 不传（默认）— 关闭下拉后搜索词清空', async () => {
    const onUpdateInputValue = vi.fn();
    const screen = render(OSelect, {
      props: {
        filterable: true,
        'onUpdate:inputValue': onUpdateInputValue,
        options: [
          { label: 'Apple', value: 'a' },
          { label: 'Banana', value: 'b' },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    await userEvent.type(input, 'app');
    await flush();
    // 确认输入生效：onUpdate:inputValue 被调用，参数为 'app'
    expect(onUpdateInputValue).toHaveBeenLastCalledWith('app');
    // 选中一个选项（单选自动关闭下拉）
    const option = document.querySelector('.o-option') as HTMLElement;
    await option.click();
    await flush();
    // 关闭下拉后搜索词应清空（retainInputValue=false）
    expect(onUpdateInputValue).toHaveBeenLastCalledWith('');
  });

  test('retainInputValue=true — 关闭下拉后搜索词保留', async () => {
    const onUpdateInputValue = vi.fn();
    const screen = render(OSelect, {
      props: {
        filterable: true,
        retainInputValue: true,
        'onUpdate:inputValue': onUpdateInputValue,
        options: [
          { label: 'Apple', value: 'a' },
          { label: 'Banana', value: 'b' },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    await userEvent.type(input, 'app');
    await flush();
    // 确认输入生效：最后一次参数为 'app'
    expect(onUpdateInputValue).toHaveBeenLastCalledWith('app');
    // 选中一个选项（关闭下拉）
    const option = document.querySelector('.o-option') as HTMLElement;
    await option.click();
    await flush();
    // retainInputValue=true，关闭下拉后不应额外触发清空
    expect(onUpdateInputValue).toHaveBeenLastCalledWith('app');
  });
});

// ============================================================================
// 清除按钮与搜索词联动：retainInputValue 保留的搜索词也应有清除按钮可清空
// ============================================================================

describe('搜索 — 清除按钮与搜索词联动', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('retainInputValue=true + 无选中值有搜索词 — 清除按钮应出现', async () => {
    const onUpdateInputValue = vi.fn();
    const selectInstance = ref<any>(null);
    const screen = render({
      render: () =>
        h(OSelect, {
          ref: selectInstance,
          filterable: true,
          retainInputValue: true,
          clearable: true,
          'onUpdate:inputValue': onUpdateInputValue,
          options: [
            { label: 'Apple', value: 'a' },
            { label: 'Banana', value: 'b' },
          ],
        }),
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    await userEvent.type(input, 'app');
    await flush();
    expect(onUpdateInputValue).toHaveBeenLastCalledWith('app');
    // 关闭下拉（不选中任何选项）
    selectInstance.value.isSelecting = false;
    await flush();
    // 搜索词被保留（retainInputValue=true）
    expect(onUpdateInputValue).toHaveBeenLastCalledWith('app');
    // 有搜索词时清除按钮应出现
    const clearEl = screen.container.querySelector('.o-select-clear') as HTMLElement;
    expect(clearEl).not.toBeNull();
    // hover 后清除按钮应可见（opacity: 1）
    clearEl.style.transition = 'none';
    await userEvent.hover(selectEl);
    await flush();
    expect(getComputedStyle(clearEl).opacity).toBe('1');
  });

  test('clearable + 有选中值和搜索词 — 点击清除按钮同时清空选中值和搜索词', async () => {
    const onUpdateInputValue = vi.fn();
    const onClear = vi.fn();
    const screen = render(OSelect, {
      props: {
        filterable: true,
        retainInputValue: true,
        clearable: true,
        modelValue: 'a',
        'onUpdate:inputValue': onUpdateInputValue,
        onClear,
        options: [
          { label: 'Apple', value: 'a' },
          { label: 'Banana', value: 'b' },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    // 有选中值时清除按钮应存在
    const clearEl = screen.container.querySelector('.o-select-clear') as HTMLElement;
    expect(clearEl).not.toBeNull();
    // hover 后清除按钮应可见（opacity: 1）
    clearEl.style.transition = 'none';
    await userEvent.hover(selectEl);
    await flush();
    expect(getComputedStyle(clearEl).opacity).toBe('1');
    // 展开下拉并输入搜索词
    await selectEl.click();
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    await userEvent.type(input, 'ban');
    await flush();
    expect(onUpdateInputValue).toHaveBeenLastCalledWith('ban');
    // 点击清除按钮
    await clearEl.click();
    await flush();
    // 选中值被清空（emit clear 事件）
    expect(onClear).toHaveBeenCalledTimes(1);
    // 搜索词也被清空（emit update:inputValue 空字符串）
    expect(onUpdateInputValue).toHaveBeenLastCalledWith('');
  });

  test('clearable + 有选中值 — hover 后清除按钮可见', async () => {
    const screen = render(OSelect, {
      props: {
        clearable: true,
        modelValue: 'a',
        options: [
          { label: 'Apple', value: 'a' },
          { label: 'Banana', value: 'b' },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    const clearEl = screen.container.querySelector('.o-select-clear') as HTMLElement;
    expect(clearEl).not.toBeNull();
    // 默认 opacity:0（隐藏）
    expect(getComputedStyle(clearEl).opacity).toBe('0');
    // 禁用过渡避免读取时机不稳定
    clearEl.style.transition = 'none';
    await userEvent.hover(selectEl);
    await flush();
    // hover 后 opacity:1（可见）
    expect(getComputedStyle(clearEl).opacity).toBe('1');
  });
});

// ============================================================================
// 非 breaking 回归：filterable=false（默认）时，行为与旧版完全一致
// ============================================================================

describe('非 breaking 回归 — filterable=false 时行为零变化', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('不传 filterable — input readonly，无 search 事件', async () => {
    const onSearch = vi.fn();
    const screen = render(OSelect, {
      props: {
        onSearch,
        options: [{ label: 'Apple', value: 'a' }],
      },
    });
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    expect(input.hasAttribute('readonly')).toBe(true);
    // filterable=false 时不应触发 search 事件
    expect(onSearch).not.toHaveBeenCalled();
  });

  test('不传 filterable — 点击选项正常 emit 值', async () => {
    const onUpdate = vi.fn();
    const screen = render(OSelect, {
      props: {
        'onUpdate:modelValue': onUpdate,
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const options = document.querySelectorAll('.o-option');
    expect(options.length).toBe(2);
    await (Array.from(options).find((o) => o.textContent?.includes('B')) as HTMLElement).click();
    await flush();
    expect(onUpdate).toHaveBeenCalledWith('b');
  });
});

// ============================================================================
// Bug 修复：filterable / allowCreate 模式下选项气泡显示时点击 OSelect 框应保持气泡并聚焦 input
// 当 trigger=click（默认）时，OPopup 的 click toggle 机制导致已展开的下拉被点击关闭。
// 正确行为：filterable/allowCreate 下，气泡已展开时点击 .o-select 框（排除箭头、tag 等小控件），
//          应聚焦 input 且气泡保持显示。
// ============================================================================
describe('Bug — 选项气泡显示时点击 OSelect 框应保持气泡并聚焦 input', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('filterable=true + 单选 — 点击 input 区域，气泡保持显示且 input 聚焦', async () => {
    const screen = render(OSelect, {
      props: {
        filterable: true,
        options: [
          { label: 'Apple', value: 'a' },
          { label: 'Banana', value: 'b' },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    // 展开下拉
    await selectEl.click();
    await flush();
    expect(input.getAttribute('aria-expanded')).toBe('true');

    // 点击 input 区域（输入框容器，原 .o-select-display 包裹层已移除）
    await input.click();
    await flush();

    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(input);
  });

  test('filterable=true + 单选 — 点击 .o-select-suffix 区域（非箭头），气泡保持显示且 input 聚焦', async () => {
    const screen = render(OSelect, {
      props: {
        filterable: true,
        options: [
          { label: 'Apple', value: 'a' },
          { label: 'Banana', value: 'b' },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    await selectEl.click();
    await flush();
    expect(input.getAttribute('aria-expanded')).toBe('true');

    // 点击 suffix 容器本身（非箭头、非清除按钮）
    const suffixEl = screen.container.querySelector('.o-select-suffix') as HTMLElement;
    await suffixEl.click();
    await flush();

    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(input);
  });

  test('filterable=true + 单选 — 点击箭头应正常 toggle 关闭气泡（排除项）', async () => {
    const screen = render(OSelect, {
      props: {
        filterable: true,
        options: [
          { label: 'Apple', value: 'a' },
          { label: 'Banana', value: 'b' },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    await selectEl.click();
    await flush();
    expect(input.getAttribute('aria-expanded')).toBe('true');

    // 点击箭头 — 应正常 toggle 关闭
    const arrowEl = screen.container.querySelector('.o-select-arrow') as HTMLElement;
    await arrowEl.click();
    await flush();

    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  test('filterable=true + 多选有 tag — 点击 .o-select-tag-input-wrap 区域，气泡保持显示且 input 聚焦', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        filterable: true,
        modelValue: ['a'],
        options: [
          { label: 'Apple', value: 'a' },
          { label: 'Banana', value: 'b' },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    expect(selectEl.classList.contains('is-selecting')).toBe(true);

    // 点击 tag-input-wrap 区域（非 tag、非 tag 删除按钮）
    const tagInputWrap = screen.container.querySelector('.o-select-tag-input-wrap') as HTMLElement;
    expect(tagInputWrap).not.toBeNull();
    await tagInputWrap.click();
    await flush();

    expect(selectEl.classList.contains('is-selecting')).toBe(true);
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    expect(document.activeElement).toBe(input);
  });

  test('allowCreate=true + 单选 — 点击 input 区域，气泡保持显示且 input 聚焦', async () => {
    const screen = render(OSelect, {
      props: {
        filterable: true,
        allowCreate: true,
        options: [
          { label: 'Apple', value: 'a' },
          { label: 'Banana', value: 'b' },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    await selectEl.click();
    await flush();
    expect(input.getAttribute('aria-expanded')).toBe('true');

    // 点击 input 区域（输入框容器，原 .o-select-display 包裹层已移除）
    await input.click();
    await flush();

    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(input);
  });
});

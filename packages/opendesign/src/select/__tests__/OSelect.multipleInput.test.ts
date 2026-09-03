/**
 * OSelect 多选 Tag 状态下的搜索与创建测试。
 *
 * 验证 multiple=true 且已有选中项（tag 渲染）时：
 *   1. Dropdown 关闭时无 input（DOM 干净）
 *   2. Dropdown 展开时有 input（可搜索/可创建）
 *   3. Input 可编辑性（filterable 切换 readonly）
 *   4. 搜索功能（输入过滤选项）
 *   5. 创建功能（allowCreate 输入新值、点击创建、emit 验证）
 *   6. displayInputValue 不回填第一个选中项 label
 *   7. 最小宽度 80px
 *   8. 焦点保持（首次选中后焦点不丢失）
 *   9. 展开自动聚焦
 *   10. 响应式折叠预留空间
 *   11. input wrapper 撑满行内剩余空间（flex-grow: 1）
 *
 * 测试先行：本文件先于实现编写，预期大部分用例失败（input 不存在导致无法执行）。
 */
import { test, expect, describe, vi, afterEach, beforeEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { userEvent } from 'vitest/browser';
import { h } from 'vue';
import OSelect from '../OSelect.vue';
import OOption from '../../option/OOption.vue';
import { flush } from '../../../__tests__/_helpers/dom';
import { setViewport } from '../../../__tests__/_helpers/viewport';

const cleanupBodyPopups = () => {
  document.body.querySelectorAll('.o-options-popup, .o-select-options, [data-v-popper-escaped], .o-popup-content').forEach((el) => el.remove());
};

const OPTIONS = [
  { label: 'Apple', value: 'a' },
  { label: 'Banana', value: 'b' },
  { label: 'Cherry', value: 'c' },
  { label: 'Durian', value: 'd' },
];

describe('多选 Tag 状态 — input 渲染', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('Dropdown 关闭时 — tags-wrap 内无 input 元素', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a'],
        filterable: true,
        options: OPTIONS,
      },
    });
    await flush();
    // 已有选中项 → 走 v-else 分支，渲染 tags-wrap
    const tagsWrap = screen.container.querySelector('.o-select-tags-wrap');
    expect(tagsWrap).not.toBeNull();
    // dropdown 未展开 → input 不应在 DOM 中
    const inputInTags = tagsWrap!.querySelector('.o-select-input');
    expect(inputInTags).toBeNull();
  });

  test('Dropdown 展开时 — tags-wrap 内有 input 元素', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a'],
        filterable: true,
        options: OPTIONS,
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    // dropdown 展开后 → input 应出现在 DOM 中
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    expect(input).not.toBeNull();
  });
});

describe('多选 Tag 状态 — Input 可编辑性', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('filterable=true — input 无 readonly 属性', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a'],
        filterable: true,
        options: OPTIONS,
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    expect(input.hasAttribute('readonly')).toBe(false);
  });

  test('filterable=false 且无 allowCreate — 不渲染 input（避免换行）', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a'],
        filterable: false,
        options: OPTIONS,
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    // filterable=false 且无 allowCreate → input 不应在 DOM 中（避免无意义的 readonly input 撑宽导致换行）
    const inputWrap = screen.container.querySelector('.o-select-tag-input-wrap');
    expect(inputWrap).toBeNull();
  });

  test('filterable=false + allowCreate=true — input 可编辑（无 readonly）', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a'],
        filterable: false,
        allowCreate: true,
        options: OPTIONS,
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    // allowCreate=true 时 input 需要可编辑以输入新值，即使 filterable=false
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.hasAttribute('readonly')).toBe(false);
  });
});

describe('多选 Tag 状态 — 搜索功能', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('展开后输入搜索词 — 下拉选项被过滤', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a'],
        filterable: true,
        options: OPTIONS,
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    // 初始 4 个选项
    expect(document.querySelectorAll('.o-option').length).toBe(4);
    // 输入 "ba" 过滤（只匹配 Banana）
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    await userEvent.type(input, 'ba');
    await flush();
    const filtered = document.querySelectorAll('.o-option');
    expect(filtered.length).toBe(1);
    expect(filtered[0].textContent).toContain('Banana');
  });
});

describe('多选 Tag 状态 — 创建功能', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('展开后输入新值 — 下拉显示创建项', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a'],
        filterable: true,
        allowCreate: true,
        createLabel: (input: string) => `创建 "${input}"`,
        options: OPTIONS,
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    await userEvent.type(input, 'xyz');
    await flush();
    const createOption = document.querySelector('.o-select-create-option');
    expect(createOption).not.toBeNull();
    expect(createOption?.textContent).toContain('xyz');
  });

  test('点击创建项 — emit create + update:modelValue', async () => {
    const onCreate = vi.fn();
    const onUpdate = vi.fn();
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a'],
        filterable: true,
        allowCreate: true,
        createLabel: (input: string) => `创建 "${input}"`,
        'onUpdate:modelValue': onUpdate,
        onCreate,
        options: OPTIONS,
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    await userEvent.type(input, 'newitem');
    await flush();
    const createOpt = document.querySelector('.o-select-create-option') as HTMLElement;
    expect(createOpt).not.toBeNull();
    await createOpt.click();
    await flush();
    // emit create 参数为 'newitem'
    expect(onCreate).toHaveBeenCalledWith('newitem');
    // emit update:modelValue 参数为 ['a', 'newitem']（已有 a + 新创建）
    expect(onUpdate).toHaveBeenCalledWith(['a', 'newitem']);
  });
});

describe('多选 Tag 状态 — displayInputValue', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('展开后 input value 为空（不回填第一个选中项 label）', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a'],
        filterable: true,
        options: OPTIONS,
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    // input value 应为空，而非 'Apple'（第一个选中项的 label）
    expect(input.value).toBe('');
  });
});

describe('多选 Tag 状态 — 最小宽度', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('展开后 wrapper 的 min-width 解析为 80px', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a'],
        filterable: true,
        options: OPTIONS,
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const wrapper = screen.container.querySelector('.o-select-tag-input-wrap') as HTMLElement;
    expect(wrapper).not.toBeNull();
    const minWidth = getComputedStyle(wrapper).minWidth;
    expect(parseFloat(minWidth)).toBe(80);
  });
});

describe('多选 Tag 状态 — input wrapper 撑满剩余空间', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('maxTagCount=responsive + 展开后 input wrapper 撑满行内剩余空间', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a'],
        filterable: true,
        maxTagCount: 'responsive',
        options: OPTIONS,
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    // 固定宽度 300px，使 tag 之外有充足剩余空间
    selectEl.style.width = '300px';
    await selectEl.click();
    await flush();

    const wrap = screen.container.querySelector('.o-select-tags-wrap') as HTMLElement;
    const inputWrap = wrap.querySelector('.o-select-tag-input-wrap') as HTMLElement;

    const wrapRect = wrap.getBoundingClientRect();
    const inputWrapRect = inputWrap.getBoundingClientRect();

    // flex-grow: 1 → wrapper 宽度远超 min-width 80px，撑满剩余空间
    expect(inputWrapRect.width).toBeGreaterThan(80);
    // wrapper 右边缘接近 tags-wrap 右边缘（误差 < 5px）
    expect(wrapRect.right - inputWrapRect.right).toBeLessThan(5);
  });
});

describe('多选 Tag 状态 — 焦点管理', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('展开后 input 自动获得焦点', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a'],
        filterable: true,
        options: OPTIONS,
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    expect(document.activeElement).toBe(input);
  });

  test('多选首次选中后 input 仍持有焦点', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        filterable: true,
        options: OPTIONS,
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    // 无选中项 → 走 v-if 分支，input 存在
    const inputBefore = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    await inputBefore.focus();
    await flush();
    // 点击第一个选项（v-if → v-else 分支切换）
    const firstOption = document.querySelectorAll('.o-option')[0] as HTMLElement;
    await firstOption.click();
    await flush();
    // 首次选中后 input 应重新获得焦点（新挂载的 v-else 分支 input）
    const inputAfter = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    expect(inputAfter).not.toBeNull();
    expect(document.activeElement).toBe(inputAfter);
  });
});

describe('多选 Tag 状态 — 响应式折叠预留', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('maxTagCount=responsive + 展开后 input wrapper 可见宽度 >= 80px', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a', 'b', 'c'],
        filterable: true,
        maxTagCount: 'responsive',
        options: OPTIONS,
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const wrapper = screen.container.querySelector('.o-select-tag-input-wrap') as HTMLElement;
    expect(wrapper).not.toBeNull();
    const rect = wrapper.getBoundingClientRect();
    expect(rect.width).toBeGreaterThanOrEqual(80);
  });
});

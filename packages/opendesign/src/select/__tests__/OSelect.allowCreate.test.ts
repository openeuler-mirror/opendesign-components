/**
 * OSelect 创建选项契约测试。
 *
 * 验证 `allowCreate` / `autoTagInMultiple` / `createLabel` 及 `create` 事件：
 *   1. allowCreate=true 时输入不存在的值显示创建项
 *   2. 点击创建项 emit create + update:modelValue
 *   3. allowCreate=false（默认）无创建入口
 *   4. autoTagInMultiple=true + multiple 自动开启创建
 *   5. createLabel 自定义文案
 *   6. 输入已存在的 value 不显示创建项
 *
 * 测试先行：本文件先于 allowCreate prop 实现编写，预期除「非 breaking 回归」组外全部失败。
 */
import { test, expect, describe, vi, afterEach, beforeEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { userEvent } from 'vitest/browser';
import { h } from 'vue';
import OSelect from '../OSelect.vue';
import OOption from '../../option/OOption.vue';
import type { SelectOptionData } from '../types';
import { flush } from '../../../__tests__/_helpers/dom';
import { setViewport } from '../../../__tests__/_helpers/viewport';

const cleanupBodyPopups = () => {
  document.body.querySelectorAll('.o-options-popup, .o-select-options, [data-v-popper-escaped], .o-popup-content').forEach((el) => el.remove());
};

describe('创建选项 — allowCreate 基本行为', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('allowCreate=true + 输入不存在的值 — 下拉显示创建项', async () => {
    const screen = render(OSelect, {
      props: {
        filterable: true,
        allowCreate: true,
        createLabel: (input: string) => `创建 "${input}"`,
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
    // 创建项应出现在下拉中，文本包含 '创建 "xyz"'
    const createOption = document.querySelector('.o-select-create-option');
    expect(createOption).not.toBeNull();
    expect(createOption?.textContent).toContain('xyz');
  });

  test('allowCreate=true + 点击创建项 — emit create + update:modelValue', async () => {
    const onCreate = vi.fn();
    const onUpdate = vi.fn();
    const screen = render(OSelect, {
      props: {
        filterable: true,
        allowCreate: true,
        createLabel: (input: string) => `创建 "${input}"`,
        'onUpdate:modelValue': onUpdate,
        onCreate,
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
    await userEvent.type(input, 'newitem');
    await flush();
    // 点击创建项
    const createOption = document.querySelector('.o-select-create-option') as HTMLElement;
    expect(createOption).not.toBeNull();
    await createOption.click();
    await flush();
    // emit create 参数为 'newitem'
    expect(onCreate).toHaveBeenCalledWith('newitem');
    // emit update:modelValue 参数为 'newitem'
    expect(onUpdate).toHaveBeenCalledWith('newitem');
  });

  test('allowCreate=true + 输入已存在的 value — 不显示创建项', async () => {
    const screen = render(OSelect, {
      props: {
        filterable: true,
        allowCreate: true,
        createLabel: (input: string) => `创建 "${input}"`,
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
    // 输入 'a'（等于已有 option 的 value）
    await userEvent.type(input, 'a');
    await flush();
    // 'a' 已在 options 中，不应显示创建项
    const createOption = document.querySelector('.o-select-create-option');
    expect(createOption).toBeNull();
  });
});

describe('创建选项 — autoTagInMultiple', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('autoTagInMultiple=true + multiple=true — 自动开启创建', async () => {
    const screen = render(OSelect, {
      props: {
        filterable: true,
        multiple: true,
        autoTagInMultiple: true,
        createLabel: (input: string) => `创建 "${input}"`,
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
    await userEvent.type(input, 'newtag');
    await flush();
    // autoTagInMultiple=true + multiple 应自动开启创建
    const createOption = document.querySelector('.o-select-create-option');
    expect(createOption).not.toBeNull();
  });

  test('autoTagInMultiple 不传 + multiple=true — 无创建入口', async () => {
    const screen = render(OSelect, {
      props: {
        filterable: true,
        multiple: true,
        createLabel: (input: string) => `创建 "${input}"`,
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
    await userEvent.type(input, 'newtag');
    await flush();
    // 不传 autoTagInMultiple，多选模式也不应有创建入口
    const createOption = document.querySelector('.o-select-create-option');
    expect(createOption).toBeNull();
  });
});

describe('创建选项 — createLabel 自定义', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('createLabel 自定义 — 创建项使用自定义文案', async () => {
    const screen = render(OSelect, {
      props: {
        filterable: true,
        allowCreate: true,
        createLabel: (input: string) => `添加: ${input}`,
        options: [{ label: 'A', value: 'a' }],
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
    expect(createOption?.textContent).toContain('添加: xyz');
  });
});

// ============================================================================
// 创建项持久化：创建选项后失焦重新展开，创建项应作为普通选项出现在面板中
// ============================================================================

describe('创建选项 — 创建项持久化', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('单选 allowCreate — 创建选项后重新展开面板，创建项仍可见', async () => {
    const screen = render(OSelect, {
      props: {
        filterable: true,
        allowCreate: true,
        createLabel: (input: string) => `创建 "${input}"`,
        options: [
          { label: 'Apple', value: 'a' },
          { label: 'Banana', value: 'b' },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;

    // 1. 展开下拉
    await selectEl.click();
    await flush();

    // 2. 输入不存在的值，点击创建项
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    await userEvent.type(input, 'newitem');
    await flush();
    const createOpt = document.querySelector('.o-select-create-option') as HTMLElement;
    expect(createOpt).not.toBeNull();
    await createOpt.click();
    await flush();

    // 3. 单选自动关闭下拉，重新展开
    await selectEl.click();
    await flush();

    // 4. 创建的选项应作为普通选项出现在面板中（不再是创建项，而是普通选项）
    const options = document.querySelectorAll('.o-option');
    const found = Array.from(options).some((o) => o.textContent?.includes('newitem'));
    expect(found).toBe(true);
    // 不应再显示创建项（因为值已存在于选项列表中）
    const createOptionAfterReopen = document.querySelector('.o-select-create-option');
    expect(createOptionAfterReopen).toBeNull();
  });

  test('多选 allowCreate — 创建选项后重新展开面板，创建项可见且标记为已选', async () => {
    const screen = render(OSelect, {
      props: {
        filterable: true,
        multiple: true,
        allowCreate: true,
        createLabel: (input: string) => `创建 "${input}"`,
        options: [
          { label: 'Apple', value: 'a' },
          { label: 'Banana', value: 'b' },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;

    // 1. 展开下拉
    await selectEl.click();
    await flush();

    // 2. 输入不存在的值，点击创建项
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    await userEvent.type(input, 'newtag');
    await flush();
    const createOpt = document.querySelector('.o-select-create-option') as HTMLElement;
    expect(createOpt).not.toBeNull();
    await createOpt.click();
    await flush();

    // 3. 多选不自动关闭，点击外部关闭下拉
    await document.body.click();
    await flush();

    // 4. 重新展开下拉
    await selectEl.click();
    await flush();

    // 5. 创建的选项应出现在面板中且标记为已选
    const options = document.querySelectorAll('.o-option');
    const createdOpt = Array.from(options).find((o) => o.textContent?.includes('newtag'));
    expect(createdOpt).toBeDefined();
    // 已选项应有 active 标记
    expect(createdOpt?.querySelector('.o-option-item')?.classList.contains('active')).toBe(true);
  });

  test('单选 allowCreate — 创建后输入框显示原始值而非创建项文案', async () => {
    const screen = render(OSelect, {
      props: {
        filterable: true,
        allowCreate: true,
        createLabel: (input: string) => `创建 "${input}"`,
        options: [{ label: 'Apple', value: 'a' }],
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
    await createOpt.click();
    await flush();

    // 创建后输入框应显示 "newitem"（原始值），而非 '创建 "newitem"'（创建项文案）
    expect((input as HTMLInputElement).value).toBe('newitem');
  });

  test('多选 allowCreate + createLabel — 创建后 tag 显示原始值而非创建项文案', async () => {
    const screen = render(OSelect, {
      props: {
        filterable: true,
        multiple: true,
        allowCreate: true,
        createLabel: (input: string) => `➕ 添加: ${input}`,
        options: [{ label: 'Apple', value: 'a' }],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    await userEvent.type(input, 'Rust');
    await flush();
    const createOpt = document.querySelector('.o-select-create-option') as HTMLElement;
    await createOpt.click();
    await flush();

    // tag 文本应显示 "Rust"（原始值），而非 "➕ 添加: Rust"（创建项文案）
    const tags = screen.container.querySelectorAll('.o-select-tag');
    const tagText = tags[0]?.textContent?.trim() ?? '';
    expect(tagText).toBe('Rust');
  });
});

// ============================================================================
// 非 breaking 回归：allowCreate 不传（默认 false）时，无创建入口
// ============================================================================

describe('非 breaking 回归 — allowCreate=false 时无创建入口', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('不传 allowCreate — 输入不存在的值无创建项', async () => {
    const screen = render(OSelect, {
      props: {
        filterable: true,
        createLabel: (input: string) => `创建 "${input}"`,
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
    const createOption = document.querySelector('.o-select-create-option');
    expect(createOption).toBeNull();
  });

  test('不传 allowCreate — 点击选项正常 emit 值（无 create 事件）', async () => {
    const onCreate = vi.fn();
    const onUpdate = vi.fn();
    const screen = render(OSelect, {
      props: {
        filterable: true,
        'onUpdate:modelValue': onUpdate,
        onCreate,
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
    expect(onCreate).not.toHaveBeenCalled();
  });
});

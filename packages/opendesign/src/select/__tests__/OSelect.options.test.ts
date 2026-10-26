/**
 * OSelect 数据驱动契约测试（options + fieldNames）。
 *
 * 验证 `options` prop 数据驱动模式与 `fieldNames` 字段名定制：
 *   1. 扁平 options 渲染选项列表
 *   2. 分组 options（{ type: 'group', children }）渲染分组
 *   3. options 动态更新时已选值 label 自动同步
 *   4. options + 插槽共存时插槽优先（红线 9：不合并渲染）
 *   5. fieldNames 自定义字段名映射
 *   6. 非 breaking 回归：不传 options / fieldNames 时插槽模式行为零变化
 *
 * 测试先行：本文件先于 options prop 实现编写，预期除「非 breaking 回归」组外全部失败。
 */
import { test, expect, describe, vi, afterEach, beforeEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, ref } from 'vue';
import OSelect from '../OSelect.vue';
import OOption from '../../option/OOption.vue';
import { OOptionGroup } from '../../option';
import { flush } from '../../../__tests__/_helpers/dom';
import { setViewport } from '../../../__tests__/_helpers/viewport';

const cleanupBodyPopups = () => {
  document.body.querySelectorAll('.o-options-popup, .o-select-options, [data-v-popper-escaped], .o-popup-content').forEach((el) => el.remove());
};

describe('options prop — 扁平数据驱动', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('传 options prop（无插槽）— 展开后渲染对应数量的 .o-option', async () => {
    const screen = render(OSelect, {
      props: {
        options: [
          { label: '选项A', value: 'a' },
          { label: '选项B', value: 'b' },
          { label: '选项C', value: 'c' },
        ],
      },
    });
    await flush();
    // 点击展开下拉
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    // 验证：3 个选项渲染在 DOM 中
    const options = document.querySelectorAll('.o-option');
    expect(options.length).toBe(3);
    // 验证内容
    const labels = Array.from(options).map((o) => o.textContent);
    expect(labels).toContain('选项A');
    expect(labels).toContain('选项B');
    expect(labels).toContain('选项C');
  });

  test('传 options prop + modelValue — input 显示对应 label', async () => {
    const screen = render(OSelect, {
      props: {
        modelValue: 'b',
        options: [
          { label: 'Label A', value: 'a' },
          { label: 'Label B', value: 'b' },
        ],
      },
    });
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    expect(input.value).toBe('Label B');
  });

  test('传 options prop + modelValue=0 — falsy 值也能匹配 label', async () => {
    const screen = render(OSelect, {
      props: {
        modelValue: 0,
        options: [{ label: 'Zero', value: 0 }],
      },
    });
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    expect(input.value).toBe('Zero');
  });

  test('点击 options 中的选项 — emit update:modelValue + change', async () => {
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    const screen = render(OSelect, {
      props: {
        'onUpdate:modelValue': onUpdate,
        onChange,
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
    const optionB = Array.from(options).find((o) => o.textContent?.includes('B')) as HTMLElement;
    await optionB.click();
    await flush();
    expect(onUpdate).toHaveBeenCalledWith('b');
    expect(onChange).toHaveBeenCalledWith('b', expect.anything());
  });
});

describe('options prop — 分组数据', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('传分组 options（{ type: "group", children }）— 渲染 OOptionGroup + 子选项', async () => {
    const screen = render(OSelect, {
      props: {
        options: [
          {
            type: 'group' as const,
            key: 'g1',
            label: 'Group 1',
            children: [
              { label: 'A', value: 'a' },
              { label: 'B', value: 'b' },
            ],
          },
          {
            type: 'group' as const,
            key: 'g2',
            label: 'Group 2',
            children: [{ label: 'C', value: 'c' }],
          },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    // 验证分组渲染
    const groups = document.querySelectorAll('.o-option-group');
    expect(groups.length).toBe(2);
    const groupNames = Array.from(groups).map((g) => g.querySelector('.o-option-group-name')?.textContent);
    expect(groupNames).toContain('Group 1');
    expect(groupNames).toContain('Group 2');
    // 验证子选项
    const options = document.querySelectorAll('.o-option');
    expect(options.length).toBe(3);
  });
});

describe('options prop — 动态更新', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('options 变化时已选值 label 自动更新', async () => {
    const screen = render(OSelect, {
      props: {
        modelValue: 'a',
        options: [{ label: 'Old Label', value: 'a' }],
      },
    });
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    expect(input.value).toBe('Old Label');
    // 动态更新 options，label 变化
    await screen.rerender({
      options: [{ label: 'New Label', value: 'a' }],
    });
    await flush();
    expect(input.value).toBe('New Label');
  });
});

describe('options prop — 与插槽共存（插槽优先）', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('同时传 options + 默认插槽 — 插槽优先，options 被忽略', async () => {
    const screen = render(OSelect, {
      props: {
        options: [
          { label: 'Opt A', value: 'opt-a' },
          { label: 'Opt B', value: 'opt-b' },
          { label: 'Opt C', value: 'opt-c' },
        ],
      },
      slots: {
        default: () => [h(OOption, { value: 'slot-a', label: 'Slot A' }), h(OOption, { value: 'slot-b', label: 'Slot B' })],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    // 插槽优先：只有 2 个选项（插槽的），不是 5 个（合并的）
    const options = document.querySelectorAll('.o-option');
    expect(options.length).toBe(2);
    const labels = Array.from(options).map((o) => o.textContent);
    expect(labels).toContain('Slot A');
    expect(labels).toContain('Slot B');
    // options 的数据不应出现在 DOM 中
    expect(labels).not.toContain('Opt A');
  });
});

describe('fieldNames — 字段名定制', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('传 fieldNames + options — 自定义字段名正确映射', async () => {
    const screen = render(OSelect, {
      props: {
        fieldNames: { label: 'name', value: 'code', disabled: 'isForbidden' },
        options: [
          { name: '选项A', code: 1, isForbidden: false },
          { name: '选项B', code: 2, isForbidden: false },
          { name: '选项C', code: 3, isForbidden: true },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const options = document.querySelectorAll('.o-option');
    expect(options.length).toBe(3);
    const labels = Array.from(options).map((o) => o.textContent);
    expect(labels).toContain('选项A');
    expect(labels).toContain('选项B');
    expect(labels).toContain('选项C');
  });

  test('传 fieldNames + options + modelValue — input 显示自定义字段 label', async () => {
    const screen = render(OSelect, {
      props: {
        modelValue: 2,
        fieldNames: { label: 'name', value: 'code' },
        options: [
          { name: '选项A', code: 1 },
          { name: '选项B', code: 2 },
        ],
      },
    });
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    expect(input.value).toBe('选项B');
  });

  test('传 fieldNames + options — 点击选项 emit 自定义字段 value', async () => {
    const onUpdate = vi.fn();
    const screen = render(OSelect, {
      props: {
        'onUpdate:modelValue': onUpdate,
        fieldNames: { label: 'name', value: 'code' },
        options: [
          { name: 'A', code: 100 },
          { name: 'B', code: 200 },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const options = document.querySelectorAll('.o-option');
    const optionB = Array.from(options).find((o) => o.textContent?.includes('B')) as HTMLElement;
    await optionB.click();
    await flush();
    expect(onUpdate).toHaveBeenCalledWith(200);
  });

  test('fieldNames 分组字段 — children 映射自定义', async () => {
    const screen = render(OSelect, {
      props: {
        fieldNames: { children: 'items', label: 'title', value: 'id' },
        options: [
          {
            type: 'group' as const,
            key: 'g1',
            title: '分组1',
            items: [
              { title: '项A', id: 'a' },
              { title: '项B', id: 'b' },
            ],
          },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const groups = document.querySelectorAll('.o-option-group');
    expect(groups.length).toBe(1);
    expect(groups[0].querySelector('.o-option-group-name')?.textContent).toBe('分组1');
    const options = document.querySelectorAll('.o-option');
    expect(options.length).toBe(2);
  });
});

describe('fieldNames — 插槽模式不生效', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('传 fieldNames 但用插槽 — OOption 用固定 props，fieldNames 不介入', async () => {
    const screen = render(OSelect, {
      props: {
        fieldNames: { label: 'name', value: 'code' },
      },
      slots: {
        default: () => [h(OOption, { value: 'a', label: 'Slot A' }), h(OOption, { value: 'b', label: 'Slot B' })],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    // 插槽模式下 OOption 用固定 label/value props，fieldNames 不介入
    const options = document.querySelectorAll('.o-option');
    expect(options.length).toBe(2);
    const labels = Array.from(options).map((o) => o.textContent);
    expect(labels).toContain('Slot A');
    expect(labels).toContain('Slot B');
  });
});

// ============================================================================
// 非 breaking 回归：不传 options / fieldNames 时，插槽模式行为零变化
// 这些用例在 options prop 实现前就应该通过，验证现有行为不被破坏。
// ============================================================================

describe('非 breaking 回归 — 不传 options/fieldNames 时插槽模式零变化', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('不传 options — 插槽 OOption 正常渲染', async () => {
    const screen = render(OSelect, {
      slots: {
        default: () => [h(OOption, { value: 'a', label: 'A' }), h(OOption, { value: 'b', label: 'B' })],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const options = document.querySelectorAll('.o-option');
    expect(options.length).toBe(2);
  });

  test('不传 options — modelValue + 插槽 input 显示 label', async () => {
    const screen = render(OSelect, {
      props: { modelValue: 'b' },
      slots: {
        default: () => [h(OOption, { value: 'a', label: 'Label A' }), h(OOption, { value: 'b', label: 'Label B' })],
      },
    });
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    expect(input.value).toBe('Label B');
  });

  test('不传 options — 点击插槽选项 emit 正确值', async () => {
    const onUpdate = vi.fn();
    const screen = render(OSelect, {
      props: { 'onUpdate:modelValue': onUpdate },
      slots: {
        default: () => [h(OOption, { value: 'a', label: 'A' }), h(OOption, { value: 'b', label: 'B' })],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const options = document.querySelectorAll('.o-option');
    const optionB = Array.from(options).find((o) => o.textContent?.includes('B')) as HTMLElement;
    await optionB.click();
    await flush();
    expect(onUpdate).toHaveBeenCalledWith('b');
  });
});

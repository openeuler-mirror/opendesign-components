/**
 * OSelect 渲染函数测试（renderLabel / renderTag / #option-label 插槽）。
 *
 * 验证渲染函数与插槽优先级：
 *   1. renderLabel — options 模式下自定义选项 label
 *   2. renderTag — 自定义多选 tag
 *   3. #option-label 插槽 — renderLabel 的插槽等价物
 *   4. 与插槽共存时插槽优先（dev warn）
 *   5. 非 breaking 回归：不传 render 函数时行为不变
 *   6. DOM 结构兼容：input.o-select-input 为 .o-select 直接子元素（消费者直接子选择器），
 *      renderLabel / #option-label overlay 蒙层与 input 区域对齐
 */
import { test, expect, describe, vi, afterEach, beforeEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OSelect from '../OSelect.vue';
import OOption from '../../option/OOption.vue';
import type { SelectOptionData } from '../types';
import { flush } from '../../../__tests__/_helpers/dom';
import { setViewport } from '../../../__tests__/_helpers/viewport';

const cleanupBodyPopups = () => {
  document.body.querySelectorAll('.o-options-popup, .o-select-options, [data-v-popper-escaped], .o-popup-content').forEach((el) => el.remove());
};

describe('renderLabel', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('renderLabel 自定义选项 label 内容', async () => {
    const screen = render(OSelect, {
      props: {
        options: [
          { label: 'Apple', value: 'a' },
          { label: 'Banana', value: 'b' },
        ],
        renderLabel: (option: any, selected: boolean) => {
          return h('span', { class: 'custom-label' }, `${option.label}${selected ? ' ✓' : ''}`);
        },
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const customLabels = document.querySelectorAll('.custom-label');
    expect(customLabels.length).toBe(2);
    expect(customLabels[0].textContent).toContain('Apple');
  });

  test('renderLabel + 已选值 — selected 参数为 true', async () => {
    const screen = render(OSelect, {
      props: {
        modelValue: 'a',
        options: [{ label: 'Apple', value: 'a' }],
        renderLabel: (option: any, selected: boolean) => {
          return h('span', { class: selected ? 'selected' : 'not-selected' }, option.label);
        },
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const selectedEl = document.querySelector('.selected');
    expect(selectedEl).not.toBeNull();
    expect(selectedEl?.textContent).toBe('Apple');
  });

  test('renderLabel 入参保留选项的自定义字段（非虚拟模式）', async () => {
    const screen = render(OSelect, {
      props: {
        options: [
          { value: 'a', label: 'Apple', icon: 'icon-apple', iconColor: 'red' },
          { value: 'b', label: 'Banana', icon: 'icon-banana', iconColor: 'yellow' },
        ],
        renderLabel: (option: any) => {
          return h('span', { class: 'custom-label', 'data-icon': option.icon, 'data-color': option.iconColor }, option.label);
        },
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const customLabels = document.querySelectorAll('.custom-label');
    expect(customLabels.length).toBe(2);
    // 自定义字段应完整透传到 renderLabel，不被 optionData 重建时丢弃
    expect(customLabels[0].getAttribute('data-icon')).toBe('icon-apple');
    expect(customLabels[0].getAttribute('data-color')).toBe('red');
    expect(customLabels[1].getAttribute('data-icon')).toBe('icon-banana');
    expect(customLabels[1].getAttribute('data-color')).toBe('yellow');
  });

  test('renderLabel 入参保留分组子项的自定义字段（非虚拟模式）', async () => {
    const screen = render(OSelect, {
      props: {
        options: [
          {
            type: 'group' as const,
            key: 'g1',
            label: 'Fruits',
            children: [
              { value: 'a', label: 'Apple', icon: 'icon-apple' },
              { value: 'b', label: 'Banana', icon: 'icon-banana' },
            ],
          },
        ],
        renderLabel: (option: any) => {
          return h('span', { class: 'grouped-label', 'data-icon': option.icon }, option.label);
        },
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const groupedLabels = document.querySelectorAll('.grouped-label');
    expect(groupedLabels.length).toBe(2);
    expect(groupedLabels[0].getAttribute('data-icon')).toBe('icon-apple');
    expect(groupedLabels[1].getAttribute('data-icon')).toBe('icon-banana');
  });

  test('renderLabel 入参保留选项的自定义字段（虚拟模式）', async () => {
    const screen = render(OSelect, {
      props: {
        virtual: true,
        options: [
          { value: 'a', label: 'Apple', icon: 'icon-apple', iconColor: 'red' },
          { value: 'b', label: 'Banana', icon: 'icon-banana', iconColor: 'yellow' },
        ],
        renderLabel: (option: any) => {
          return h('span', { class: 'virtual-custom-label', 'data-icon': option.icon, 'data-color': option.iconColor }, option.label);
        },
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const customLabels = document.querySelectorAll('.virtual-custom-label');
    expect(customLabels.length).toBe(2);
    expect(customLabels[0].getAttribute('data-icon')).toBe('icon-apple');
    expect(customLabels[0].getAttribute('data-color')).toBe('red');
    expect(customLabels[1].getAttribute('data-icon')).toBe('icon-banana');
    expect(customLabels[1].getAttribute('data-color')).toBe('yellow');
  });
});

describe('renderTag', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('renderTag 自定义多选 tag 内容', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a'],
        options: [
          { label: 'Apple', value: 'a' },
          { label: 'Banana', value: 'b' },
        ],
        renderTag: (option: SelectOptionData, onClose: () => void) => {
          return h('span', { class: 'custom-tag' }, [`Tag: ${option.label}`, h('button', { class: 'custom-close', onClick: onClose }, 'x')]);
        },
      },
    });
    await flush();
    const customTags = screen.container.querySelectorAll('.custom-tag');
    expect(customTags.length).toBe(1);
    expect(customTags[0].textContent).toContain('Tag: Apple');
  });

  test('renderTag onClose 回调 — 点击后移除 tag', async () => {
    const onRemoveTag = vi.fn();
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a', 'b'],
        onRemoveTag,
        options: [
          { label: 'Apple', value: 'a' },
          { label: 'Banana', value: 'b' },
        ],
        renderTag: (option: SelectOptionData, onClose: () => void) => {
          return h('span', { class: 'custom-tag' }, [option.label, h('button', { class: 'custom-close', onClick: onClose }, 'x')]);
        },
      },
    });
    await flush();
    const customTags = screen.container.querySelectorAll('.custom-tag');
    expect(customTags.length).toBe(2);
    // 点击第一个 tag 的关闭按钮
    const closeBtn = screen.container.querySelector('.custom-close') as HTMLElement;
    await closeBtn.click();
    await flush();
    // remove-tag 事件触发
    expect(onRemoveTag).toHaveBeenCalledWith('a');
    // tag 数量减少
    const tagsAfter = screen.container.querySelectorAll('.custom-tag');
    expect(tagsAfter.length).toBe(1);
  });
});

describe('与插槽共存（插槽优先）', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('renderLabel + 默认插槽 — 插槽优先', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const screen = render(OSelect, {
      props: {
        renderLabel: () => h('span', { class: 'render-label' }, 'from render'),
      },
      slots: {
        default: () => h(OOption, { value: 'a', label: 'from slot' }),
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    // 插槽优先：选项来自 slot，不是 renderLabel
    const renderLabel = document.querySelector('.render-label');
    expect(renderLabel).toBeNull();
    const options = document.querySelectorAll('.o-option');
    expect(options.length).toBe(1);
    expect(options[0].textContent).toContain('from slot');
    // logger.warn 传参为 (prefix, message)，prefix 为 '[OSelect]'，message 含 'renderLabel'
    expect(warnSpy).toHaveBeenCalledWith('[OSelect]', expect.stringContaining('renderLabel'));
    warnSpy.mockRestore();
  });
});

describe('非 breaking 回归', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('不传 render 函数 — options 模式 label 正常显示', async () => {
    const screen = render(OSelect, {
      props: {
        options: [{ label: 'Hello', value: 'a' }],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const options = document.querySelectorAll('.o-option');
    expect(options.length).toBe(1);
    expect(options[0].textContent).toContain('Hello');
  });

  test('不传 render 函数 — 插槽模式行为不变', async () => {
    const screen = render(OSelect, {
      slots: {
        default: () => h(OOption, { value: 'a', label: 'Slot A' }),
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const options = document.querySelectorAll('.o-option');
    expect(options.length).toBe(1);
    expect(options[0].textContent).toContain('Slot A');
  });
});

// ============================================================================
// #option-label 插槽测试
// ============================================================================
describe('#option-label 插槽', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('#option-label 自定义选项 label 内容', async () => {
    const screen = render(OSelect, {
      props: {
        options: [
          { label: 'Apple', value: 'a' },
          { label: 'Banana', value: 'b' },
        ],
      },
      slots: {
        'option-label': ({ option, selected }: any) => h('span', { class: 'slot-label' }, `${option.label}${selected ? ' ✓' : ''}`),
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const slotLabels = document.querySelectorAll('.slot-label');
    expect(slotLabels.length).toBe(2);
    expect(slotLabels[0].textContent).toContain('Apple');
  });

  test('#option-label — 选中值在输入框中渲染', async () => {
    const screen = render(OSelect, {
      props: {
        modelValue: 'a',
        options: [{ label: 'Apple', value: 'a' }],
      },
      slots: {
        'option-label': ({ option }: any) => h('span', { class: 'overlay-label' }, `★ ${option.label}`),
      },
    });
    await flush();
    const overlayLabel = screen.container.querySelector('.overlay-label');
    expect(overlayLabel).not.toBeNull();
    expect(overlayLabel?.textContent).toContain('★ Apple');
  });

  test('#option-label 插槽优先于 renderLabel prop', async () => {
    const screen = render(OSelect, {
      props: {
        options: [{ label: 'Apple', value: 'a' }],
        renderLabel: () => h('span', { class: 'from-prop' }, 'from prop'),
      },
      slots: {
        'option-label': () => h('span', { class: 'from-slot' }, 'from slot'),
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    // 插槽优先：from-slot 存在，from-prop 不存在
    expect(document.querySelector('.from-slot')).not.toBeNull();
    expect(document.querySelector('.from-prop')).toBeNull();
  });

  test('#option-label 虚拟模式 — 入参保留自定义字段', async () => {
    const screen = render(OSelect, {
      props: {
        virtual: true,
        options: [
          { value: 'a', label: 'Apple', icon: 'icon-apple' },
          { value: 'b', label: 'Banana', icon: 'icon-banana' },
        ],
      },
      slots: {
        'option-label': ({ option }: any) => h('span', { class: 'virtual-slot-label', 'data-icon': option.icon }, option.label),
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const slotLabels = document.querySelectorAll('.virtual-slot-label');
    expect(slotLabels.length).toBe(2);
    expect(slotLabels[0].getAttribute('data-icon')).toBe('icon-apple');
    expect(slotLabels[1].getAttribute('data-icon')).toBe('icon-banana');
  });
});

// ============================================================================
// DOM 结构兼容：.o-select-input 必须是 .o-select 的直接子元素（master 结构，
// 消费者可用 .o-select > .o-select-input 直接子选择器自定义样式）；
// overlay 蒙层与 input 区域水平对齐（getBoundingClientRect 断言），
// 保证结构变化不改变 renderLabel / #option-label 的视觉渲染
// ============================================================================
describe('DOM 结构兼容（.o-select > .o-select-input）', () => {
  test('单选默认场景 — input 是 .o-select 的直接子元素', async () => {
    const screen = render(OSelect, {
      props: {
        modelValue: 'a',
        options: [{ label: 'Apple', value: 'a' }],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    const inputEl = selectEl.querySelector('.o-select-input') as HTMLInputElement;
    expect(inputEl).not.toBeNull();
    // 消费者依赖 .o-select > .o-select-input 直接子选择器 → 中间不允许插入包裹层
    expect(inputEl.parentElement).toBe(selectEl);
  });

  test('renderLabel 模式 — overlay 仍渲染且与 input 区域对齐', async () => {
    const screen = render(OSelect, {
      props: {
        modelValue: 'a',
        options: [{ label: 'Apple', value: 'a' }],
        renderLabel: (option: any) => h('span', { class: 'overlay-label' }, `★ ${option.label}`),
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    const inputEl = selectEl.querySelector('.o-select-input') as HTMLInputElement;
    const overlayEl = selectEl.querySelector('.o-select-label-overlay') as HTMLElement;
    expect(overlayEl).not.toBeNull();
    const inputRect = inputEl.getBoundingClientRect();
    const overlayRect = overlayEl.getBoundingClientRect();
    // 水平方向：overlay 左右边界与 input 一致（ellipsis 截断位置相同，不侵入 prefix/suffix 区域）
    expect(Math.abs(overlayRect.left - inputRect.left)).toBeLessThan(1);
    expect(Math.abs(overlayRect.right - inputRect.right)).toBeLessThan(1);
    // 垂直方向：overlay 覆盖 input（overlay 撑满 select 内容区，内容自身垂直居中）
    expect(overlayRect.top).toBeLessThanOrEqual(inputRect.top + 1);
    expect(overlayRect.bottom).toBeGreaterThanOrEqual(inputRect.bottom - 1);
  });

  test('#option-label 插槽模式 — overlay 与 input 区域对齐', async () => {
    const screen = render(OSelect, {
      props: {
        modelValue: 'a',
        options: [{ label: 'Apple', value: 'a' }],
      },
      slots: {
        'option-label': ({ option }: any) => h('span', { class: 'slot-overlay' }, `★ ${option.label}`),
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    const inputEl = selectEl.querySelector('.o-select-input') as HTMLInputElement;
    const overlayEl = selectEl.querySelector('.o-select-label-overlay') as HTMLElement;
    expect(overlayEl).not.toBeNull();
    const inputRect = inputEl.getBoundingClientRect();
    const overlayRect = overlayEl.getBoundingClientRect();
    expect(Math.abs(overlayRect.left - inputRect.left)).toBeLessThan(1);
    expect(Math.abs(overlayRect.right - inputRect.right)).toBeLessThan(1);
  });

  test('带 #prefix 插槽 — overlay 仍与 input 区域对齐（input 起点右移后跟随）', async () => {
    const screen = render(OSelect, {
      props: {
        modelValue: 'a',
        options: [{ label: 'Apple', value: 'a' }],
        renderLabel: (option: any) => h('span', { class: 'overlay-label' }, `★ ${option.label}`),
      },
      slots: {
        prefix: () => h('span', { class: 'select-prefix-icon' }, '🔍'),
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    const inputEl = selectEl.querySelector('.o-select-input') as HTMLInputElement;
    const overlayEl = selectEl.querySelector('.o-select-label-overlay') as HTMLElement;
    expect(overlayEl).not.toBeNull();
    const inputRect = inputEl.getBoundingClientRect();
    const overlayRect = overlayEl.getBoundingClientRect();
    expect(Math.abs(overlayRect.left - inputRect.left)).toBeLessThan(1);
    expect(Math.abs(overlayRect.right - inputRect.right)).toBeLessThan(1);
  });
});

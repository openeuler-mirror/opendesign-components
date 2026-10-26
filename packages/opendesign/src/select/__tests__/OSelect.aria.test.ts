/**
 * OSelect ARIA 无障碍契约测试。
 *
 * 验证 input 的 role/aria-* 属性、选项容器的 role='listbox'、
 * 选项的 role='option'/aria-selected，以及 disabled 状态的 aria-disabled。
 *
 * 组织原则：
 *   1. input ARIA：role='combobox' / aria-haspopup / aria-expanded / aria-controls
 *   2. 选项容器：role='listbox'
 *   3. 选项：role='option' / aria-selected
 *   4. disabled：aria-disabled
 *
 * 测试先行：本文件先于 ARIA 属性实现编写，预期全部失败。
 */
import { test, expect, describe, afterEach, beforeEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OSelect from '../OSelect.vue';
import OOption from '../../option/OOption.vue';
import { flush } from '../../../__tests__/_helpers/dom';
import { setViewport } from '../../../__tests__/_helpers/viewport';

const cleanupBodyPopups = () => {
  document.body.querySelectorAll('.o-options-popup, .o-select-options, [data-v-popper-escaped], .o-popup-content').forEach((el) => el.remove());
};

describe('ARIA — input 属性', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('input 设 role="combobox"', async () => {
    const screen = render(OSelect, {
      props: { options: [{ label: 'A', value: 'a' }] },
    });
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLElement;
    expect(input.getAttribute('role')).toBe('combobox');
  });

  test('input 设 aria-haspopup="listbox"', async () => {
    const screen = render(OSelect, {
      props: { options: [{ label: 'A', value: 'a' }] },
    });
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLElement;
    expect(input.getAttribute('aria-haspopup')).toBe('listbox');
  });

  test('input 设 aria-expanded 反映展开状态（初始 false）', async () => {
    const screen = render(OSelect, {
      props: { options: [{ label: 'A', value: 'a' }] },
    });
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLElement;
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  test('input 设 aria-expanded 反映展开状态（展开后 true）', async () => {
    const screen = render(OSelect, {
      props: { options: [{ label: 'A', value: 'a' }] },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLElement;
    expect(input.getAttribute('aria-expanded')).toBe('true');
  });

  test('input 设 aria-controls 指向选项容器 id', async () => {
    const screen = render(OSelect, {
      props: { options: [{ label: 'A', value: 'a' }] },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLElement;
    const ariaControls = input.getAttribute('aria-controls');
    expect(ariaControls).toBeTruthy();
    // aria-controls 指向的元素应存在且 role='listbox'
    const listbox = document.getElementById(ariaControls!);
    expect(listbox).not.toBeNull();
    expect(listbox?.getAttribute('role')).toBe('listbox');
  });
});

describe('ARIA — 选项容器', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('选项容器设 role="listbox"', async () => {
    const screen = render(OSelect, {
      props: { options: [{ label: 'A', value: 'a' }] },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    // 选项列表在 teleport 中，在 document 范围查找
    const listbox = document.querySelector('[role="listbox"]');
    expect(listbox).not.toBeNull();
  });
});

describe('ARIA — 选项', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('选项设 role="option"', async () => {
    const screen = render(OSelect, {
      props: { options: [{ label: 'A', value: 'a' }] },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const option = document.querySelector('.o-option');
    expect(option?.getAttribute('role')).toBe('option');
  });

  test('选项设 aria-selected 反映选中状态（未选 false）', async () => {
    const screen = render(OSelect, {
      props: { options: [{ label: 'A', value: 'a' }] },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const option = document.querySelector('.o-option');
    expect(option?.getAttribute('aria-selected')).toBe('false');
  });

  test('选项设 aria-selected 反映选中状态（已选 true）', async () => {
    const screen = render(OSelect, {
      props: {
        modelValue: 'a',
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
    // 找到 value='a' 的选项（已选），aria-selected 应为 'true'
    const selectedOption = Array.from(options).find((o) => o.textContent?.includes('A'));
    expect(selectedOption?.getAttribute('aria-selected')).toBe('true');
    // 未选的选项 aria-selected 应为 'false'
    const unselectedOption = Array.from(options).find((o) => o.textContent?.includes('B'));
    expect(unselectedOption?.getAttribute('aria-selected')).toBe('false');
  });
});

describe('ARIA — disabled 状态', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('OSelect disabled 时 input 设 aria-disabled', async () => {
    const screen = render(OSelect, {
      props: { disabled: true, options: [{ label: 'A', value: 'a' }] },
    });
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLElement;
    expect(input.getAttribute('aria-disabled')).toBe('true');
  });

  test('OSelect 未 disabled 时 input 无 aria-disabled（或为 false）', async () => {
    const screen = render(OSelect, {
      props: { options: [{ label: 'A', value: 'a' }] },
    });
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLElement;
    const ariaDisabled = input.getAttribute('aria-disabled');
    // 未 disabled 时 aria-disabled 应为 null（属性不存在）或 'false'
    expect(ariaDisabled === null || ariaDisabled === 'false').toBe(true);
  });

  test('OOption disabled 时设 aria-disabled', async () => {
    const screen = render(OSelect, {
      props: {
        options: [
          { label: 'A', value: 'a', disabled: true },
          { label: 'B', value: 'b' },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const options = document.querySelectorAll('.o-option');
    const disabledOption = Array.from(options).find((o) => o.textContent?.includes('A'));
    expect(disabledOption?.getAttribute('aria-disabled')).toBe('true');
    const enabledOption = Array.from(options).find((o) => o.textContent?.includes('B'));
    expect(enabledOption?.getAttribute('aria-disabled')).not.toBe('true');
  });
});

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
 *   5. 名称与高亮项：aria-label / aria-activedescendant
 *   6. 虚拟模式：listbox 子树不夹中间语义层
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

  test('multiple 时选项容器镜像 aria-multiselectable="true"，单选时无该属性', async () => {
    const multi = render(OSelect, {
      props: { options: [{ label: 'A', value: 'a' }], multiple: true },
    });
    await flush();
    const multiEl = multi.container.querySelector('.o-select') as HTMLElement;
    await multiEl.click();
    await flush();
    const listbox = document.querySelector('.o-select-options') as HTMLElement;
    expect(listbox.getAttribute('aria-multiselectable')).toBe('true');
    cleanupBodyPopups();

    const single = render(OSelect, {
      props: { options: [{ label: 'A', value: 'a' }] },
    });
    await flush();
    const singleEl = single.container.querySelector('.o-select') as HTMLElement;
    await singleEl.click();
    await flush();
    // 同一 document 上前一次 multiple 的弹层已被清理，此时 listbox 即单选容器
    const singleListbox = document.querySelector('.o-select-options') as HTMLElement;
    expect(singleListbox.getAttribute('aria-multiselectable')).toBeNull();
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

describe('ARIA — 名称与高亮项', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('ariaLabel 提供可访问名称，未传时回退 placeholder，两者皆无时无属性', async () => {
    // 显式传入：优先于 placeholder
    const screen = render(OSelect, {
      props: { options: [{ label: 'A', value: 'a' }], ariaLabel: '城市', placeholder: '请选择' },
    });
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLElement;
    expect(input.getAttribute('aria-label')).toBe('城市');

    // 未传：回退 placeholder
    const fallback = render(OSelect, {
      props: { options: [{ label: 'A', value: 'a' }], placeholder: '请选择' },
    });
    await flush();
    const fallbackInput = fallback.container.querySelector('.o-select-input') as HTMLElement;
    expect(fallbackInput.getAttribute('aria-label')).toBe('请选择');

    // 皆无：不输出
    const bare = render(OSelect, { props: { options: [{ label: 'A', value: 'a' }] } });
    await flush();
    const bareInput = bare.container.querySelector('.o-select-input') as HTMLElement;
    expect(bareInput.getAttribute('aria-label')).toBeNull();
  });

  test('多选有 tag 时内联搜索框同样获得可访问名称', async () => {
    // 显式 ariaLabel
    const explicit = render(OSelect, {
      props: {
        options: [
          { label: 'Apple', value: 'a' },
          { label: 'Banana', value: 'b' },
        ],
        multiple: true,
        filterable: true,
        modelValue: ['a'],
        ariaLabel: '城市',
      },
    });
    await flush();
    const explicitSelect = explicit.container.querySelector('.o-select') as HTMLElement;
    await explicitSelect.click();
    await flush();
    const explicitInput = explicit.container.querySelector('.o-select-input--tag') as HTMLElement;
    expect(explicitInput).not.toBeNull();
    expect(explicitInput.getAttribute('aria-label')).toBe('城市');
    cleanupBodyPopups();

    // 未传 ariaLabel：回退 placeholder
    const fallback = render(OSelect, {
      props: {
        options: [
          { label: 'Apple', value: 'a' },
          { label: 'Banana', value: 'b' },
        ],
        multiple: true,
        filterable: true,
        modelValue: ['a'],
        placeholder: '请选择',
      },
    });
    await flush();
    const fallbackSelect = fallback.container.querySelector('.o-select') as HTMLElement;
    await fallbackSelect.click();
    await flush();
    const fallbackInput = fallback.container.querySelector('.o-select-input--tag') as HTMLElement;
    expect(fallbackInput.getAttribute('aria-label')).toBe('请选择');
  });

  test('展开后 input 的 aria-activedescendant 指向选中项 id，该 id 存在于 listbox', async () => {
    const screen = render(OSelect, {
      props: {
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
        modelValue: 'b',
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLElement;
    const activeId = input.getAttribute('aria-activedescendant');
    // 指向选中项（b）的 DOM id
    expect(activeId).toBeTruthy();
    const activeOption = document.getElementById(activeId!) as HTMLElement;
    expect(activeOption).toBeTruthy();
    expect(activeOption.getAttribute('role')).toBe('option');
    expect(activeOption.getAttribute('aria-selected')).toBe('true');
    expect(activeOption.textContent).toContain('B');
  });

  test('用户自定义 OOption id 时 aria-activedescendant 指向该 id', async () => {
    // 插槽模式：用户在 OOption 上显式传入 id，activedescendant 应直接指向它
    const screen = render(OSelect, {
      props: { modelValue: 'b' },
      slots: {
        default: () => [h(OOption, { value: 'a', label: 'A', id: 'custom-opt-a' }), h(OOption, { value: 'b', label: 'B', id: 'custom-opt-b' })],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLElement;
    expect(input.getAttribute('aria-activedescendant')).toBe('custom-opt-b');
    const customOption = document.getElementById('custom-opt-b') as HTMLElement;
    expect(customOption.getAttribute('role')).toBe('option');
    expect(customOption.getAttribute('aria-selected')).toBe('true');
  });

  test('未选中值或未展开时不输出 aria-activedescendant', async () => {
    // 无选中值
    const none = render(OSelect, { props: { options: [{ label: 'A', value: 'a' }] } });
    await flush();
    const noneEl = none.container.querySelector('.o-select') as HTMLElement;
    await noneEl.click();
    await flush();
    const noneInput = none.container.querySelector('.o-select-input') as HTMLElement;
    expect(noneInput.getAttribute('aria-activedescendant')).toBeNull();
    cleanupBodyPopups();

    // 有选中但未展开
    const closed = render(OSelect, {
      props: { options: [{ label: 'A', value: 'a' }], modelValue: 'a' },
    });
    await flush();
    const closedInput = closed.container.querySelector('.o-select-input') as HTMLElement;
    expect(closedInput.getAttribute('aria-activedescendant')).toBeNull();
  });
});

describe('ARIA — 虚拟模式 listbox 契约', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('虚拟模式下展开的 listbox 子树中选项直接可达，不夹中间 list/listitem 语义层', async () => {
    const screen = render(OSelect, {
      props: {
        virtual: true,
        options: Array.from({ length: 100 }, (_, i) => ({ label: `选项${i}`, value: i })),
        virtualListProps: { itemSize: 36 },
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const listbox = document.querySelector('.o-select-options[role="listbox"]') as HTMLElement;
    expect(listbox).toBeTruthy();
    // listbox 的语义子节点只能是 option（或分组结构），中间夹 list/listitem
    // 会让读屏把弹层播报为嵌套列表而非选项列表
    expect(listbox.querySelectorAll('[role="list"]').length).toBe(0);
    expect(listbox.querySelectorAll('[role="listitem"]').length).toBe(0);
    // 选项存在于 listbox 子树内
    const options = listbox.querySelectorAll('[role="option"]');
    expect(options.length).toBeGreaterThan(0);
  });
});

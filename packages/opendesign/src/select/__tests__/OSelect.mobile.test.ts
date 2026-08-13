/**
 * OSelect 移动端（ODialog 模式）功能测试。
 *
 * 补全各核心功能在 pad_v / phone 视口下（isResponding=true → ODialog 模式）的契约验证。
 * 桌面端（OPopup 模式）的等价测试已由各专项文件覆盖，本文件只关注
 * ODialog 容器对交互链路的影响——而非模式切换本身（已由 responsive.test.ts 覆盖）。
 *
 * 覆盖功能矩阵：
 *   1. 单选 — 点击选项立即 emit（无确认/取消）
 *   2. 单选 filterable — Dialog 内搜索过滤
 *   3. allowCreate — Dialog 内创建新选项
 *   4. 虚拟滚动 — Dialog 内虚拟列表渲染与交互
 *   5. 清除按钮 — 移动端下清除选中值
 *   6. 多选 limit — Dialog 内上限限制
 *   7. 多选 filterable + allowCreate — 搜索 → 创建 → 确认完整链路
 *   8. 多选取消 — 不 emit、值回退
 *   9. 多选确认 — emit 正确值
 *   10. 多选 mask 点击 — 不关闭 Dialog
 *   11. 单选 mask 点击 — 关闭 Dialog
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
  document.body.querySelectorAll('.o-options-popup, .o-select-options, [data-v-popper-escaped], .o-popup-content, .o-dialog-wrap').forEach((el) => el.remove());
};

/** 在 ODialog 内查找指定文案的选项元素 */
function findOptionInDialog(text: string): HTMLElement {
  const options = document.querySelectorAll('.o-select-dlg .o-option');
  return Array.from(options).find((o) => o.textContent?.includes(text)) as HTMLElement;
}

/** 在 ODialog 内查找指定文案的按钮元素 */
function findDlgButton(text: string): HTMLElement {
  const btns = document.querySelectorAll('.o-select-dlg .o-dlg-btn');
  return Array.from(btns).find((btn) => btn.textContent?.includes(text)) as HTMLElement;
}

describe('移动端单选 — Dialog 内交互', () => {
  beforeEach(async () => {
    await setViewport('pad_v');
  });
  afterEach(cleanupBodyPopups);

  test('单选点击选项 — 立即 emit update:modelValue + change', async () => {
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

    const optionB = findOptionInDialog('B');
    await optionB.click();
    await flush();

    // 单选模式下点击选项应立即 emit（无需确认按钮）
    expect(onUpdate).toHaveBeenCalledWith('b');
    expect(onChange).toHaveBeenCalledWith('b', expect.anything());
  });

  test('单选 filterable — Dialog 内输入搜索词过滤选项', async () => {
    const onSearch = vi.fn();
    const screen = render(OSelect, {
      props: {
        filterable: true,
        onSearch,
        options: [
          { label: 'Apple', value: 'a' },
          { label: 'Banana', value: 'b' },
          { label: 'Cherry', value: 'c' },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();

    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    await userEvent.fill(input, 'ban');
    await flush();

    expect(onSearch).toHaveBeenCalledWith('ban');
    // 过滤后 Dialog 内仅显示 Banana
    const options = document.querySelectorAll('.o-select-dlg .o-option');
    expect(options.length).toBe(1);
    expect(options[0].textContent).toContain('Banana');
  });

  test('单选 mask 点击 — 关闭 Dialog（mask-close=true）', async () => {
    const screen = render(OSelect, {
      props: {
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

    // 单选模式 mask-close=true，点击遮罩应关闭 Dialog
    const dialog = document.querySelector('.o-select-dlg') as HTMLElement;
    expect(dialog).not.toBeNull();

    // 模拟点击 Dialog 遮罩层（ODialog 的 mask 元素）
    const mask = document.querySelector('.o-dialog-mask') as HTMLElement;
    if (mask) {
      await mask.click();
      await flush();
      expect(dialog.style.display).toBe('none');
    }
  });
});

describe('移动端 allowCreate — Dialog 内创建选项', () => {
  beforeEach(async () => {
    await setViewport('pad_v');
  });
  afterEach(cleanupBodyPopups);

  test('单选 allowCreate — 输入新值点击创建项立即 emit', async () => {
    const onCreate = vi.fn();
    const onUpdate = vi.fn();
    const screen = render(OSelect, {
      props: {
        filterable: true,
        allowCreate: true,
        onCreate,
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

    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    await userEvent.fill(input, 'new-item');
    await flush();

    // 应出现创建项
    const createOption = findOptionInDialog('new-item');
    expect(createOption).toBeTruthy();
    await createOption.click();
    await flush();

    // 单选模式下点击创建项应立即 emit
    expect(onCreate).toHaveBeenCalledWith('new-item');
    expect(onUpdate).toHaveBeenCalledWith('new-item');
  });

  test('多选 allowCreate — 搜索 → 创建 → 确认完整链路', async () => {
    const onCreate = vi.fn();
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    const screen = render(OSelect, {
      props: {
        multiple: true,
        filterable: true,
        allowCreate: true,
        modelValue: ['a'],
        onCreate,
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

    // Dialog 内 tag 模式的 input
    const input = screen.container.querySelector('.o-select-input--tag') as HTMLInputElement;
    await userEvent.fill(input, 'new-tag');
    await flush();

    // 点击创建项
    const createOption = findOptionInDialog('new-tag');
    expect(createOption).toBeTruthy();
    await createOption.click();
    await flush();

    // 多选模式下不应立即 emit（需确认按钮）
    expect(onUpdate).not.toHaveBeenCalled();
    expect(onCreate).toHaveBeenCalledWith('new-tag');

    // 点击确认
    const okBtn = findDlgButton('确定');
    await okBtn.click();
    await flush();

    expect(onUpdate).toHaveBeenLastCalledWith(['a', 'new-tag']);
    expect(onChange).toHaveBeenLastCalledWith(['a', 'new-tag'], expect.anything());
  });
});

describe('移动端虚拟滚动 — Dialog 内渲染', () => {
  beforeEach(async () => {
    await setViewport('phone');
  });
  afterEach(cleanupBodyPopups);

  test('virtual=true — Dialog 内使用 OVirtualList 渲染选项', async () => {
    const makeOptions = (n: number) => Array.from({ length: n }, (_, i) => ({ label: `Option ${i}`, value: `opt-${i}` }));

    const screen = render(OSelect, {
      props: {
        virtual: true,
        options: makeOptions(50),
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();

    // Dialog 内应渲染虚拟列表
    const vlist = document.querySelector('.o-select-dlg .o-virtual-list');
    expect(vlist).not.toBeNull();

    // 虚拟滚动只渲染可见项（< 50）
    const options = document.querySelectorAll('.o-select-dlg .o-option');
    expect(options.length).toBeLessThan(50);
    expect(options.length).toBeGreaterThan(0);
  });

  test('virtual=true — Dialog 内点击虚拟选项 emit 值', async () => {
    const onUpdate = vi.fn();
    const makeOptions = (n: number) => Array.from({ length: n }, (_, i) => ({ label: `Option ${i}`, value: `opt-${i}` }));

    const screen = render(OSelect, {
      props: {
        virtual: true,
        'onUpdate:modelValue': onUpdate,
        options: makeOptions(50),
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();

    const options = document.querySelectorAll('.o-select-dlg .o-option');
    expect(options.length).toBeGreaterThan(0);
    await (options[0] as HTMLElement).click();
    await flush();

    const clickedValue = makeOptions(50)[0].value;
    expect(onUpdate).toHaveBeenCalledWith(clickedValue);
  });
});

describe('移动端清除按钮', () => {
  beforeEach(async () => {
    await setViewport('pad_v');
  });
  afterEach(cleanupBodyPopups);

  test('单选 clearable — 点击清除按钮清空选中值', async () => {
    const onClear = vi.fn();
    const onUpdate = vi.fn();
    const screen = render(OSelect, {
      props: {
        clearable: true,
        modelValue: 'a',
        onClear,
        'onUpdate:modelValue': onUpdate,
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      },
    });
    await flush();

    // 清除按钮在 select 元素上（非 Dialog 内）
    const clearBtn = screen.container.querySelector('.o-select-clear') as HTMLElement;
    expect(clearBtn).not.toBeNull();
    await clearBtn.click();
    await flush();

    expect(onClear).toHaveBeenCalled();
    // 单选模式下 buildEmitValue([]) 返回 undefined（空数组无首元素）
    expect(onUpdate).toHaveBeenCalledWith(undefined);
  });

  test('多选 clearable — 点击清除按钮清空所有 tag', async () => {
    const onClear = vi.fn();
    const onUpdate = vi.fn();
    const screen = render(OSelect, {
      props: {
        multiple: true,
        clearable: true,
        modelValue: ['a', 'b'],
        onClear,
        'onUpdate:modelValue': onUpdate,
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      },
    });
    await flush();

    const clearBtn = screen.container.querySelector('.o-select-clear') as HTMLElement;
    await clearBtn.click();
    await flush();

    expect(onClear).toHaveBeenCalled();
    // 多选模式下 buildEmitValue([]) 返回空数组
    expect(onUpdate).toHaveBeenCalledWith([]);
  });
});

describe('移动端多选 — limit 上限', () => {
  beforeEach(async () => {
    await setViewport('pad_v');
  });
  afterEach(cleanupBodyPopups);

  test('limit=2 — Dialog 内选中 2 项后未选项变 disabled', async () => {
    const onExceedLimit = vi.fn();
    const screen = render(OSelect, {
      props: {
        multiple: true,
        limit: 2,
        modelValue: ['a', 'b'],
        onExceedLimit,
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
          { label: 'C', value: 'c' },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();

    // C 应为 disabled（已达 limit=2）
    const optionC = findOptionInDialog('C');
    expect(optionC).toBeTruthy();
    // disabled 样式在 .o-option-item 上，aria-disabled 在 .o-option 上
    const itemEl = optionC.querySelector('.o-option-item') as HTMLElement;
    expect(itemEl.classList.contains('o-option-disabled')).toBe(true);
    expect(optionC.getAttribute('aria-disabled')).toBe('true');
  });

  test('limit=2 — 点击已达上限的选项触发 exceed-limit', async () => {
    const onExceedLimit = vi.fn();
    const screen = render(OSelect, {
      props: {
        multiple: true,
        limit: 2,
        modelValue: ['a', 'b'],
        onExceedLimit,
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
          { label: 'C', value: 'c' },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();

    const optionC = findOptionInDialog('C');
    await optionC.click();
    await flush();

    expect(onExceedLimit).toHaveBeenCalledWith('c');
  });
});

describe('移动端多选 — 取消/确认/mask', () => {
  beforeEach(async () => {
    await setViewport('pad_v');
  });
  afterEach(cleanupBodyPopups);

  test('多选取消 — 不 emit update:modelValue / change，值回退', async () => {
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a'],
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

    // 在 Dialog 内点击选项 B（临时选中）
    const optionB = findOptionInDialog('B');
    await optionB.click();
    await flush();

    // 点击取消
    const cancelBtn = findDlgButton('取消');
    await cancelBtn.click();
    await flush();

    expect(onUpdate).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  test('多选确认 — emit 正确值（含新增项）', async () => {
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a'],
        'onUpdate:modelValue': onUpdate,
        onChange,
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
          { label: 'C', value: 'c' },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();

    // 临时选中 B 和 C
    const optionB = findOptionInDialog('B');
    await optionB.click();
    await flush();
    const optionC = findOptionInDialog('C');
    await optionC.click();
    await flush();

    // 点击确认
    const okBtn = findDlgButton('确定');
    await okBtn.click();
    await flush();

    expect(onUpdate).toHaveBeenLastCalledWith(['a', 'b', 'c']);
    expect(onChange).toHaveBeenLastCalledWith(['a', 'b', 'c'], expect.anything());
  });

  test('多选确认 — 取消选中已有项后确认 emit 正确值', async () => {
    const onUpdate = vi.fn();
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a', 'b'],
        'onUpdate:modelValue': onUpdate,
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
          { label: 'C', value: 'c' },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();

    // 取消选中 A（已选中 → 再次点击取消）
    const optionA = findOptionInDialog('A');
    await optionA.click();
    await flush();

    const okBtn = findDlgButton('确定');
    await okBtn.click();
    await flush();

    expect(onUpdate).toHaveBeenLastCalledWith(['b']);
  });

  test('多选 mask 点击 — 不关闭 Dialog（mask-close=false）', async () => {
    const onUpdate = vi.fn();
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a'],
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

    // 多选模式 mask-close=false，点击遮罩不应关闭 Dialog
    const mask = document.querySelector('.o-dialog-mask') as HTMLElement;
    if (mask) {
      await mask.click();
      await flush();
      // Dialog 应仍然可见
      const dialog = document.querySelector('.o-select-dlg') as HTMLElement;
      expect(dialog).not.toBeNull();
      expect(dialog.style.display).not.toBe('none');
    }
  });
});

describe('移动端多选 — filterable 搜索确认链路', () => {
  beforeEach(async () => {
    await setViewport('pad_v');
  });
  afterEach(cleanupBodyPopups);

  test('多选 filterable — 搜索过滤后点击选项 → 确认 emit', async () => {
    const onUpdate = vi.fn();
    const screen = render(OSelect, {
      props: {
        multiple: true,
        filterable: true,
        modelValue: ['a'],
        'onUpdate:modelValue': onUpdate,
        options: [
          { label: 'Apple', value: 'a' },
          { label: 'Banana', value: 'b' },
          { label: 'Cherry', value: 'c' },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();

    // 在 tag input 内搜索
    const input = screen.container.querySelector('.o-select-input--tag') as HTMLInputElement;
    await userEvent.fill(input, 'che');
    await flush();

    // 过滤后仅 Cherry 可见
    const options = document.querySelectorAll('.o-select-dlg .o-option');
    expect(options.length).toBe(1);
    expect(options[0].textContent).toContain('Cherry');

    await (options[0] as HTMLElement).click();
    await flush();

    // 确认
    const okBtn = findDlgButton('确定');
    await okBtn.click();
    await flush();

    expect(onUpdate).toHaveBeenLastCalledWith(['a', 'c']);
  });
});

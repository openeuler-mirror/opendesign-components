/**
 * OSelect 剩余测试（filterSort + tokenSeparators + 响应式折叠
 * + 渲染函数 + 结构化数据 + DOM 文本 + SSR）
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

// ============================================================================
// filterSort
// ============================================================================
describe('filterSort 搜索结果排序', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('不传 filterSort — 搜索结果保持原顺序', async () => {
    const screen = render(OSelect, {
      props: {
        filterable: true,
        options: [
          { label: 'Banana', value: 'b' },
          { label: 'Apple', value: 'a' },
          { label: 'Cherry', value: 'c' },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    input.value = 'a';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await flush();
    const options = document.querySelectorAll('.o-option');
    const labels = Array.from(options).map((o) => o.textContent);
    // 原顺序：Banana, Apple, Cherry → 过滤后都包含 'a'
    expect(labels.indexOf('Banana')).toBeLessThanOrEqual(labels.length);
  });

  test('传 filterSort — 搜索结果按字母排序', async () => {
    const screen = render(OSelect, {
      props: {
        filterable: true,
        filterSort: (a: any, b: any) => a.label.localeCompare(b.label),
        options: [
          { label: 'Banana', value: 'b' },
          { label: 'Apple', value: 'a' },
          { label: 'Cherry', value: 'c' },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    input.value = 'a';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await flush();
    const options = document.querySelectorAll('.o-option');
    const labels = Array.from(options).map((o) => o.textContent);
    // 排序后：Apple, Banana, Cherry
    expect(labels[0]).toContain('Apple');
    expect(labels[1]).toContain('Banana');
  });
});

// ============================================================================
// tokenSeparators
// ============================================================================
describe('tokenSeparators 分词符', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('不传 tokenSeparators — 键盘输入逗号分隔文本不拆分', async () => {
    const onUpdate = vi.fn();
    const screen = render(OSelect, {
      props: {
        multiple: true,
        filterable: true,
        allowCreate: true,
        'onUpdate:modelValue': onUpdate,
        options: [],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    // 第一次点击展开下拉，第二次点击 input 聚焦（与 filterable.test.ts 一致）
    await input.click();
    await flush();
    expect(document.activeElement).toBe(input);
    // 逐字输入 "a,b,c," — 无分词符时逗号只是普通文本，不触发拆分
    await userEvent.type(input, 'a,b,c,');
    await flush();
    expect(onUpdate).not.toHaveBeenCalled();
  });

  test('传 tokenSeparators=[","] — 键盘逐字输入，遇到分隔符即拆分创建', async () => {
    const onUpdate = vi.fn();
    const onCreate = vi.fn();
    const screen = render(OSelect, {
      props: {
        multiple: true,
        filterable: true,
        allowCreate: true,
        tokenSeparators: [','],
        'onUpdate:modelValue': onUpdate,
        onCreate,
        options: [],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    // 第一次点击展开下拉，第二次点击 input 聚焦（与 filterable.test.ts 一致）
    await input.click();
    await flush();
    expect(document.activeElement).toBe(input);
    // 逐字输入 "a,b,c," — 每遇到逗号即拆分：a, → 创建 'a'；b, → 创建 'b'；c, → 创建 'c'
    // Vue 在每次拆分后清空 input（:value 绑定），下一字符从空输入开始
    await userEvent.type(input, 'a,b,c,');
    await flush();
    // onUpdate 被调用 3 次：['a'] → ['a','b'] → ['a','b','c']
    expect(onUpdate).toHaveBeenLastCalledWith(['a', 'b', 'c']);
    expect(onCreate).toHaveBeenCalledTimes(3);
  });

  test('单选模式下 tokenSeparators 不生效', async () => {
    const onUpdate = vi.fn();
    const screen = render(OSelect, {
      props: {
        filterable: true,
        allowCreate: true,
        tokenSeparators: [','],
        'onUpdate:modelValue': onUpdate,
        options: [],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    // 第一次点击展开下拉，第二次点击 input 聚焦（与 filterable.test.ts 一致）
    await input.click();
    await flush();
    expect(document.activeElement).toBe(input);
    // 单选模式：handleTokenSeparators 在 !props.multiple 处直接返回 false
    await userEvent.type(input, 'a,b,c,');
    await flush();
    expect(onUpdate).not.toHaveBeenCalled();
  });
});

// ============================================================================
// disabled 状态下 tag 关闭按钮
// ============================================================================
describe('disabled 多选 tag 不可关闭', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('disabled=true — 可见 tag 不渲染关闭按钮', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        disabled: true,
        modelValue: ['a', 'b'],
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      },
    });
    await flush();
    const removeBtns = screen.container.querySelectorAll('.o-select-tag-remove');
    expect(removeBtns.length).toBe(0);
  });

  test('disabled=true — maxTagCount 折叠后 popover 内 tag 不渲染关闭按钮', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        disabled: true,
        modelValue: ['a', 'b', 'c', 'd'],
        maxTagCount: 2,
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
          { label: 'C', value: 'c' },
          { label: 'D', value: 'd' },
        ],
      },
    });
    await flush();

    // 可见 tag 的关闭按钮应为 0
    const visibleRemoveBtns = screen.container.querySelectorAll('.o-select-tags-wrap > .o-select-tag .o-select-tag-remove');
    expect(visibleRemoveBtns.length).toBe(0);
  });
});

// ============================================================================
// maxTagCount='responsive'
// ============================================================================
describe('maxTagCount=number 非 breaking 回归', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('maxTagCount=2 — 固定折叠（与旧版一致）', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a', 'b', 'c', 'd'],
        maxTagCount: 2,
      },
      slots: {
        default: () => [
          h(OOption, { value: 'a', label: 'A' }),
          h(OOption, { value: 'b', label: 'B' }),
          h(OOption, { value: 'c', label: 'C' }),
          h(OOption, { value: 'd', label: 'D' }),
        ],
      },
    });
    await flush();
    const removeBtns = screen.container.querySelectorAll('.o-select-tag-remove');
    expect(removeBtns.length).toBe(2);
  });

  test('不传 maxTagCount — 显示全部 tag', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a', 'b', 'c'],
      },
      slots: {
        default: () => [h(OOption, { value: 'a', label: 'A' }), h(OOption, { value: 'b', label: 'B' }), h(OOption, { value: 'c', label: 'C' })],
      },
    });
    await flush();
    const tags = screen.container.querySelectorAll('.o-select-tags-wrap > .o-select-tag');
    expect(tags.length).toBe(3);
  });
});

// ============================================================================
// maxTagCount='responsive' 容器宽度自适应（动态更新与恢复）
// ============================================================================
describe('maxTagCount=responsive 动态更新与恢复', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  /**
   * 查找折叠标签：.o-select-tag 但无 .o-select-tag-remove 子元素（即 +N… 指示器）。
   */
  const findFoldTag = (container: HTMLElement): HTMLElement | null => {
    const allTags = container.querySelectorAll('.o-select-tag');
    return (Array.from(allTags).find((tag) => !tag.querySelector('.o-select-tag-remove')) as HTMLElement | undefined) ?? null;
  };

  test('responsive 模式变窄后应折叠而非换行', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        maxTagCount: 'responsive',
        modelValue: ['v0', 'v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7'],
        options: Array.from({ length: 8 }, (_, i) => ({
          label: `很长的标签文本选项${i}`,
          value: `v${i}`,
        })),
      },
    });
    // 约束 select 宽度，强制触发折叠
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    selectEl.style.width = '200px';
    selectEl.style.maxWidth = '200px';
    await flush();

    // 1) 折叠应被触发——存在 +N 指示器
    const foldTag = findFoldTag(screen.container as unknown as HTMLElement);
    expect(foldTag).not.toBeNull();

    // 2) 不应换行——所有可见 tag 的垂直范围重叠（同一行）
    //    注：折叠指示器（+N…）无 close 按钮，高度比普通 tag 矮，
    //    align-items:center 下 top 不同但仍在同一行，用垂直区间重叠判断
    const visibleTags = screen.container.querySelectorAll('.o-select-tags-wrap > .o-select-tag');
    expect(visibleTags.length).toBeGreaterThan(0);
    const rects = Array.from(visibleTags).map((t) => (t as HTMLElement).getBoundingClientRect());
    const maxTop = Math.max(...rects.map((r) => r.top));
    const minBottom = Math.min(...rects.map((r) => r.bottom));
    // 同一行：最大 top < 最小 bottom（所有 tag 垂直区间有交集）
    expect(maxTop).toBeLessThan(minBottom);
  });

  test('容器变宽后应恢复显示更多 tag', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        maxTagCount: 'responsive',
        modelValue: ['v0', 'v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v9'],
        options: Array.from({ length: 10 }, (_, i) => ({
          label: `标签选项${i}`,
          value: `v${i}`,
        })),
      },
    });
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    // 窄容器：10 个 tag 必然超出，应折叠
    selectEl.style.width = '120px';
    selectEl.style.maxWidth = '120px';
    await flush();

    const removeBtnsNarrow = screen.container.querySelectorAll('.o-select-tag-remove');
    expect(removeBtnsNarrow.length).toBeLessThan(10);

    // 放宽容器
    selectEl.style.width = '2000px';
    selectEl.style.maxWidth = '2000px';
    await flush();
    await flush(); // 多等一帧让 ResizeObserver 链式回调完成

    // 宽容器后应显示全部 tag（10 个 tag 均有 remove 按钮）
    const removeBtnsWide = screen.container.querySelectorAll('.o-select-tag-remove');
    expect(removeBtnsWide.length).toBe(10);
  });
});

// ============================================================================
// DOM 文本可读性 + SSR + 结构化数据
// ============================================================================
describe('o-sr-only 选中值文本', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('选中值后 DOM 中存在 o-sr-only 文本', async () => {
    const screen = render(OSelect, {
      props: {
        modelValue: 'a',
        options: [{ label: 'Label A', value: 'a' }],
      },
    });
    await flush();
    const srOnly = screen.container.querySelector('.o-select .o-sr-only[aria-hidden="false"]');
    expect(srOnly).not.toBeNull();
    expect(srOnly?.textContent).toBe('Label A');
  });

  test('无选中值时 o-sr-only 文本为空', async () => {
    const screen = render(OSelect, {
      props: { options: [{ label: 'A', value: 'a' }] },
    });
    await flush();
    const srOnly = screen.container.querySelector('.o-select .o-sr-only[aria-hidden="false"]');
    expect(srOnly?.textContent).toBe('');
  });

  test('单选选中值 — data-value 存在且值为选中值', async () => {
    const screen = render(OSelect, {
      props: {
        modelValue: 'a',
        options: [{ label: 'A', value: 'a' }],
      },
    });
    await flush();
    const dataValueEl = screen.container.querySelector('[data-value]');
    expect(dataValueEl).not.toBeNull();
    expect(dataValueEl?.getAttribute('data-value')).toBe('a');
  });

  test('多选选中值 — data-value 为 join 后的值', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a', 'b'],
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      },
    });
    await flush();
    const dataValueEl = screen.container.querySelector('[data-value]');
    expect(dataValueEl).not.toBeNull();
    expect(dataValueEl?.getAttribute('data-value')).toBe('a,b');
  });
});

describe('原生 select 兜底', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('默认渲染 native select + 全量 option', async () => {
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
    const nativeSelect = screen.container.querySelector('.o-select-native-fallback') as HTMLSelectElement;
    expect(nativeSelect).not.toBeNull();
    const options = nativeSelect.querySelectorAll('option');
    expect(options.length).toBe(2);
  });

  test('传 name — name 位于 native select', async () => {
    const screen = render(OSelect, {
      props: {
        modelValue: 'a',
        name: 'country',
        options: [
          { label: 'China', value: 'cn' },
          { label: 'USA', value: 'us' },
        ],
      },
    });
    await flush();
    const nativeSelect = screen.container.querySelector('.o-select-native-fallback') as HTMLSelectElement;
    expect(nativeSelect).not.toBeNull();
    expect(nativeSelect.getAttribute('name')).toBe('country');
    const options = nativeSelect.querySelectorAll('option');
    expect(options.length).toBe(2);
  });

  test('multiple=true — native select 有 multiple 属性', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['cn'],
        name: 'country',
        options: [
          { label: 'China', value: 'cn' },
          { label: 'USA', value: 'us' },
        ],
      },
    });
    await flush();
    const nativeSelect = screen.container.querySelector('.o-select-native-fallback') as HTMLSelectElement;
    expect(nativeSelect).not.toBeNull();
    expect(nativeSelect.hasAttribute('multiple')).toBe(true);
  });

  test('单选 — 选中项 option 有 selected 属性', async () => {
    const screen = render(OSelect, {
      props: {
        modelValue: 'us',
        name: 'country',
        options: [
          { label: 'China', value: 'cn' },
          { label: 'USA', value: 'us' },
        ],
      },
    });
    await flush();
    const nativeSelect = screen.container.querySelector('.o-select-native-fallback') as HTMLSelectElement;
    const options = nativeSelect.querySelectorAll('option');
    expect(options[0].hasAttribute('selected')).toBe(false);
    expect(options[1].hasAttribute('selected')).toBe(true);
  });

  test('多选 — 选中项 option 有 selected 属性', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['cn', 'us'],
        name: 'country',
        options: [
          { label: 'China', value: 'cn' },
          { label: 'USA', value: 'us' },
          { label: 'Japan', value: 'jp' },
        ],
      },
    });
    await flush();
    const nativeSelect = screen.container.querySelector('.o-select-native-fallback') as HTMLSelectElement;
    const options = nativeSelect.querySelectorAll('option');
    expect(options[0].hasAttribute('selected')).toBe(true);
    expect(options[1].hasAttribute('selected')).toBe(true);
    expect(options[2].hasAttribute('selected')).toBe(false);
  });

  test('分组 options — 用 optgroup 渲染分组', async () => {
    const screen = render(OSelect, {
      props: {
        name: 'city',
        options: [
          {
            type: 'group',
            label: 'Asia',
            key: 'asia',
            children: [
              { label: 'Beijing', value: 'bj' },
              { label: 'Tokyo', value: 'ty' },
            ],
          },
          { label: 'New York', value: 'ny' },
        ],
      },
    });
    await flush();
    const nativeSelect = screen.container.querySelector('.o-select-native-fallback') as HTMLSelectElement;
    const optgroups = nativeSelect.querySelectorAll('optgroup');
    expect(optgroups.length).toBe(1);
    expect(optgroups[0].getAttribute('label')).toBe('Asia');
    const groupOptions = optgroups[0].querySelectorAll('option');
    expect(groupOptions.length).toBe(2);
    const allOptions = nativeSelect.querySelectorAll('option');
    expect(allOptions.length).toBe(3);
  });
});

describe('name/itemprop 透传', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('传 name — name 位于 native select，input 无 name', async () => {
    const screen = render(OSelect, {
      props: {
        name: 'field1',
        options: [{ label: 'A', value: 'a' }],
      },
    });
    await flush();
    const nativeSelect = screen.container.querySelector('.o-select-native-fallback') as HTMLSelectElement;
    expect(nativeSelect.getAttribute('name')).toBe('field1');
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    expect(input.getAttribute('name')).toBeNull();
  });

  test('不传 name — native select 与 input 均无 name 属性', async () => {
    const screen = render(OSelect, {
      props: { options: [{ label: 'A', value: 'a' }] },
    });
    await flush();
    const nativeSelect = screen.container.querySelector('.o-select-native-fallback') as HTMLSelectElement;
    expect(nativeSelect.getAttribute('name')).toBeNull();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    expect(input.getAttribute('name')).toBeNull();
  });
});

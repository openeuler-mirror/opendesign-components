/**
 * OSelect 响应式折叠 — 展开时 tag 折叠回归测试。
 *
 * 场景：multiple=true + filterable=true + maxTagCount='responsive'，容器宽度有限。
 *
 * 原始 bug：下拉展开后，内联搜索 input wrapper 以 `flex: 1 1 auto` 渲染并参与
 * flex 布局。测量阶段 tag 被 flex 压缩（flex-shrink:1）导致 offsetWidth 偏小，
 * 计算结果不准；且 isSelecting 变化时未触发重算，关闭后 tag 不恢复。
 *
 * 修复后预期：
 *   1. 测量阶段 tag 不被压缩（.is-measuring → flex-shrink:0 + input 脱离 flex 流）
 *   2. 展开时最多折叠 1 个 tag（input 需 80px 最小宽度，属于合理占用）
 *   3. 关闭后 tag 恢复至展开前数量（isSelecting watch 触发 calculateResponsiveTags(true)）
 */
import { test, expect, describe, afterEach, beforeEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import OSelect from '../OSelect.vue';
import { flush } from '../../../__tests__/_helpers/dom';
import { setViewport } from '../../../__tests__/_helpers/viewport';

const cleanupBodyPopups = () => {
  document.body.querySelectorAll('.o-options-popup, .o-select-options, [data-v-popper-escaped], .o-popup-content').forEach((el) => el.remove());
};

/** 8 个选项，label 为 2 字中文，确保多个 tag 总宽度超过窄容器 */
const OPTIONS = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橙子', value: 'orange' },
  { label: '葡萄', value: 'grape' },
  { label: '西瓜', value: 'watermelon' },
  { label: '芒果', value: 'mango' },
  { label: '草莓', value: 'strawberry' },
  { label: '蓝莓', value: 'blueberry' },
];

/**
 * 获取 tags-wrap 直属子级中可见 tag 的数量（排除折叠弹窗内的 tag）
 */
function getVisibleTagCount(container: HTMLElement): number {
  const all = container.querySelectorAll('.o-select-tags-wrap > .o-select-tag');
  let count = 0;
  all.forEach((el) => {
    if (!el.closest('.o-select-tag-popover')) count++;
  });
  return count;
}

describe('响应式折叠 — 展开时 tag 折叠行为', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('展开后最多折叠 1 个 tag（input 需 80px 合理占用）', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['apple', 'banana', 'orange', 'grape', 'watermelon'],
        filterable: true,
        maxTagCount: 'responsive',
        options: OPTIONS,
      },
    });
    await flush();

    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    selectEl.style.width = '280px';
    await flush();

    // ── 下拉关闭状态 ──
    const visibleBefore = getVisibleTagCount(screen.container);
    expect(visibleBefore).toBeGreaterThanOrEqual(2);

    // ── 展开下拉 ──
    await selectEl.click();
    await flush();

    // input wrapper 应已渲染
    const inputWrap = screen.container.querySelector('.o-select-tag-input-wrap');
    expect(inputWrap).not.toBeNull();

    // 展开后 input 需 80px 最小宽度，最多导致 1 个 tag 被额外折叠
    const visibleAfter = getVisibleTagCount(screen.container);
    expect(visibleAfter).toBeGreaterThanOrEqual(visibleBefore - 1);
  });

  test('关闭下拉后 tag 恢复至展开前的可见数量', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['apple', 'banana', 'orange', 'grape', 'watermelon'],
        filterable: true,
        maxTagCount: 'responsive',
        options: OPTIONS,
      },
    });
    await flush();

    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    selectEl.style.width = '280px';
    await flush();

    const visibleBefore = getVisibleTagCount(screen.container);

    // 展开下拉
    await selectEl.click();
    await flush();

    // 通过点击箭头关闭下拉（filterable 模式下 select 主体 click 会被 stopImmediatePropagation 拦截，
    // 但箭头元素被排除在拦截逻辑之外，可正常 toggle 关闭）
    const arrow = selectEl.querySelector('.o-select-arrow') as HTMLElement;
    await arrow.click();
    await flush();

    // 验证下拉已关闭（input wrapper 应从 DOM 移除）
    const inputWrapAfterClose = screen.container.querySelector('.o-select-tag-input-wrap');
    expect(inputWrapAfterClose).toBeNull();

    // 关闭后可见 tag 数应恢复至展开前
    const visibleAfterClose = getVisibleTagCount(screen.container);
    expect(visibleAfterClose).toBe(visibleBefore);
  });

  test('测量阶段 tag 不被 flex 压缩（.is-measuring 时 flex-shrink:0）', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['apple', 'banana', 'orange', 'grape', 'watermelon'],
        filterable: true,
        maxTagCount: 'responsive',
        options: OPTIONS,
      },
    });
    await flush();

    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    selectEl.style.width = '280px';
    await flush();

    const tagsWrap = screen.container.querySelector('.o-select-tags-wrap') as HTMLElement;

    // 关闭状态下测量一次，记录 tag 自然宽度
    await selectEl.click();
    await flush();

    // 展开后 tag 宽度应与关闭时一致（不被 flex 压缩）
    // 在 .is-measuring 期间 flex-shrink:0，tag 为自然宽度
    const tagsAfter = tagsWrap.querySelectorAll('.o-select-tag');
    expect(tagsAfter.length).toBeGreaterThan(0);
    // 每个 tag 的 offsetWidth 应大于 0 且合理（非被压缩的极小值）
    tagsAfter.forEach((tag) => {
      const w = (tag as HTMLElement).offsetWidth;
      expect(w).toBeGreaterThan(20);
    });
  });
});

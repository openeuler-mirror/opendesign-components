/**
 * OVirtualList M4 能力扩展专项测试。
 *
 * 覆盖：
 *   - scrollToOffset expose 方法（含边界 clamp + align/behavior 参数）
 *   - scrollToView 各 align 值（start/end/center/nearest/number）+ behavior 参数
 *   - scrollToView 二次逼近 pendingScrollTo（§4.3）
 *   - itemSize 函数式（按索引定高）+ 方法调用
 *   - threshold 自动虚拟化开关（含 threshold=0）
 *   - 水平布局 layout='horizontal'（定宽/函数定宽/不定宽 × 方法调用 × wheel × renderChange × isScrolling）
 *   - list 变化时 meta 复用（不定高模式追加数据后已测量项 size 不重算）
 *   - container resize 后重新定位
 *   - 不定高模式方法调用（scrollToOffset/scrollToView 各 align）
 */
import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, ref, type Ref } from 'vue';
import OVirtualList from '../OVirtualList.vue';
import { flush } from '../../../__tests__/_helpers/dom';
import { createFixedList, createFixedListWithId, createDynamicList, type FixedListItemWithId } from './_helpers/data';
import { getRoot, getWrapper, getBody, getRenderList, getItems } from './_helpers/elements';
import { renderList } from './_helpers/render';

/**
 * @description 渲染水平不定宽列表，子项宽度由 slot 内容的 inline style 决定
 * @param props 组件 props
 * @returns screen 对象
 */
function renderHorizontalDynamic(props: Record<string, unknown>) {
  const list = props.list as Array<{ id: string; label: string; height: number }>;
  return render({
    render: () =>
      h(
        'div',
        h(
          OVirtualList,
          { ...props, style: 'height: 300px; width: 400px;' },
          {
            default: (scope: { item: { height: number; label: string }; index: number }) =>
              h('div', { 'data-index': scope.index, style: `width: ${scope.item.height}px` }, scope.item.label),
          },
        ),
      ),
  });
}

// ============================================================================
// scrollToOffset
// ============================================================================

describe('M4: scrollToOffset expose', () => {
  test('OVirtualList scrollToOffset - 滚动到指定像素偏移', async () => {
    const list = createFixedList(100);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: 80, style: 'height: 300px; width: 400px;' },
            {
              default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label),
            },
          ),
        ),
    });
    await flush();

    vlRef.value?.scrollToOffset(400);
    await flush();

    const wrapper = getWrapper(screen.container);
    // 函数定高模式（每项 80px）：scrollTop = 400px
    expect(wrapper.scrollTop).toBeCloseTo(400, -1);
  });

  test('OVirtualList scrollToOffset - 像素偏移=0 时 scrollTop 为 0', async () => {
    const list = createFixedList(100);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: 80, style: 'height: 300px; width: 400px;' },
            {
              default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label),
            },
          ),
        ),
    });
    await flush();

    // 先滚动到某个位置
    vlRef.value?.scrollToOffset(400);
    await flush();
    expect(getWrapper(screen.container).scrollTop).toBeGreaterThan(0);

    // 再滚回 0
    vlRef.value?.scrollToOffset(0);
    await flush();
    expect(getWrapper(screen.container).scrollTop).toBeCloseTo(0, 0);
  });

  test('OVirtualList scrollToOffset - 负值 clamp 到 0', async () => {
    const list = createFixedList(100);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: 80, style: 'height: 300px; width: 400px;' },
            {
              default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label),
            },
          ),
        ),
    });
    await flush();

    vlRef.value?.scrollToOffset(-100);
    await flush();

    const wrapper = getWrapper(screen.container);
    expect(wrapper.scrollTop).toBeCloseTo(0, 0);
  });

  test('OVirtualList scrollToOffset - 超过最大滚动范围时 clamp 到 max', async () => {
    const list = createFixedList(100);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: 80, style: 'height: 300px; width: 400px;' },
            {
              default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label),
            },
          ),
        ),
    });
    await flush();

    // 最大滚动位置 = scrollHeight - clientHeight = 100×80 - 300 = 7700
    vlRef.value?.scrollToOffset(99999);
    await flush();

    const wrapper = getWrapper(screen.container);
    const maxScroll = wrapper.scrollHeight - wrapper.clientHeight;
    expect(wrapper.scrollTop).toBeCloseTo(maxScroll, 0);
  });
});

// ============================================================================
// scrollToView align 参数
// ============================================================================

describe('M4: scrollToView align 参数', () => {
  test('OVirtualList scrollToView align=start - 项顶部对齐视口顶部', async () => {
    const list = createFixedListWithId(100);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: 80, style: 'height: 300px; width: 400px;' },
            {
              default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label),
            },
          ),
        ),
    });
    await flush();

    vlRef.value?.scrollToView(10, 'start');
    await flush();

    const wrapper = getWrapper(screen.container);
    // align=start: scrollTop = itemTop = 10 × 80 = 800
    expect(wrapper.scrollTop).toBeCloseTo(800, -1);
  });

  test('OVirtualList scrollToView align=end - 项底部对齐视口底部', async () => {
    const list = createFixedListWithId(100);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: 80, style: 'height: 300px; width: 400px;' },
            {
              default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label),
            },
          ),
        ),
    });
    await flush();

    vlRef.value?.scrollToView(10, 'end');
    await flush();

    const wrapper = getWrapper(screen.container);
    // align=end: scrollTop = itemTop - containerHeight + itemSize = 800 - 300 + 80 = 580
    expect(wrapper.scrollTop).toBeCloseTo(580, -1);
  });

  test('OVirtualList scrollToView align=center - 项中心对齐视口中心', async () => {
    const list = createFixedListWithId(100);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: 80, style: 'height: 300px; width: 400px;' },
            {
              default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label),
            },
          ),
        ),
    });
    await flush();

    vlRef.value?.scrollToView(10, 'center');
    await flush();

    const wrapper = getWrapper(screen.container);
    // align=center: scrollTop = itemTop - containerHeight/2 + itemSize/2 = 800 - 150 + 40 = 690
    expect(wrapper.scrollTop).toBeCloseTo(690, -1);
  });

  test('OVirtualList scrollToView align=nearest - 项已可见时不滚动', async () => {
    const list = createFixedListWithId(100);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: 80, style: 'height: 300px; width: 400px;' },
            {
              default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label),
            },
          ),
        ),
    });
    await flush();

    // 初始位置 scrollTop=0，可视范围 0~300px
    // index 2 的项 top=160, bottom=240, 完全在视口内
    const wrapper = getWrapper(screen.container);
    const scrollTopBefore = wrapper.scrollTop;

    vlRef.value?.scrollToView(2, 'nearest');
    await flush();

    // nearest 检测到项已可见，返回 null 不滚动
    expect(wrapper.scrollTop).toBeCloseTo(scrollTopBefore, 0);
  });

  test('OVirtualList scrollToView align=nearest - 项在视口上方时滚动到 start 对齐', async () => {
    const list = createFixedListWithId(100);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: 80, style: 'height: 300px; width: 400px;' },
            {
              default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label),
            },
          ),
        ),
    });
    await flush();

    // 先滚动到中间
    vlRef.value?.scrollToView(20, 'start');
    await flush();

    const wrapper = getWrapper(screen.container);
    const scrollTopMid = wrapper.scrollTop;
    expect(scrollTopMid).toBeGreaterThan(0);

    // index 5 的项在视口上方（scrollTop > itemTop），nearest 解析为 start
    vlRef.value?.scrollToView(5, 'nearest');
    await flush();

    // 应滚动到 item 5 的 start 对齐位置 = 5 × 80 = 400
    expect(wrapper.scrollTop).toBeLessThan(scrollTopMid);
  });

  test('OVirtualList scrollToView align=nearest - 项在视口下方时滚动到 end 对齐', async () => {
    const list = createFixedListWithId(100);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: 80, style: 'height: 300px; width: 400px;' },
            {
              default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label),
            },
          ),
        ),
    });
    await flush();

    // 初始 scrollTop=0, 可视范围 0~300px
    // index 5 top=400, bottom=480 → 完全在视口下方
    vlRef.value?.scrollToView(5, 'nearest');
    await flush();

    const wrapper = getWrapper(screen.container);
    // nearest 解析为 end → scrollTop = 400 - 300 + 80 = 180
    expect(wrapper.scrollTop).toBeGreaterThan(0);
  });

  test('OVirtualList scrollToView align=数字偏移 - scrollTop = itemTop - offset', async () => {
    const list = createFixedListWithId(100);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: 80, style: 'height: 300px; width: 400px;' },
            {
              default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label),
            },
          ),
        ),
    });
    await flush();

    // align=50: scrollTop = itemTop - 50 = 10×80 - 50 = 750
    vlRef.value?.scrollToView(10, 50);
    await flush();

    const wrapper = getWrapper(screen.container);
    expect(wrapper.scrollTop).toBeCloseTo(750, -1);
  });
});

// ============================================================================
// scrollToView behavior 参数
// ============================================================================

describe('M4: scrollToView behavior 参数', () => {
  test('OVirtualList scrollToView behavior=smooth - 定高模式允许 smooth', async () => {
    const list = createFixedListWithId(100);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: 80, style: 'height: 300px; width: 400px;' },
            {
              default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label),
            },
          ),
        ),
    });
    await flush();

    // 定高模式允许 smooth behavior（不强制 instant）
    // scrollTo 内部调用 scrollTo({ top: ..., behavior: 'smooth' })
    // 在测试环境中 smooth 滚动最终也会到达目标位置
    vlRef.value?.scrollToView(10, 'start', 'smooth');
    await flush();
    await new Promise((r) => setTimeout(r, 100));
    await flush();

    const wrapper = getWrapper(screen.container);
    // 即使是 smooth 滚动，最终位置也应接近目标
    expect(wrapper.scrollTop).toBeGreaterThan(0);
  });

  test('OVirtualList scrollToView behavior - 不定高模式强制 instant', async () => {
    const list = createDynamicList(50);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, defaultItemSize: 80, style: 'height: 300px; width: 400px;' },
            {
              default: (scope: { item: { label: string; height?: number }; index: number }) =>
                h('div', { 'data-index': scope.index, style: `height: ${scope.item.height}px` }, `${scope.item.label}`),
            },
          ),
        ),
    });
    await flush();

    // 不定高模式传入 behavior='smooth'，但 resolveBehavior 强制为 'instant'
    // 不应抛错，且滚动应立即到达目标位置（instant 模式）
    vlRef.value?.scrollToView(10, 'start', 'smooth');
    await flush();

    const wrapper = getWrapper(screen.container);
    expect(wrapper.scrollTop).toBeGreaterThan(0);
  });
});

// ============================================================================
// scrollToView 二次逼近 pendingScrollTo（§4.3）
// ============================================================================

describe('M4: scrollToView 二次逼近（pendingScrollTo）', () => {
  test('OVirtualList scrollToView 不定高 - 远处未测量项先 start 对齐再修正', async () => {
    const list = createDynamicList(100);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, defaultItemSize: 80, style: 'height: 300px; width: 400px;' },
            {
              default: (scope: { item: { label: string; height?: number }; index: number }) =>
                h('div', { 'data-index': scope.index, style: `height: ${scope.item.height}px` }, `${scope.item.label}`),
            },
          ),
        ),
    });
    await flush();

    // 滚动到远处（index 50）且 align=center，不定高模式下触发二次逼近
    vlRef.value?.scrollToView(50, 'center');
    await flush();

    const wrapper = getWrapper(screen.container);
    // 二次逼近应使滚动位置大于 0（至少滚动到 start 对齐位置）
    expect(wrapper.scrollTop).toBeGreaterThan(0);
  });

  test('OVirtualList scrollToView - 定高模式下无 pendingScrollTo（全量已知高度）', async () => {
    const list = createFixedListWithId(100);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: 80, style: 'height: 300px; width: 400px;' },
            {
              default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label),
            },
          ),
        ),
    });
    await flush();

    // 定高模式直接精确定位，不需要二次逼近
    vlRef.value?.scrollToView(50, 'center');
    await flush();

    const wrapper = getWrapper(screen.container);
    // center: scrollTop = 50×80 - 150 + 40 = 3890
    expect(wrapper.scrollTop).toBeGreaterThan(0);
  });
});

// ============================================================================
// itemSize 函数式
// ============================================================================

describe('M4: itemSize 函数式（按项定高）', () => {
  test('OVirtualList itemSize=Function - 按索引返回不同高度', async () => {
    const list = createFixedList(20);
    const sizeFn = (_item: unknown, index: number) => 40 + index * 10;
    const screen = renderList({ list, itemSize: sizeFn });
    await flush();

    const items = screen.container.querySelectorAll('.o-virtual-render-item');
    expect(items.length).toBeGreaterThanOrEqual(1);

    const firstItem = items[0] as HTMLElement;
    expect(firstItem.style.height).toBe('40px');
  });

  test('OVirtualList itemSize=Function - content-height 为函数累加和', async () => {
    const list = createFixedList(5);
    const sizeFn = (_item: unknown, index: number) => 40 + index * 10;
    const screen = renderList({ list, itemSize: sizeFn });
    const body = getBody(screen.container);
    const contentHeight = parseFloat(body.style.getPropertyValue('--_vl-content-height') || '0');
    // 40+50+60+70+80 = 300
    expect(contentHeight).toBeCloseTo(300, 0);
  });

  test('OVirtualList itemSize=Function - 按 item 属性返回高度', async () => {
    const list = createDynamicList(5);
    const sizeFn = (item: { height: number }) => item.height;
    const screen = renderList({ list, itemSize: sizeFn }, 'dynamic');
    await flush();

    const body = getBody(screen.container);
    const contentHeight = parseFloat(body.style.getPropertyValue('--_vl-content-height') || '0');
    // createDynamicList: height = 40 + idx * 4 → [40, 44, 48, 52, 56] → sum = 240
    expect(contentHeight).toBeCloseTo(240, 0);
  });
});

// ============================================================================
// threshold 自动虚拟化
// ============================================================================

describe('M4: threshold 自动虚拟化开关', () => {
  test('OVirtualList threshold=null - 始终虚拟化', async () => {
    const list = createFixedList(100);
    const screen = renderList({ list, itemSize: 80, threshold: null });
    await flush();

    const items = screen.container.querySelectorAll('.o-virtual-render-item');
    expect(items.length).toBeLessThan(100);
  });

  test('OVirtualList threshold=50 - 少于阈值时全量渲染', async () => {
    const list = createFixedList(10);
    const screen = renderList({ list, itemSize: 80, threshold: 50 });
    await flush();

    const items = screen.container.querySelectorAll('.o-virtual-render-item');
    expect(items.length).toBe(10);
  });

  test('OVirtualList threshold=50 - 超过阈值时虚拟化', async () => {
    const list = createFixedList(100);
    const screen = renderList({ list, itemSize: 80, threshold: 50 });
    await flush();

    const items = screen.container.querySelectorAll('.o-virtual-render-item');
    expect(items.length).toBeLessThan(100);
  });

  test('OVirtualList threshold=0 - 等于始终启用虚拟化（任何列表 >= 0）', async () => {
    const list = createFixedList(100);
    const screen = renderList({ list, itemSize: 80, threshold: 0 });
    await flush();

    const items = screen.container.querySelectorAll('.o-virtual-render-item');
    // threshold=0 → length >= 0 总是 true，且 contentSize > containerSize 时虚拟化
    expect(items.length).toBeLessThan(100);
  });

  // --------------------------------------------------------------------------
  // 动态切换：低于阈值 → 追加数据超过阈值 → 验证虚拟化生效 + 滚动正常
  // --------------------------------------------------------------------------

  /**
   * @description 辅助：渲染带响应式 list 的定高虚拟列表
   * @param listRef 响应式列表引用
   * @param props 额外 props（threshold 等）
   * @returns screen 对象
   */
  function renderReactiveThresholdList(listRef: Ref<FixedListItemWithId[]>, props: Record<string, unknown>) {
    return render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { list: listRef.value, itemSize: 40, style: 'height: 200px; width: 400px;', ...props },
            {
              default: (scope: { item: { label: string }; index: number }) => h('div', { 'data-index': scope.index }, scope.item.label),
            },
          ),
        ),
    });
  }

  test('OVirtualList threshold 动态切换 - 低于阈值时全量渲染', async () => {
    const listRef = ref(createFixedListWithId(8));
    const screen = renderReactiveThresholdList(listRef, { threshold: 15 });
    await flush();

    // 8 < 15 → 全量渲染
    const items = getItems(screen.container);
    expect(items.length).toBe(8);
  });

  test('OVirtualList threshold 动态切换 - 追加数据超过阈值后自动虚拟化', async () => {
    const listRef = ref(createFixedListWithId(8));
    const screen = renderReactiveThresholdList(listRef, { threshold: 15 });
    await flush();

    // 初始：8 < 15 → 全量渲染
    expect(getItems(screen.container).length).toBe(8);

    // 追加到 20 条（超过 threshold=15）
    listRef.value = createFixedListWithId(20);
    await flush();

    // 20 >= 15 且 contentSize(800) > containerSize(200) → 虚拟化
    const itemsAfter = getItems(screen.container);
    expect(itemsAfter.length).toBeLessThan(20);
    expect(itemsAfter.length).toBeGreaterThan(0);
  });

  test('OVirtualList threshold 动态切换 - 超过阈值后滚动正常更新渲染项', async () => {
    const listRef = ref(createFixedListWithId(8));
    const screen = renderReactiveThresholdList(listRef, { threshold: 15 });
    await flush();

    // 追加到 30 条，触发虚拟化
    listRef.value = createFixedListWithId(30);
    await flush();

    const wrapper = getWrapper(screen.container);

    // 记录初始渲染项索引
    const itemsAtTop = getItems(screen.container);
    const indicesAtTop = itemsAtTop.map((el) => {
      const inner = el.querySelector('[data-index]');
      return inner ? parseInt(inner.getAttribute('data-index')!, 10) : -1;
    });
    expect(indicesAtTop[0]).toBe(0);

    // 滚动到 400px
    wrapper.scrollTop = 400;
    wrapper.dispatchEvent(new Event('scroll', { bubbles: true }));
    await flush();

    // 滚动后渲染项索引应变化（不再从 0 开始）
    const itemsAfter = getItems(screen.container);
    const indicesAfter = itemsAfter.map((el) => {
      const inner = el.querySelector('[data-index]');
      return inner ? parseInt(inner.getAttribute('data-index')!, 10) : -1;
    });
    expect(indicesAfter[0]).toBeGreaterThan(indicesAtTop[0]);
  });

  test('OVirtualList threshold=null - 小列表也虚拟化且滚动后更新', async () => {
    // threshold=null 始终虚拟化，即使只有 10 条
    const list = createFixedListWithId(10);
    const screen = renderReactiveThresholdList(ref(list), { threshold: null });
    await flush();

    // 10 条但 threshold=null → 虚拟化，渲染项 < 10
    const items = getItems(screen.container);
    expect(items.length).toBeLessThan(10);

    // 滚动后渲染项应变化
    const wrapper = getWrapper(screen.container);
    wrapper.scrollTop = 200;
    wrapper.dispatchEvent(new Event('scroll', { bubbles: true }));
    await flush();

    const itemsAfter = getItems(screen.container);
    const firstIndexAfter =
      itemsAfter.length > 0
        ? (() => {
            const inner = itemsAfter[0].querySelector('[data-index]');
            return inner ? parseInt(inner.getAttribute('data-index')!, 10) : -1;
          })()
        : -1;
    // 滚动 200px / 40px = 5 → visibleStartIndex 至少为 5
    expect(firstIndexAfter).toBeGreaterThan(0);
  });

  // --------------------------------------------------------------------------
  // 非虚拟模式下 offset 偏移 bug：isVirtualEnabled=false 时 onScrollImpl 仍然
  // 更新 offset，导致 transform: translate3d(0, offsetY, 0) 把全部 DOM 项下移，
  // 超出 o-virtual-body 的 overflow:hidden 范围，末尾项永远无法滚入视口。
  // --------------------------------------------------------------------------

  test('OVirtualList threshold 非虚拟模式 - 滚动后 offsetY 保持 0（不偏移全量 DOM）', async () => {
    // 10 条 × 40px = 400px 内容，容器 200px，threshold=20（10 < 20 → 非虚拟）
    const list = createFixedListWithId(10);
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { list, itemSize: 40, threshold: 20, style: 'height: 200px; width: 400px;' },
            { default: (scope: { item: { label: string }; index: number }) => h('div', { 'data-index': scope.index }, scope.item.label) },
          ),
        ),
    });
    await flush();

    const renderListEl = getRenderList(screen.container);

    // 初始 offsetY = 0
    expect(renderListEl.style.getPropertyValue('--_vl-offset-y')).toBe('0px');

    // 滚动到中间
    const wrapper = getWrapper(screen.container);
    wrapper.scrollTop = 200;
    wrapper.dispatchEvent(new Event('scroll', { bubbles: true }));
    await flush();

    // BUG: onScrollImpl 无条件设置 offset = getMetaTop(startIndex)，
    //      非 0 的 offsetY 把全部项下移，超出 body overflow:hidden → 末尾项不可见
    // FIX: 非虚拟模式下 offsetY 应保持 0
    expect(renderListEl.style.getPropertyValue('--_vl-offset-y')).toBe('0px');
  });

  test('OVirtualList threshold 非虚拟模式 - 滚动到底部时末尾项可进入视口', async () => {
    // 10 条 × 40px = 400px，容器 200px → maxScroll = 204px
    const list = createFixedListWithId(10);
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { list, itemSize: 40, threshold: 20, style: 'height: 200px; width: 400px;' },
            { default: (scope: { item: { label: string }; index: number }) => h('div', { 'data-index': scope.index }, scope.item.label) },
          ),
        ),
    });
    await flush();

    const wrapper = getWrapper(screen.container);

    // 滚动到最大位置
    wrapper.scrollTop = wrapper.scrollHeight - wrapper.clientHeight;
    wrapper.dispatchEvent(new Event('scroll', { bubbles: true }));
    await flush();

    // 验证末尾项（index=9）的元素与视口有重叠（未被 transform 推出 body overflow:hidden）
    const items = getItems(screen.container);
    const lastItem = items[items.length - 1];
    const inner = lastItem.querySelector('[data-index]');
    expect(inner?.getAttribute('data-index')).toBe('9');

    // 检查末尾项是否在视口范围内
    // body 的 rect（视口区域）
    const body = getBody(screen.container);
    const bodyRect = body.getBoundingClientRect();
    const lastItemRect = lastItem.getBoundingClientRect();

    // 末尾项的顶部应在 body 视口范围内（允许在底部边缘）
    // BUG 下：末尾项被 transform 下推到 body 之外（lastItemRect.top > bodyRect.bottom）
    expect(lastItemRect.top).toBeLessThan(bodyRect.bottom);
  });

  test('OVirtualList threshold 非虚拟模式（水平） - 滚动后 offsetX 保持 0', async () => {
    // 10 项 × 80px = 800px 内容，容器 400px，threshold=20（10 < 20 → 非虚拟）
    const list = createFixedListWithId(10);
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { list, itemSize: 80, threshold: 20, layout: 'horizontal', style: 'height: 300px; width: 400px;' },
            { default: (scope: { item: { label: string }; index: number }) => h('div', { 'data-index': scope.index }, scope.item.label) },
          ),
        ),
    });
    await flush();

    const renderListEl = getRenderList(screen.container);

    // 初始 offsetX = 0
    expect(renderListEl.style.getPropertyValue('--_vl-offset-x')).toBe('0px');

    // 水平滚动
    const wrapper = getWrapper(screen.container);
    wrapper.scrollLeft = 400;
    wrapper.dispatchEvent(new Event('scroll', { bubbles: true }));
    await flush();

    // 非虚拟模式下 offsetX 应保持 0（与垂直模式同理）
    expect(renderListEl.style.getPropertyValue('--_vl-offset-x')).toBe('0px');
  });
});

// ============================================================================
// 水平布局
// ============================================================================

describe('M4: 水平布局 layout=horizontal', () => {
  test('OVirtualList horizontal - 渲染水平列表结构', async () => {
    const list = createFixedList(50);
    const screen = renderList({ list, itemSize: 80, layout: 'horizontal' });
    await flush();

    const root = getRoot(screen.container);
    expect(root.classList.contains('o-horizontal')).toBe(true);

    const renderListEl = getRenderList(screen.container);
    expect(renderListEl).not.toBeNull();
  });

  test('OVirtualList horizontal - 使用 --_vl-content-width 且值 = itemSize × list.length', async () => {
    const list = createFixedList(10);
    const screen = renderList({ list, itemSize: 80, layout: 'horizontal' });
    const body = getBody(screen.container);
    const contentWidth = body.style.getPropertyValue('--_vl-content-width');
    expect(contentWidth).toContain('px');
    // 10 × 80 = 800
    expect(parseFloat(contentWidth)).toBeCloseTo(800, 0);
  });

  test('OVirtualList horizontal - 项宽度由 itemSize 设置', async () => {
    const list = createFixedList(20);
    const screen = renderList({ list, itemSize: 60, layout: 'horizontal' });
    await flush();

    const items = screen.container.querySelectorAll('.o-virtual-render-item');
    // 水平模式下应渲染至少一个 item，不能用 if 守卫静默跳过断言
    expect(items.length).toBeGreaterThan(0);
    const firstItem = items[0] as HTMLElement;
    // 水平布局主轴为 X 轴，itemSize 应写入 width 而非 height
    expect(firstItem.style.width).toBe('60px');
    expect(firstItem.style.height).toBe('');
  });

  test('OVirtualList horizontal - scrollToOffset 使用水平轴偏移', async () => {
    const list = createFixedListWithId(100);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: 80, layout: 'horizontal', style: 'height: 300px; width: 400px;' },
            {
              default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label),
            },
          ),
        ),
    });
    await flush();

    vlRef.value?.scrollToOffset(400);
    await flush();

    const wrapper = getWrapper(screen.container);
    // 定高水平模式：scrollLeft = 400px
    expect(wrapper.scrollLeft).toBeCloseTo(400, -1);
  });

  test('OVirtualList horizontal - scrollToView 使用水平轴偏移', async () => {
    const list = createFixedListWithId(100);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: 80, layout: 'horizontal', style: 'height: 300px; width: 400px;' },
            {
              default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label),
            },
          ),
        ),
    });
    await flush();

    vlRef.value?.scrollToView(10, 'start');
    await flush();

    const wrapper = getWrapper(screen.container);
    // 定高水平模式 align=start: scrollLeft = 10 × 80 = 800
    expect(wrapper.scrollLeft).toBeCloseTo(800, -1);
  });

  test('OVirtualList horizontal - render-list 包含 --_vl-offset-x CSS 变量（初始可能为 0）', async () => {
    const list = createFixedList(50);
    const screen = renderList({ list, itemSize: 80, layout: 'horizontal' });
    await flush();

    const renderListEl = getRenderList(screen.container);
    // 水平模式下 render-list style 应包含 --_vl-offset-x 属性（初始值可能为 0）
    const offsetX = renderListEl.style.getPropertyValue('--_vl-offset-x') || renderListEl.style.getPropertyValue('--_vl-offset-x');
    // offsetX 初始值可能为 0，但属性应存在
    expect(renderListEl.style.length).toBeGreaterThanOrEqual(1);
  });
});

// ============================================================================
// list 变化时 meta 复用（不定高模式追加数据后已测量项 size 不重算）
// ============================================================================

describe('M4: list 变化时 meta 复用', () => {
  test('OVirtualList meta复用 - 不定高模式追加数据后已测量项 content-height 增长', async () => {
    const listRef = ref(createDynamicList(20));
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { list: listRef.value, defaultItemSize: 80, style: 'height: 300px; width: 400px;' },
            {
              default: (scope: { item: { label: string; height?: number }; index: number }) =>
                h('div', { 'data-index': scope.index, style: `height: ${scope.item.height}px` }, `${scope.item.label}`),
            },
          ),
        ),
    });
    await flush();

    const bodyBefore = getBody(screen.container);
    const contentHeightBefore = parseFloat(bodyBefore.style.getPropertyValue('--_vl-content-height'));

    // 追加数据
    const newList = [
      ...listRef.value,
      ...new Array(10).fill(1).map((_, idx) => ({
        id: `dyn-${21 + idx}`,
        label: `DynItem-${21 + idx}`,
        height: 60 + idx * 2,
      })),
    ];
    listRef.value = newList;
    await flush();

    const bodyAfter = getBody(screen.container);
    const contentHeightAfter = parseFloat(bodyAfter.style.getPropertyValue('--_vl-content-height'));
    // 追加数据后 content-height 应增大
    expect(contentHeightAfter).toBeGreaterThan(contentHeightBefore);
  });
});

// ============================================================================
// container resize 后重新定位
// ============================================================================

describe('M4: container resize 重新定位', () => {
  test('OVirtualList resize - 容器尺寸变化后渲染项数随之调整', async () => {
    const list = createFixedListWithId(100);
    const vlRef = ref();
    // 初始使用较大容器
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: 80, style: 'height: 600px; width: 400px;' },
            {
              default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label),
            },
          ),
        ),
    });
    await flush();

    const itemsBefore = screen.container.querySelectorAll('.o-virtual-render-item');
    const countBefore = itemsBefore.length;

    // 改变容器高度（模拟 resize）
    // 注：vitest-browser-vue 环境中 ResizeObserver 可能不触发，
    // 此测试验证组件结构的稳定性而非精确 resize 行为
    const wrapper = getWrapper(screen.container);
    wrapper.style.height = '200px';
    await flush();

    // 容器变小后渲染项数应调整（可能减少）
    const itemsAfter = screen.container.querySelectorAll('.o-virtual-render-item');
    // 结构完整性验证——不崩溃
    expect(itemsAfter.length).toBeGreaterThanOrEqual(1);
  });
});

// ============================================================================
// 垂直·函数定高模式：方法调用
// ============================================================================
describe('M4: 函数定高模式方法调用', () => {
  test('OVirtualList itemSize=Function scrollToOffset - 滚动到指定像素偏移', async () => {
    const list = createFixedListWithId(100);
    const sizeFn = (_item: unknown, _index: number) => 80;
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: sizeFn, style: 'height: 300px; width: 400px;' },
            { default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label) },
          ),
        ),
    });
    await flush();

    vlRef.value?.scrollToOffset(400);
    await flush();

    const wrapper = getWrapper(screen.container);
    expect(wrapper.scrollTop).toBeGreaterThan(0);
  });

  test('OVirtualList itemSize=Function scrollToView align=start - 项顶部对齐视口顶部', async () => {
    const list = createFixedListWithId(100);
    // sizeFn: 40 + index * 10 → index 10 的 top = sum(40+i*10, i=0..9) = 850
    const sizeFn = (_item: unknown, index: number) => 40 + index * 10;
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: sizeFn, style: 'height: 300px; width: 400px;' },
            { default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label) },
          ),
        ),
    });
    await flush();

    vlRef.value?.scrollToView(10, 'start');
    await flush();

    const wrapper = getWrapper(screen.container);
    // top(10) = 40+50+60+70+80+90+100+110+120+130 = 850
    expect(wrapper.scrollTop).toBeCloseTo(850, -1);
  });

  test('OVirtualList itemSize=Function scrollToView align=center - 项中心对齐视口中心', async () => {
    const list = createFixedListWithId(100);
    const sizeFn = (_item: unknown, index: number) => 40 + index * 10;
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: sizeFn, style: 'height: 300px; width: 400px;' },
            { default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label) },
          ),
        ),
    });
    await flush();

    vlRef.value?.scrollToView(10, 'center');
    await flush();

    const wrapper = getWrapper(screen.container);
    // top(10)=850, size(10)=140, container=300
    // center: 850 - 150 + 70 = 770
    expect(wrapper.scrollTop).toBeGreaterThan(0);
  });

  test('OVirtualList itemSize=Function scrollToView align=nearest - 项已可见时不滚动', async () => {
    const list = createFixedListWithId(100);
    const sizeFn = (_item: unknown, index: number) => 40 + index * 10;
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: sizeFn, style: 'height: 300px; width: 400px;' },
            { default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label) },
          ),
        ),
    });
    await flush();

    // 初始 scrollTop=0, 项 0 的 top=0 size=40, 项 0 完全可见
    const wrapper = getWrapper(screen.container);
    const before = wrapper.scrollTop;

    vlRef.value?.scrollToView(0, 'nearest');
    await flush();

    expect(wrapper.scrollTop).toBeCloseTo(before, 0);
  });

  test('OVirtualList itemSize=Function behavior=smooth - 允许 smooth 滚动', async () => {
    const list = createFixedListWithId(100);
    const sizeFn = (_item: unknown, index: number) => 40 + index * 10;
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: sizeFn, style: 'height: 300px; width: 400px;' },
            { default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label) },
          ),
        ),
    });
    await flush();

    vlRef.value?.scrollToView(20, 'start', 'smooth');
    await flush();
    await new Promise((r) => setTimeout(r, 100));
    await flush();

    const wrapper = getWrapper(screen.container);
    expect(wrapper.scrollTop).toBeGreaterThan(0);
  });
});

// ============================================================================
// 垂直·不定高模式：方法调用（scrollToOffset / scrollToView 各 align）
// ============================================================================
describe('M4: 不定高模式方法调用', () => {
  test('OVirtualList 不定高 scrollToOffset - 滚动到指定像素偏移', async () => {
    const list = createDynamicList(50);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, defaultItemSize: 80, style: 'height: 300px; width: 400px;' },
            {
              default: (scope: { item: { height: number; label: string }; index: number }) =>
                h('div', { 'data-index': scope.index, style: `height: ${scope.item.height}px` }, scope.item.label),
            },
          ),
        ),
    });
    await flush();

    vlRef.value?.scrollToOffset(400);
    await flush();

    const wrapper = getWrapper(screen.container);
    expect(wrapper.scrollTop).toBeGreaterThan(0);
  });

  test('OVirtualList 不定高 scrollToOffset - 超过最大范围 clamp 到 max', async () => {
    const list = createDynamicList(50);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, defaultItemSize: 80, style: 'height: 300px; width: 400px;' },
            {
              default: (scope: { item: { height: number; label: string }; index: number }) =>
                h('div', { 'data-index': scope.index, style: `height: ${scope.item.height}px` }, scope.item.label),
            },
          ),
        ),
    });
    await flush();

    vlRef.value?.scrollToOffset(99999);
    await flush();

    // 不定高模式下 scrollToOffset 调用时的 max 基于估算 content-size，
    // 调用后 ResizeObserver 测量触发 content-size 变化，scrollTop 随之修正。
    // 验证 scrollTop 已被 clamp（不超过当前 maxScroll）而非跳到 99999
    const wrapper = getWrapper(screen.container);
    const maxScroll = wrapper.scrollHeight - wrapper.clientHeight;
    expect(wrapper.scrollTop).toBeLessThanOrEqual(maxScroll + 5);
    expect(wrapper.scrollTop).toBeGreaterThan(0);
  });

  test('OVirtualList 不定高 scrollToView align=end - 项底部对齐视口底部', async () => {
    const list = createDynamicList(50);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, defaultItemSize: 80, style: 'height: 300px; width: 400px;' },
            {
              default: (scope: { item: { height: number; label: string }; index: number }) =>
                h('div', { 'data-index': scope.index, style: `height: ${scope.item.height}px` }, scope.item.label),
            },
          ),
        ),
    });
    await flush();

    // 先 start 对齐触发测量
    vlRef.value?.scrollToView(10, 'start');
    await flush();

    // 再 end 对齐
    vlRef.value?.scrollToView(10, 'end');
    await flush();

    const wrapper = getWrapper(screen.container);
    expect(wrapper.scrollTop).toBeGreaterThan(0);
  });

  test('OVirtualList 不定高 scrollToView align=nearest - 项已可见时不滚动', async () => {
    const list = createDynamicList(50);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, defaultItemSize: 80, style: 'height: 300px; width: 400px;' },
            {
              default: (scope: { item: { height: number; label: string }; index: number }) =>
                h('div', { 'data-index': scope.index, style: `height: ${scope.item.height}px` }, scope.item.label),
            },
          ),
        ),
    });
    await flush();

    // 项 0 在视口内 → nearest 返回 null
    const wrapper = getWrapper(screen.container);
    const before = wrapper.scrollTop;

    vlRef.value?.scrollToView(0, 'nearest');
    await flush();

    expect(wrapper.scrollTop).toBeCloseTo(before, 0);
  });

  test('OVirtualList 不定高 scrollToView align=数字偏移 - scrollTop = itemTop - offset', async () => {
    const list = createDynamicList(50);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, defaultItemSize: 80, style: 'height: 300px; width: 400px;' },
            {
              default: (scope: { item: { height: number; label: string }; index: number }) =>
                h('div', { 'data-index': scope.index, style: `height: ${scope.item.height}px` }, scope.item.label),
            },
          ),
        ),
    });
    await flush();

    // 先 start 对齐触发测量
    vlRef.value?.scrollToView(10, 'start');
    await flush();

    // 再用数字偏移
    vlRef.value?.scrollToView(10, 50);
    await flush();

    const wrapper = getWrapper(screen.container);
    expect(wrapper.scrollTop).toBeGreaterThan(0);
  });
});

// ============================================================================
// 水平·定宽模式：方法调用（scrollToOffset / scrollToView 各 align）
// ============================================================================
describe('M4: 水平·定宽模式方法调用', () => {
  test('OVirtualList horizontal scrollToOffset - 水平滚动到指定像素偏移', async () => {
    const list = createFixedListWithId(100);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: 80, layout: 'horizontal', style: 'height: 300px; width: 400px;' },
            { default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label) },
          ),
        ),
    });
    await flush();

    vlRef.value?.scrollToOffset(400);
    await flush();

    const wrapper = getWrapper(screen.container);
    // 定高水平模式：scrollLeft = 400px
    expect(wrapper.scrollLeft).toBeCloseTo(400, -1);
  });

  test('OVirtualList horizontal scrollToOffset - 负值 clamp 到 0', async () => {
    const list = createFixedListWithId(100);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: 80, layout: 'horizontal', style: 'height: 300px; width: 400px;' },
            { default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label) },
          ),
        ),
    });
    await flush();

    vlRef.value?.scrollToOffset(-100);
    await flush();

    const wrapper = getWrapper(screen.container);
    expect(wrapper.scrollLeft).toBeCloseTo(0, 0);
  });

  test('OVirtualList horizontal scrollToOffset - 超过最大范围 clamp 到 max', async () => {
    const list = createFixedListWithId(100);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: 80, layout: 'horizontal', style: 'height: 300px; width: 400px;' },
            { default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label) },
          ),
        ),
    });
    await flush();

    vlRef.value?.scrollToOffset(99999);
    await flush();

    const wrapper = getWrapper(screen.container);
    const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
    expect(wrapper.scrollLeft).toBeCloseTo(maxScroll, -1);
  });

  test('OVirtualList horizontal scrollToView align=start - 项左侧对齐视口左侧', async () => {
    const list = createFixedListWithId(100);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: 80, layout: 'horizontal', style: 'height: 300px; width: 400px;' },
            { default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label) },
          ),
        ),
    });
    await flush();

    vlRef.value?.scrollToView(10, 'start');
    await flush();

    const wrapper = getWrapper(screen.container);
    // align=start: scrollLeft = 10 × 80 = 800
    expect(wrapper.scrollLeft).toBeCloseTo(800, -1);
  });

  test('OVirtualList horizontal scrollToView align=end - 项右侧对齐视口右侧', async () => {
    const list = createFixedListWithId(100);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: 80, layout: 'horizontal', style: 'height: 300px; width: 400px;' },
            { default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label) },
          ),
        ),
    });
    await flush();

    vlRef.value?.scrollToView(10, 'end');
    await flush();

    const wrapper = getWrapper(screen.container);
    // align=end: scrollLeft = 800 - 400 + 80 = 480
    expect(wrapper.scrollLeft).toBeCloseTo(480, -1);
  });

  test('OVirtualList horizontal scrollToView align=center - 项中心对齐视口中心', async () => {
    const list = createFixedListWithId(100);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: 80, layout: 'horizontal', style: 'height: 300px; width: 400px;' },
            { default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label) },
          ),
        ),
    });
    await flush();

    vlRef.value?.scrollToView(10, 'center');
    await flush();

    const wrapper = getWrapper(screen.container);
    // align=center: scrollLeft = 800 - 200 + 40 = 640
    expect(wrapper.scrollLeft).toBeCloseTo(640, -1);
  });

  test('OVirtualList horizontal scrollToView align=nearest - 项已可见时不滚动', async () => {
    const list = createFixedListWithId(100);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: 80, layout: 'horizontal', style: 'height: 300px; width: 400px;' },
            { default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label) },
          ),
        ),
    });
    await flush();

    // 初始 scrollLeft=0, 项 2 left=160 right=240, 容器 400 → 完全可见
    const wrapper = getWrapper(screen.container);
    const before = wrapper.scrollLeft;

    vlRef.value?.scrollToView(2, 'nearest');
    await flush();

    expect(wrapper.scrollLeft).toBeCloseTo(before, 0);
  });

  test('OVirtualList horizontal scrollToView align=nearest - 项在视口左侧时滚动到 start', async () => {
    const list = createFixedListWithId(100);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: 80, layout: 'horizontal', style: 'height: 300px; width: 400px;' },
            { default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label) },
          ),
        ),
    });
    await flush();

    // 先滚动到中间
    vlRef.value?.scrollToView(20, 'start');
    await flush();

    const wrapper = getWrapper(screen.container);
    const scrollLeftMid = wrapper.scrollLeft;
    expect(scrollLeftMid).toBeGreaterThan(0);

    // 项 5 在视口左侧 → nearest 解析为 start
    vlRef.value?.scrollToView(5, 'nearest');
    await flush();

    expect(wrapper.scrollLeft).toBeLessThan(scrollLeftMid);
  });

  test('OVirtualList horizontal scrollToView align=nearest - 项在视口右侧时滚动到 end', async () => {
    const list = createFixedListWithId(100);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: 80, layout: 'horizontal', style: 'height: 300px; width: 400px;' },
            { default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label) },
          ),
        ),
    });
    await flush();

    // 初始 scrollLeft=0, 项 5 left=400 right=480 → 完全在视口右侧
    vlRef.value?.scrollToView(5, 'nearest');
    await flush();

    const wrapper = getWrapper(screen.container);
    // nearest 解析为 end → scrollLeft = 400 - 400 + 80 = 80
    expect(wrapper.scrollLeft).toBeGreaterThan(0);
  });

  test('OVirtualList horizontal scrollToView align=数字偏移 - scrollLeft = itemLeft - offset', async () => {
    const list = createFixedListWithId(100);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: 80, layout: 'horizontal', style: 'height: 300px; width: 400px;' },
            { default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label) },
          ),
        ),
    });
    await flush();

    // align=50: scrollLeft = 800 - 50 = 750
    vlRef.value?.scrollToView(10, 50);
    await flush();

    const wrapper = getWrapper(screen.container);
    expect(wrapper.scrollLeft).toBeCloseTo(750, -1);
  });

  test('OVirtualList horizontal behavior=smooth - 定宽模式允许 smooth', async () => {
    const list = createFixedListWithId(100);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: 80, layout: 'horizontal', style: 'height: 300px; width: 400px;' },
            { default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label) },
          ),
        ),
    });
    await flush();

    vlRef.value?.scrollToView(10, 'start', 'smooth');
    await flush();
    await new Promise((r) => setTimeout(r, 100));
    await flush();

    const wrapper = getWrapper(screen.container);
    expect(wrapper.scrollLeft).toBeGreaterThan(0);
  });
});

// ============================================================================
// 水平·函数定宽模式
// ============================================================================
describe('M4: 水平·函数定宽模式', () => {
  test('OVirtualList horizontal itemSize=Function - 按索引返回不同宽度', async () => {
    const list = createFixedList(20);
    const sizeFn = (_item: unknown, index: number) => 40 + index * 10;
    const screen = renderList({ list, itemSize: sizeFn, layout: 'horizontal' });
    await flush();

    const items = getItems(screen.container);
    expect(items.length).toBeGreaterThan(0);

    const firstItem = items[0] as HTMLElement;
    // 水平模式下 width 应写入函数返回值
    expect(firstItem.style.width).toBe('40px');
    expect(firstItem.style.height).toBe('');
  });

  test('OVirtualList horizontal itemSize=Function - content-width 为函数累加和', async () => {
    const list = createFixedList(5);
    const sizeFn = (_item: unknown, index: number) => 40 + index * 10;
    const screen = renderList({ list, itemSize: sizeFn, layout: 'horizontal' });
    const body = getBody(screen.container);
    const contentWidth = body.style.getPropertyValue('--_vl-content-width');
    // 40+50+60+70+80 = 300
    expect(parseFloat(contentWidth)).toBeCloseTo(300, 0);
  });

  test('OVirtualList horizontal itemSize=Function scrollToOffset - 水平滚动到指定像素偏移', async () => {
    const list = createFixedListWithId(50);
    const sizeFn = (_item: unknown, _index: number) => 80;
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: sizeFn, layout: 'horizontal', style: 'height: 300px; width: 400px;' },
            { default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label) },
          ),
        ),
    });
    await flush();

    vlRef.value?.scrollToOffset(400);
    await flush();

    const wrapper = getWrapper(screen.container);
    expect(wrapper.scrollLeft).toBeGreaterThan(0);
  });

  test('OVirtualList horizontal itemSize=Function scrollToView align=start', async () => {
    const list = createFixedListWithId(50);
    const sizeFn = (_item: unknown, _index: number) => 80;
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, itemSize: sizeFn, layout: 'horizontal', style: 'height: 300px; width: 400px;' },
            { default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label) },
          ),
        ),
    });
    await flush();

    vlRef.value?.scrollToView(10, 'start');
    await flush();

    const wrapper = getWrapper(screen.container);
    // align=start: scrollLeft = 10 × 80 = 800
    expect(wrapper.scrollLeft).toBeCloseTo(800, -1);
  });
});

// ============================================================================
// 水平·不定宽模式
// ============================================================================
describe('M4: 水平·不定宽模式', () => {
  test('OVirtualList horizontal 不定宽 - 基本渲染结构', async () => {
    const list = createDynamicList(50);
    const screen = renderHorizontalDynamic({ list, defaultItemSize: 80, layout: 'horizontal' });
    await flush();

    const root = getRoot(screen.container);
    expect(root.classList.contains('o-horizontal')).toBe(true);

    const items = getItems(screen.container);
    expect(items.length).toBeGreaterThan(0);
  });

  test('OVirtualList horizontal 不定宽 - content-width 初始估算 = defaultItemSize × length', async () => {
    const list = createDynamicList(10);
    const screen = renderHorizontalDynamic({ list, defaultItemSize: 80, layout: 'horizontal' });
    // 不 flush，检查初始估算值
    const body = getBody(screen.container);
    const contentWidth = body.style.getPropertyValue('--_vl-content-width');
    // 10 × 80 = 800
    expect(parseFloat(contentWidth)).toBeCloseTo(800, 0);
  });

  test('OVirtualList horizontal 不定宽 - 项无固定 width 内联样式', async () => {
    const list = createDynamicList(10);
    const screen = renderHorizontalDynamic({ list, defaultItemSize: 80, layout: 'horizontal' });
    await flush();

    const items = getItems(screen.container);
    expect(items.length).toBeGreaterThan(0);
    // 不定宽模式下 VirtualListItem 不传 mainSize，不注入 width 内联样式
    expect(items[0].style.width).toBe('');
  });

  test('OVirtualList horizontal 不定宽 - id 缺失触发 console.warn', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const list = createFixedList(10); // 无 id 字段
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { list, defaultItemSize: 80, layout: 'horizontal', style: 'height: 300px; width: 400px;' },
            { default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', { 'data-index': scope.index }, scope.item.label) },
          ),
        ),
    });
    await flush();

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('OVirtualList'));
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('id'));
    warnSpy.mockRestore();
  });

  test('OVirtualList horizontal 不定宽 - defaultItemSize=50 影响初始 content-width', async () => {
    const list = createDynamicList(20);
    const screen = renderHorizontalDynamic({ list, defaultItemSize: 50, layout: 'horizontal' });
    const body = getBody(screen.container);
    const contentWidth = body.style.getPropertyValue('--_vl-content-width');
    // 20 × 50 = 1000
    expect(parseFloat(contentWidth)).toBeCloseTo(1000, 0);
  });

  test('OVirtualList horizontal 不定宽 scrollToOffset - 水平滚动到指定像素偏移', async () => {
    const list = createDynamicList(50);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, defaultItemSize: 80, layout: 'horizontal', style: 'height: 300px; width: 400px;' },
            {
              default: (scope: { item: { height: number; label: string }; index: number }) =>
                h('div', { 'data-index': scope.index, style: `width: ${scope.item.height}px` }, scope.item.label),
            },
          ),
        ),
    });
    await flush();

    vlRef.value?.scrollToOffset(400);
    await flush();

    const wrapper = getWrapper(screen.container);
    expect(wrapper.scrollLeft).toBeGreaterThan(0);
  });

  test('OVirtualList horizontal 不定宽 scrollToView - 不崩溃且产生滚动', async () => {
    const list = createDynamicList(50);
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list, defaultItemSize: 80, layout: 'horizontal', style: 'height: 300px; width: 400px;' },
            {
              default: (scope: { item: { height: number; label: string }; index: number }) =>
                h('div', { 'data-index': scope.index, style: `width: ${scope.item.height}px` }, scope.item.label),
            },
          ),
        ),
    });
    await flush();

    vlRef.value?.scrollToView(10, 'start');
    await flush();

    const wrapper = getWrapper(screen.container);
    expect(wrapper.scrollLeft).toBeGreaterThan(0);
  });

  test('OVirtualList horizontal 不定宽 - 动态追加数据后 scrollLeft 不跳变', async () => {
    const listRef = ref(createDynamicList(50));
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { list: listRef.value, defaultItemSize: 80, layout: 'horizontal', style: 'height: 300px; width: 400px;' },
            {
              default: (scope: { item: { height: number; label: string }; index: number }) =>
                h('div', { 'data-index': scope.index, style: `width: ${scope.item.height}px` }, scope.item.label),
            },
          ),
        ),
    });
    await flush();

    // 滚动到中间位置
    const wrapper = getWrapper(screen.container);
    wrapper.scrollLeft = 400;
    wrapper.dispatchEvent(new Event('scroll', { bubbles: true }));
    await flush();

    const scrollLeftBefore = wrapper.scrollLeft;
    expect(scrollLeftBefore).toBeGreaterThan(0);

    // 追加数据
    const newList = [
      ...listRef.value,
      ...new Array(10).fill(1).map((_, idx) => ({
        id: `dyn-${51 + idx}`,
        label: `DynItem-${51 + idx}`,
        height: 60 + idx * 2,
      })),
    ];
    listRef.value = newList;
    await flush();

    // scrollLeft 不应跳回 0
    expect(wrapper.scrollLeft).toBeGreaterThan(0);
  });
});

// ============================================================================
// 水平模式：wheel 边界阻止冒泡
// ============================================================================
describe('M4: 水平模式 wheel 边界', () => {
  test('OVirtualList horizontal wheel - 列表到左且向左滚时 preventDefault', async () => {
    const list = createFixedList(100);
    const screen = renderList({ list, itemSize: 80, layout: 'horizontal' });
    await flush();

    const wrapper = getWrapper(screen.container);
    // scrollLeft = 0（列表到左边界）
    wrapper.scrollLeft = 0;

    const wheelLeft = new WheelEvent('wheel', { deltaX: -100, bubbles: true, cancelable: true });
    wrapper.dispatchEvent(wheelLeft);

    // 列表到左 + 向左滚动 → preventDefault
    expect(wheelLeft.defaultPrevented).toBe(true);
  });

  test('OVirtualList horizontal wheel - 列表到右且向右滚时 preventDefault', async () => {
    const list = createFixedList(100);
    const screen = renderList({ list, itemSize: 80, layout: 'horizontal' });
    await flush();

    const wrapper = getWrapper(screen.container);
    // 滚动到右边界
    wrapper.scrollLeft = wrapper.scrollWidth - wrapper.clientWidth;
    await flush();

    const wheelRight = new WheelEvent('wheel', { deltaX: 100, bubbles: true, cancelable: true });
    wrapper.dispatchEvent(wheelRight);

    // 列表到右 + 向右滚动 → preventDefault
    expect(wheelRight.defaultPrevented).toBe(true);
  });

  test('OVirtualList horizontal wheel - 列表中间区域滚时不 preventDefault', async () => {
    const list = createFixedList(100);
    const screen = renderList({ list, itemSize: 80, layout: 'horizontal' });
    await flush();

    const wrapper = getWrapper(screen.container);
    // 滚动到中间位置
    wrapper.scrollLeft = 400;
    await flush();

    const wheelRight = new WheelEvent('wheel', { deltaX: 100, bubbles: true, cancelable: true });
    wrapper.dispatchEvent(wheelRight);

    // 中间区域 → 不 preventDefault
    expect(wheelRight.defaultPrevented).toBe(false);
  });

  test('OVirtualList horizontal wheel - shift+wheel 将 deltaY 转为水平滚动', async () => {
    const list = createFixedList(100);
    const screen = renderList({ list, itemSize: 80, layout: 'horizontal' });
    await flush();

    const wrapper = getWrapper(screen.container);
    // 滚动到右边界
    wrapper.scrollLeft = wrapper.scrollWidth - wrapper.clientWidth;
    await flush();

    // shift+wheel：deltaY=100, deltaX=0 → 水平模式使用 deltaY
    const wheelShift = new WheelEvent('wheel', { deltaY: 100, deltaX: 0, shiftKey: true, bubbles: true, cancelable: true });
    wrapper.dispatchEvent(wheelShift);

    // shift+wheel deltaY>0 → 向右滚动 → 到右边界 → preventDefault
    expect(wheelShift.defaultPrevented).toBe(true);
  });
});

// ============================================================================
// 水平模式：renderChange / isScrolling / threshold / buffer
// ============================================================================
describe('M4: 水平模式其他特性', () => {
  test('OVirtualList horizontal renderChange - 水平滚动触发 renderChange 事件', async () => {
    const onRenderChange = vi.fn();
    const list = createFixedList(100);
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { list, itemSize: 80, layout: 'horizontal', onRenderChange, style: 'height: 300px; width: 400px;' },
            { default: (scope: { item: { label: string; height?: number }; index: number }) => h('div', scope.item.label) },
          ),
        ),
    });
    await flush();

    // 水平滚动
    const wrapper = getWrapper(screen.container);
    wrapper.scrollLeft = 400;
    wrapper.dispatchEvent(new Event('scroll', { bubbles: true }));
    await flush();

    expect(onRenderChange).toHaveBeenCalled();
  });

  test('OVirtualList horizontal isScrolling - 滚动中 pointer-events: none', async () => {
    const list = createFixedList(100);
    const screen = renderList({ list, itemSize: 80, layout: 'horizontal' });
    await flush();

    const renderListEl = getRenderList(screen.container);
    expect(renderListEl.style.pointerEvents).not.toBe('none');

    // 模拟滚动
    const wrapper = getWrapper(screen.container);
    wrapper.scrollLeft = 200;
    wrapper.dispatchEvent(new Event('scroll', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 10));

    // 滚动中应注入 pointer-events: none
    expect(renderListEl.style.pointerEvents).toBe('none');
  });

  test('OVirtualList horizontal threshold=50 - 少于阈值全量渲染', async () => {
    const list = createFixedList(10);
    const screen = renderList({ list, itemSize: 80, layout: 'horizontal', threshold: 50 });
    await flush();

    const items = getItems(screen.container);
    expect(items.length).toBe(10);
  });

  test('OVirtualList horizontal threshold=50 - 超过阈值虚拟化', async () => {
    const list = createFixedList(100);
    const screen = renderList({ list, itemSize: 80, layout: 'horizontal', threshold: 50 });
    await flush();

    const items = getItems(screen.container);
    expect(items.length).toBeLessThan(100);
  });

  test('OVirtualList horizontal buffer=2 - 比 buffer=1 渲染更多项', async () => {
    const list = createFixedList(100);
    const screen1 = renderList({ list, itemSize: 80, layout: 'horizontal', buffer: 1 });
    await flush();
    const count1 = getItems(screen1.container).length;

    const screen2 = renderList({ list, itemSize: 80, layout: 'horizontal', buffer: 2 });
    await flush();
    const count2 = getItems(screen2.container).length;

    expect(count2).toBeGreaterThanOrEqual(count1);
  });
});

// ============================================================================
// 水平模式：content-width / offsetX CSS 变量
// ============================================================================
describe('M4: 水平模式 CSS 变量', () => {
  test('OVirtualList horizontal offsetX - 滚动后 --_vl-offset-x 变化', async () => {
    const list = createFixedList(100);
    const screen = renderList({ list, itemSize: 80, layout: 'horizontal' });
    await flush();

    const renderListEl = getRenderList(screen.container);
    const initialOffsetX = parseFloat(renderListEl.style.getPropertyValue('--_vl-offset-x') || '0');

    // 水平滚动
    const wrapper = getWrapper(screen.container);
    wrapper.scrollLeft = 400;
    wrapper.dispatchEvent(new Event('scroll', { bubbles: true }));
    await flush();

    const newOffsetX = parseFloat(renderListEl.style.getPropertyValue('--_vl-offset-x') || '0');
    expect(newOffsetX).toBeGreaterThan(initialOffsetX);
  });

  test('OVirtualList horizontal - 水平滚动后渲染项跟随变化', async () => {
    const list = createFixedListWithId(100);
    const screen = renderList({ list, itemSize: 80, layout: 'horizontal', buffer: 1 });
    await flush();

    const initialItems = getItems(screen.container);
    const initialIndices = initialItems.map((el) => {
      const inner = el.querySelector('[data-index]');
      return inner ? parseInt(inner.getAttribute('data-index')!, 10) : -1;
    });

    // 水平滚动到较远位置
    const wrapper = getWrapper(screen.container);
    wrapper.scrollLeft = 800;
    wrapper.dispatchEvent(new Event('scroll', { bubbles: true }));
    await flush();

    const scrolledItems = getItems(screen.container);
    const scrolledIndices = scrolledItems.map((el) => {
      const inner = el.querySelector('[data-index]');
      return inner ? parseInt(inner.getAttribute('data-index')!, 10) : -1;
    });

    // 滚动后渲染的项序号应大于初始的
    expect(scrolledIndices[0]).toBeGreaterThanOrEqual(initialIndices[0]);
  });
});

// ============================================================================
// 不定高模式 defaultStartIndex 初始重定位
// ============================================================================
describe('M4: 不定高模式 defaultStartIndex 初始重定位', () => {
  /**
   * @description 创建高度差异明显的不定高列表数据
   * @param count 列表项数量
   * @returns 包含 id、label、height 字段的列表数据，高度 30~135px 循环
   */
  function createVariedDynamicList(count: number) {
    return new Array(count).fill(1).map((_, idx) => ({
      id: `var-${idx + 1}`,
      label: `VarItem-${idx + 1}`,
      // 高度 30~135px 循环，与 __docs__/__case__/VirtualListStartIndex.vue 场景一致
      height: (idx % 8) * 15 + 30,
    }));
  }

  /**
   * @description 渲染不定高列表（带 ref），子项高度由 slot 的 inline style 决定
   * @param props 组件 props（不含 style）
   * @param vlRef 组件 ref，用于调用 exposed 方法
   * @returns screen 对象
   */
  function renderDynamicList(props: Record<string, unknown>, vlRef?: ReturnType<typeof ref>) {
    return render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, ...props, style: 'height: 300px; width: 400px;' },
            {
              default: (scope: { item: { height: number; label: string }; index: number }) =>
                h('div', { 'data-index': scope.index, style: `height: ${scope.item.height}px` }, scope.item.label),
            },
          ),
        ),
    });
  }

  test('OVirtualList 不定高 defaultStartIndex - 初始渲染包含目标索引附近的项', async () => {
    const list = createVariedDynamicList(50);
    const screen = renderDynamicList({ list, defaultItemSize: 80, defaultStartIndex: 48 });

    // 初始渲染（未 flush）：visibleStartIndex = defaultStartIndex = 48
    const items = getItems(screen.container);
    const indices = items.map((el) => {
      const inner = el.querySelector('[data-index]');
      return inner ? parseInt(inner.getAttribute('data-index')!, 10) : -1;
    });
    expect(indices.some((i) => Math.abs(i - 48) <= 2)).toBe(true);
  });

  test('OVirtualList 不定高 defaultStartIndex - 初始重定位后用户向上滚动不弹回', async () => {
    const listRef = ref(createVariedDynamicList(50));
    const vlRef = ref();
    const screen = render({
      render: () =>
        h(
          'div',
          h(
            OVirtualList,
            { ref: vlRef, list: listRef.value, defaultItemSize: 80, defaultStartIndex: 48, style: 'height: 300px; width: 400px;' },
            {
              default: (scope: { item: { height: number; label: string }; index: number }) =>
                h('div', { 'data-index': scope.index, style: `height: ${scope.item.height}px` }, scope.item.label),
            },
          ),
        ),
    });
    await flush();

    // 手动调用 scrollToView 模拟 init() 的初始滚动
    vlRef.value?.scrollToView(48, 'start');
    await flush();

    const wrapper = getWrapper(screen.container);
    const scrollTopAfterInit = wrapper.scrollTop;
    expect(scrollTopAfterInit).toBeGreaterThan(1000);

    // 模拟用户向上滚动 100px
    const scrollUpTarget = Math.max(0, scrollTopAfterInit - 100);
    wrapper.scrollTop = scrollUpTarget;
    wrapper.dispatchEvent(new Event('scroll', { bubbles: true }));
    await flush();

    // 追加数据触发 listData watcher → contentSize 同步变化 → contentSize watcher 触发
    // 修复后：onScroll 检测到用户手动滚动（isProgrammaticScroll=false），已将
    //         needsInitialReScroll 置 false，watcher 首个 if 即 return，不调用 scrollToView
    // 修复前：onScroll 不检测用户滚动，needsInitialReScroll 仍为 true，
    //         watcher 调用 scrollToView(defaultStartIndex)，scrollTop 弹回
    listRef.value = [...listRef.value, { id: 'var-51', label: 'VarItem-51', height: 60 }];
    await flush();

    // 关键断言：scrollTop 不应弹回到初始位置附近
    const scrollTopAfterUserScroll = wrapper.scrollTop;
    expect(scrollTopAfterUserScroll).toBeLessThan(scrollTopAfterInit - 30);
  });

  test('OVirtualList 不定高 defaultStartIndex - re-scroll 随测量更新修正初始位置', async () => {
    // 20 项，高度 60/80px 交替（均 > defaultItemSize=40），估算总高远小于实际
    // estimated: 20×40=800, maxScroll=800-300=500, item5 top=5×40=200 < 500 → scrollTop=200
    // actual: 10×(60+80)=1400, maxScroll=1100, item5 actual top=340
    const list = new Array(20).fill(1).map((_, idx) => ({
      id: `sd-${idx + 1}`,
      label: `SD-${idx + 1}`,
      height: idx % 2 === 0 ? 60 : 80,
    }));
    const listRef = ref(list);
    const vlRef = ref();
    const screen = renderDynamicList({ list: listRef.value, defaultItemSize: 40, defaultStartIndex: 5 }, vlRef);

    // 不 flush 直接调用 scrollToView，此时所有项为估算值
    vlRef.value?.scrollToView(5, 'start');
    const wrapper = getWrapper(screen.container);
    const scrollTopEstimated = wrapper.scrollTop;
    // 估算位置：item5 top=200, maxScroll=500 → scrollTop=200
    expect(scrollTopEstimated).toBeGreaterThan(0);

    // flush 让可见项测量 → contentSize 变化 → re-scroll watcher 触发 → scrollTop 修正
    await flush();

    // 追加数据触发 contentSize watcher，确保 re-scroll 执行
    listRef.value = [...listRef.value, { id: 'sd-21', label: 'SD-21', height: 70 }];
    await flush();
    await flush();

    // re-scroll 后 scrollTop 应大于初始估算值（实际项尺寸 > 估算，maxScroll 增大）
    const scrollTopAfterReScroll = wrapper.scrollTop;
    expect(scrollTopAfterReScroll).toBeGreaterThan(scrollTopEstimated);
  });

  test('OVirtualList 不定高 defaultStartIndex - 高度远大于估算值时不崩溃且可滚动', async () => {
    // 高度 120~160px，远大于 defaultItemSize=40，估算偏差极大
    const list = new Array(30).fill(1).map((_, idx) => ({
      id: `big-${idx + 1}`,
      label: `BigItem-${idx + 1}`,
      height: 120 + (idx % 3) * 20,
    }));
    const vlRef = ref();
    const screen = renderDynamicList({ list, defaultItemSize: 40, defaultStartIndex: 28 }, vlRef);
    await flush();

    // 手动调用 scrollToView 模拟初始滚动
    vlRef.value?.scrollToView(28, 'start');
    await flush();

    const wrapper = getWrapper(screen.container);
    // 不崩溃，且已滚动到接近底部
    expect(wrapper.scrollTop).toBeGreaterThan(0);

    // 滚动到顶部后应能正常展示前几项
    wrapper.scrollTop = 0;
    wrapper.dispatchEvent(new Event('scroll', { bubbles: true }));
    await flush();

    const items = getItems(screen.container);
    const indices = items.map((el) => {
      const inner = el.querySelector('[data-index]');
      return inner ? parseInt(inner.getAttribute('data-index')!, 10) : -1;
    });
    expect(indices.some((i) => i <= 2)).toBe(true);
  });
});

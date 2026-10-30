/**
 * OTab 组件行为契约测试。
 *
 * Spec（桌面端溢出几何模型）：https://gitcode.com/openeuler/opendesign-components/issues/226
 * （原始 bug 报告：#215；规格、实施决策与验收标准以 #226 为权威源）
 *
 * 组织原则：
 *   1. 静态契约（按 types.ts 属性）、maxShow/button 回归护栏（特征化）、
 *      OTabPane 属性契约、动态契约、卸载契约、SSR 契约；
 *   2. 移动端滚动行为：scrollActiveIntoView 仅应水平滚动 nav 容器，
 *      不应触发页面垂直滚动（首屏下方的 OTab 不应把页面拉到 tab 位置）；
 *      指示器 anchor 在手势/编程/激活切换滚动后始终与激活页签对齐；
 *   3. 桌面端溢出几何行为：静态几何契约（variant 非 button、未设置
 *      maxShow 的几何路径）、动态交互收口（几何模型动态场景）、省略号
 *      覆盖区遮蔽、省略号右缘让位滚动——断言组件挂载级 DOM 行为
 *      （class / rect / scrollLeft / 弹层内容），只断言外部可观测行为；
 *   4. maxShow/button 回归护栏（特征化）：maxShow 状态机与 button 变体
 *      是隔离墙内的独立路径（spec Testing Decisions #6），本组断言上述
 *      路径当前行为的保持而非新行为；预期全绿，若红说明几何路径越界。
 *
 * 测试环境勘误：本仓测试基建为 vitest browser mode（真实 Chromium，
 * 真实布局），spec Testing Decisions 中「jsdom 挂载 + scrollTo mock」为
 * 笔误；rect / scrollLeft 直接真值断言，无需 mock。
 *
 * 不归属本文件的维度：
 *   - 断点自适应行为（溢出判定随断点进退）已由本文件断点往返用例覆盖；
 *     尺寸数值断言按仓库现状暂不单列 responsive 文件
 */

import { test, expect, describe, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, reactive, type VNode } from 'vue';
import OTab from '../OTab.vue';
import OTabPane from '../OTabPane.vue';
import { flush, waitFor } from '../../../__tests__/_helpers/dom';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';
import { setViewport } from '../../../__tests__/_helpers/viewport';

/** 滚动宿主：省略号、anchor 均锚定于该容器（position: relative） */
const CONTAINER_SELECTOR = '.o-tab-navs-container';
/** 可见列表（排除零高度的全量测量列表 .width-measurement） */
const VISIBLE_LIST_SELECTOR = '.o-tab-nav-list:not(.width-measurement)';
/** 可见列表内的页签（排除省略号节点，它同样带 .o-tab-nav 类） */
const VISIBLE_NAV_SELECTOR = `${VISIBLE_LIST_SELECTOR} > .o-tab-nav:not(.o-tab-nav-ellipsis)`;
/** 省略号节点（无 maxShow 时） */
const ELLIPSIS_SELECTOR = '.o-tab-nav-ellipsis';

/** 全量测量列表：渲染所有页签、零高度，其宽度即「内容总宽」的外部可观测量 */
const MEASUREMENT_SELECTOR = '.o-tab-nav-list.width-measurement';

/**
 * 省略号弹层（OPopup）内容 Teleport 到 document.body，screen.container
 * 里查不到；同一次测试多次渲染会留下多个弹层，取最后一个（最新实例）。
 * 约定与 OPopup.index.test.ts 一致。
 */
function lastBodyEl<T extends HTMLElement>(selector: string): T | null {
  const els = document.body.querySelectorAll(selector);
  return els.length ? (els[els.length - 1] as T) : null;
}

interface RenderTabsOptions {
  /** 外层容器固定宽度（px），用于精确控制 nav 容器宽度、构造溢出前置条件 */
  width: number;
  /** 页签数量 */
  count: number;
  /** 初始激活页签 */
  modelValue: string;
  /** 变体（默认 text；几何路径用例限定非 button，护栏组覆盖 button 隔离墙路径） */
  variant?: 'text' | 'solid' | 'button';
  /** 最大展示个数（maxShow 状态机路径，护栏组使用） */
  maxShow?: number;
  /** 尺寸（省略号本体宽随字号变化，验证让位身位随尺寸自适应） */
  size?: 'small' | 'medium' | 'large';
}

/** 以固定宽度容器 + N 个「标签N」页签挂载 OTab（桌面端默认 text/medium） */
function renderTabs({ width, count, modelValue, variant = 'text', maxShow, size }: RenderTabsOptions) {
  return render({
    setup() {
      return () =>
        h('div', { style: `width: ${width}px;` }, [
          h(OTab, { modelValue, variant, maxShow, size }, () =>
            Array.from({ length: count }, (_, i) => h(OTabPane, { value: `tab${i + 1}`, label: `标签${i + 1}` })),
          ),
        ]);
    },
  });
}

/** 固定时长等待：弹层过渡显隐等非时间敏感场景（无轮询条件，保持时序不变） */
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * 等布局落定：layout 收口管线（debounceRAF）+ useElementBounding 测量链 +
 * 省略号显隐一帧时差收敛 + scrollTo smooth 滚动落定。
 * 等待策略：flush 驱动 RAF 排空 → waitFor 轮询布局就绪（激活页签或可见
 * 列表已挂载，快机快速返回、慢机自动延长）→ 固定余量覆盖 smooth 滚动
 * 动画全程（scrollTo 无可轮询的完成信号，无法条件化）。
 */
async function settle() {
  await flush();
  await waitFor(() => document.querySelector(ACTIVE_NAV_SELECTOR) != null || document.querySelector(VISIBLE_LIST_SELECTOR) != null);
  await wait(500);
}

/** 读取省略号渐变阴影的左缘（视口坐标）：阴影为省略号节点的 ::before，左移一个阴影宽 */
function getEllipsisShadowLeft(ellipsis: HTMLElement): number {
  const shadowWidth = parseFloat(getComputedStyle(ellipsis, ':before').width) || 0;
  return ellipsis.getBoundingClientRect().left - shadowWidth;
}

/**
 * 断言列表最右内容缘与省略号渐变阴影左缘贴合（双边界，±1px 容差）
 * 仅适用于「滚到最大滚动量」的滚动终点场景：让位身位 = 省略号本体宽 +
 * 阴影宽，末页签右缘应恰好落在阴影左缘——大于容差即「少让位」（内容
 * 侵入覆盖区被裁切），小于容差即「多让位」（尾部露出空白）。只断言
 * 下界发现不了多让位，双向夹逼才完整。scrollLeft=0 的溢出态末页签
 * 右缘本就越过阴影左缘（被容器右缘裁切），不适用本断言。
 * @param screen 渲染句柄
 */
function expectLastNavFlushWithShadow(screen: ScreenLike) {
  const ellipsis = screen.container.querySelector(ELLIPSIS_SELECTOR) as HTMLElement;
  expect(ellipsis, '应存在省略号节点').not.toBeNull();
  const navs = getNavs(screen);
  expect(navs.length, '可见列表应非空').toBeGreaterThan(0);
  const lastRight = navs[navs.length - 1].getBoundingClientRect().right;
  const shadowLeft = getEllipsisShadowLeft(ellipsis);
  expect(Math.abs(lastRight - shadowLeft), '最右内容缘应贴合渐变阴影左缘（少让位侵入 / 多让位出空白均失败）').toBeLessThanOrEqual(1);
}

beforeEach(() => {
  // 防御性清理：正常情况下 vitest-browser-vue 的自动 cleanup 已移除传送门内容
  document.body.querySelectorAll(':scope > .o-popup, :scope > .o-layer').forEach((el) => el.remove());
});
/** vitest-browser-vue render 返回结构的最小类型约束 */
interface ScreenLike {
  container: HTMLElement;
}
/** 省略号弹层 wrap（内容 Teleport 到 document.body） */
const POPUP_SELECTOR = '.o-tab-more-popup';

describe('静态契约（按 types.ts 属性）', () => {
  test('OTab 根元素 class 包含 o-tab', async () => {
    const screen = render(OTab, {
      slots: { default: () => h(OTabPane, { value: '1', label: 'Tab1' }) },
    });
    await flush();
    expect(screen.container.querySelector('.o-tab')).not.toBeNull();
  });

  test('OTab variant - solid/text/button 注入类，默认 text', async () => {
    for (const v of ['solid', 'text', 'button'] as const) {
      const screen = render(OTab, {
        props: { variant: v },
        slots: { default: () => h(OTabPane, { value: '1', label: 'T' }) },
      });
      await flush();
      expect((screen.container.querySelector('.o-tab') as HTMLElement).classList.contains(`o-tab-${v}`)).toBe(true);
      screen.unmount();
      await flush();
    }
  });

  test('OTab modelValue - 指定选中页签', async () => {
    const screen = render(OTab, {
      props: { modelValue: '2' },
      slots: {
        default: () => [h(OTabPane, { value: '1', label: 'T1' }), h(OTabPane, { value: '2', label: 'T2' })],
      },
    });
    await flush();
    const activeNav = screen.container.querySelector('.o-tab-nav-active');
    expect(activeNav).not.toBeNull();
  });

  test('OTab - 渲染页签导航和内容区', async () => {
    const screen = render(OTab, {
      props: { modelValue: '1' },
      slots: {
        default: () => h(OTabPane, { value: '1', label: 'First' }, { default: () => 'Content 1' }),
      },
    });
    await flush();
    expect(screen.container.querySelector('.o-tab-head')).not.toBeNull();
    expect(screen.container.querySelector('.o-tab-body')).not.toBeNull();
    const nav = screen.container.querySelector('.o-tab-nav');
    expect(nav?.textContent).toContain('First');
  });

  test('OTab addable - 渲染添加按钮', async () => {
    const screen = render(OTab, {
      props: { addable: true },
      slots: { default: () => h(OTabPane, { value: '1', label: 'T' }) },
    });
    await flush();
    expect(screen.container.querySelector('.o-tab-nav-add')).not.toBeNull();
  });

  test('OTab line - 默认 true 显示 nav 线', async () => {
    const screen = render(OTab, {
      props: { variant: 'text' },
      slots: { default: () => h(OTabPane, { value: '1', label: 'T' }) },
    });
    await flush();
    expect(screen.container.querySelector('.o-tab-nav-anchor')).not.toBeNull();
  });

  test('OTab variant=button - button 模式不渲染 nav 线', async () => {
    const screen = render(OTab, {
      props: { variant: 'button' },
      slots: { default: () => h(OTabPane, { value: '1', label: 'T' }) },
    });
    await flush();
    expect(screen.container.querySelector('.o-tab-nav-anchor')).toBeNull();
  });

  test('OTab line=false - head 不含 show-line 类', async () => {
    const screen = render(OTab, {
      props: { line: false },
      slots: { default: () => h(OTabPane, { value: '1', label: 'T' }) },
    });
    await flush();
    // line=false 移除 show-line 类，但 anchor 元素仍存在（由 variant=text 决定）
    expect(screen.container.querySelector('.o-tab-head')?.classList.contains('show-line')).toBe(false);
  });

  test('OTab 无 modelValue - 自动选中第一个页签', async () => {
    const screen = render(OTab, {
      slots: {
        default: () => [h(OTabPane, { value: '1', label: 'T1' }), h(OTabPane, { value: '2', label: 'T2' })],
      },
    });
    await flush();
    const activeNav = screen.container.querySelector('.o-tab-nav-active');
    expect(activeNav).not.toBeNull();
    expect(activeNav?.textContent).toContain('T1');
  });

  test('OTab prefix/suffix 插槽 - 渲染前后缀区域', async () => {
    const screen = render(OTab, {
      slots: {
        prefix: () => 'Prefix',
        suffix: () => 'Suffix',
        default: () => h(OTabPane, { value: '1', label: 'T' }),
      },
    });
    await flush();
    expect(screen.container.querySelector('.o-tab-head-prefix')).not.toBeNull();
    expect(screen.container.querySelector('.o-tab-head-suffix')).not.toBeNull();
    expect(screen.container.querySelector('.o-tab-head-prefix')?.textContent).toContain('Prefix');
    expect(screen.container.querySelector('.o-tab-head-suffix')?.textContent).toContain('Suffix');
  });

  test('OTab headerClass - 自定义头部样式类', async () => {
    const screen = render(OTab, {
      props: { headerClass: 'custom-header' },
      slots: { default: () => h(OTabPane, { value: '1', label: 'T' }) },
    });
    await flush();
    expect(screen.container.querySelector('.o-tab-head')?.classList.contains('custom-header')).toBe(true);
  });
});

// ============================================================================
// maxShow/button 回归护栏（特征化用例组）
//
// Spec：https://gitcode.com/opendesign/opendesign-components/issues/226
// Testing Decisions #6「回归护栏：maxShow 路径不变、button 变体不变」：
// 溢出几何模型仅覆盖「无 maxShow + 非 button + 桌面端」路径，maxShow 状态机
// 与 button 变体是隔离墙内的独立路径。本组用例为特征化护栏——断言的是
// 上述路径当前行为的保持，而非新行为；预期全绿，若红说明几何路径越界。
// ============================================================================

/** maxShow 模式「更多」按钮的下拉箭头图标节点（按钮本身不带 .o-tab-nav-ellipsis 类） */
const MORE_ARROW_SELECTOR = '.o-tab-nav-more-arrow';

/**
 * 读取可见列表内的页签元素（排除「更多」按钮——它同带 .o-tab-nav 类，
 * 但 maxShow 模式下不带省略号类名，不能沿用 VISIBLE_NAV_SELECTOR 的排除法）
 */
const getPaneNavs = (screen: ScreenLike) =>
  (Array.from(screen.container.querySelector(VISIBLE_LIST_SELECTOR)!.querySelectorAll(':scope > .o-tab-nav')) as HTMLElement[]).filter(
    (el) => !el.querySelector(MORE_ARROW_SELECTOR),
  );

/** 读取 maxShow 模式的「更多」按钮元素（箭头图标的最近 nav 祖先） */
function getMoreButton(screen: ScreenLike): HTMLElement | null {
  const arrow = screen.container.querySelector(MORE_ARROW_SELECTOR);
  return arrow ? (arrow.closest('.o-tab-nav') as HTMLElement) : null;
}

describe('maxShow/button 回归护栏（特征化）', () => {
  test('maxShow 数量上限折叠 - 可见列表恰 maxShow 项并展示「更多」按钮', async () => {
    await setViewport('desktop');
    // 前置条件：600px 容器 + 10 个页签，数量上限 4 → 宽度约束不参与裁剪
    const screen = renderTabs({ width: 600, count: 10, modelValue: 'tab1', maxShow: 4 });
    await settle();

    // 期望行为（特征化护栏）：数量上限折叠——可见列表恰 4 项（模板序前 4 个）
    const paneNavs = getPaneNavs(screen);
    expect(paneNavs.map((n) => (n.textContent || '').trim())).toEqual(['标签1', '标签2', '标签3', '标签4']);

    // 「更多」按钮展示（含默认文案与箭头图标），容器处于溢出折叠态
    const moreButton = getMoreButton(screen);
    expect(moreButton).not.toBeNull();
    expect(getComputedStyle(moreButton!).display).not.toBe('none');
    expect((moreButton!.textContent || '').trim()).toContain('更多');
    const container = screen.container.querySelector(CONTAINER_SELECTOR) as HTMLElement;
    expect(container.classList.contains('overflown')).toBe(true);
  });

  test('maxShow 溢出预留宽度 - 折叠内容不越过容器宽，宽度上限参与裁剪', async () => {
    await setViewport('desktop');
    // 前置条件：300px 窄容器 + 10 个页签，数量上限 4 → 宽度上限更紧
    // （折叠内容与「更多」按钮需整体放入容器，仅 3 项可完整容纳）
    const screen = renderTabs({ width: 300, count: 10, modelValue: 'tab1', maxShow: 4 });
    await settle();

    const container = screen.container.querySelector(CONTAINER_SELECTOR) as HTMLElement;
    const containerRect = container.getBoundingClientRect();
    const paneNavs = getPaneNavs(screen);
    const moreButton = getMoreButton(screen);
    expect(moreButton).not.toBeNull();

    // 期望行为（特征化护栏）：为「更多」按钮预留宽度后折叠内容整体在容器宽内
    for (const nav of paneNavs) {
      const rect = nav.getBoundingClientRect();
      expect(rect.left).toBeGreaterThanOrEqual(containerRect.left - 1);
      expect(rect.right).toBeLessThanOrEqual(moreButton!.getBoundingClientRect().left + 1);
    }
    expect(moreButton!.getBoundingClientRect().right).toBeLessThanOrEqual(containerRect.right + 1);
    // 数量与宽度双上限取更紧者：窄容器下可见项少于 maxShow
    expect(paneNavs.length).toBeLessThan(4);
    expect(paneNavs.length).toBeGreaterThan(0);
  });

  test('maxShow 弹层名单 - 折叠项进入「更多」弹层，可见项不在', async () => {
    await setViewport('desktop');
    const screen = renderTabs({ width: 600, count: 10, modelValue: 'tab1', maxShow: 4 });
    await settle();

    // 打开「更多」弹层（内容 Teleport 到 document.body，取最后一个实例）
    getMoreButton(screen)!.click();
    await wait(600);
    const popup = lastBodyEl(POPUP_SELECTOR);
    expect(popup).not.toBeNull();
    const optionTexts = Array.from(popup!.querySelectorAll('.o-option')).map((o) => (o.textContent || '').trim());

    // 期望行为（特征化护栏，maxShow 语义）：数量上限折叠的项（标签5..标签10）在弹层名单中
    for (let i = 5; i <= 10; i++) {
      expect(optionTexts, `折叠项 标签${i} 应出现在「更多」弹层名单中`).toContain(`标签${i}`);
    }
    // 反向：可见项（标签1..标签4）不在弹层名单中
    for (let i = 1; i <= 4; i++) {
      expect(optionTexts, `可见项 标签${i} 不应出现在「更多」弹层名单中`).not.toContain(`标签${i}`);
    }
  });

  test('maxShow 路径不发生编程滚动 - 激活折叠项被就近插回可见列表，scrollLeft 恒 0', async () => {
    await setViewport('desktop');
    // 前置条件：激活项 tab10 初始位于折叠名单中——maxShow 状态机将其就近插回
    // 可见列表（而非依赖几何路径的编程滚动入视）
    const screen = renderTabs({ width: 600, count: 10, modelValue: 'tab10', maxShow: 4 });
    await settle();

    const container = screen.container.querySelector(CONTAINER_SELECTOR) as HTMLElement;
    const paneNavs = getPaneNavs(screen);
    // 激活项在可见列表内（就近插回语义），可见数量仍不超过 maxShow
    expect(paneNavs.map((n) => (n.textContent || '').trim())).toContain('标签10');
    expect(paneNavs.length).toBe(4);
    // 防几何路径越界：maxShow 路径不发生编程滚动
    expect(container.scrollLeft, 'maxShow 路径容器 scrollLeft 应恒为 0').toBe(0);

    // 从弹层选中折叠项后激活切换，仍不引入滚动（隔离墙语义保持）
    getMoreButton(screen)!.click();
    await wait(600);
    const popup = lastBodyEl(POPUP_SELECTOR)!;
    const option1 = Array.from(popup.querySelectorAll('.o-option')).find((o) => (o.textContent || '').trim() === '标签1') as HTMLElement;
    option1.click();
    await settle();
    expect(container.scrollLeft, '弹层选中折叠项后 scrollLeft 应保持 0').toBe(0);
    expect(getPaneNavs(screen).map((n) => (n.textContent || '').trim())).toContain('标签1');
  });

  test('button 变体 - 全量渲染无折叠、无指示器，溢出态 class 判据与几何路径隔离', async () => {
    await setViewport('desktop');
    // 前置条件：400px 容器 + 10 个页签 → 内容总宽超出容器（自然溢出）
    const screen = renderTabs({ width: 400, count: 10, modelValue: 'tab1', variant: 'button' });
    await settle();

    const container = screen.container.querySelector(CONTAINER_SELECTOR) as HTMLElement;
    expect(container.scrollWidth, '前置：内容总宽超出容器').toBeGreaterThan(container.clientWidth);

    // 期望行为（特征化护栏）：button 变体全量渲染，不折叠、无「更多」按钮与省略号节点
    const paneNavs = getPaneNavs(screen);
    expect(paneNavs.map((n) => (n.textContent || '').trim())).toEqual(Array.from({ length: 10 }, (_, i) => `标签${i + 1}`));
    expect(screen.container.querySelector(MORE_ARROW_SELECTOR)).toBeNull();
    expect(screen.container.querySelector(ELLIPSIS_SELECTOR)).toBeNull();
    // 溢出态 class 判据与几何路径隔离：button 路径隐藏名单恒空 → 不进入折叠态
    expect(container.classList.contains('overflown')).toBe(false);
    // 无指示器（anchor 仅 text 变体渲染）
    expect(screen.container.querySelector('.o-tab-nav-anchor')).toBeNull();
    // 不发生编程滚动
    expect(container.scrollLeft).toBe(0);
  });

  test('button 变体 - maxShow 折叠对 button 不生效（全量渲染早退优先）', async () => {
    await setViewport('desktop');
    // 前置条件：button + maxShow=4——button 的全量渲染早退先于 maxShow 状态机
    const screen = renderTabs({ width: 400, count: 10, modelValue: 'tab1', variant: 'button', maxShow: 4 });
    await settle();

    const container = screen.container.querySelector(CONTAINER_SELECTOR) as HTMLElement;
    // 期望行为（特征化护栏）：maxShow 数量上限对 button 变体不生效，仍全量渲染
    const paneNavs = getPaneNavs(screen);
    expect(paneNavs.length).toBe(10);
    expect(getMoreButton(screen)).toBeNull();
    expect(container.classList.contains('overflown')).toBe(false);
    expect(container.scrollLeft).toBe(0);
  });
});

describe('OTabPane 属性契约', () => {
  test('OTabPane disabled - 禁用页签有 disabled 类且不可切换', async () => {
    const onUpdate = vi.fn();
    const screen = render({
      render: () =>
        h(
          OTab,
          { modelValue: '1', 'onUpdate:modelValue': onUpdate },
          {
            default: () => [h(OTabPane, { value: '1', label: 'T1' }), h(OTabPane, { value: '2', label: 'T2', disabled: true })],
          },
        ),
    });
    await flush();
    const navs = screen.container.querySelectorAll('.o-tab-nav');
    expect(navs.length).toBeGreaterThanOrEqual(2);
    expect(navs[1].classList.contains('o-tab-nav-disabled')).toBe(true);
    await navs[1].click();
    await flush();
    expect(onUpdate).not.toHaveBeenCalled();
  });

  test('OTabPane closable - 渲染关闭按钮', async () => {
    const screen = render(OTab, {
      props: { modelValue: '1' },
      slots: {
        default: () => h(OTabPane, { value: '1', label: 'T', closable: true }),
      },
    });
    await flush();
    expect(screen.container.querySelector('.o-tab-nav-close')).not.toBeNull();
  });

  test('OTabPane closable - 点击关闭按钮触发 delete 事件', async () => {
    const onDelete = vi.fn();
    const screen = render({
      render: () =>
        h(
          OTab,
          { modelValue: '1', onDelete },
          {
            default: () => h(OTabPane, { value: '1', label: 'T', closable: true }),
          },
        ),
    });
    await flush();
    const closeBtn = screen.container.querySelector('.o-tab-nav-close') as HTMLElement;
    await closeBtn.click();
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  test('OTabPane lazy=true - 未激活时内容不渲染', async () => {
    const screen = render(OTab, {
      props: { modelValue: '1' },
      slots: {
        default: () => [
          h(OTabPane, { value: '1', label: 'T1' }, { default: () => 'Content 1' }),
          h(OTabPane, { value: '2', label: 'T2', lazy: true }, { default: () => 'Content 2' }),
        ],
      },
    });
    await flush();
    expect(screen.container.textContent).toContain('Content 1');
    expect(screen.container.textContent).not.toContain('Content 2');
  });

  test('OTabPane nav 插槽 - 自定义导航渲染', async () => {
    const screen = render(OTab, {
      slots: {
        default: () =>
          h(
            OTabPane,
            { value: '1', label: 'Default' },
            {
              nav: () => 'Custom Nav',
              default: () => 'Content',
            },
          ),
      },
    });
    await flush();
    const nav = screen.container.querySelector('.o-tab-nav');
    expect(nav?.textContent).toContain('Custom Nav');
    expect(nav?.textContent).not.toContain('Default');
  });
});

describe('动态契约（用户交互 → 组件响应）', () => {
  test('OTab update:modelValue - 点击页签切换', async () => {
    const onUpdate = vi.fn();
    const screen = render({
      render: () =>
        h(
          OTab,
          { 'onUpdate:modelValue': onUpdate },
          {
            default: () => [h(OTabPane, { value: '1', label: 'T1' }), h(OTabPane, { value: '2', label: 'T2' })],
          },
        ),
    });
    await flush();
    const navs = screen.container.querySelectorAll('.o-tab-nav');
    expect(navs.length).toBeGreaterThanOrEqual(2);
    await navs[1].click();
    await flush();
    expect(onUpdate).toHaveBeenCalledWith('2');
  });

  test('OTab change - 切换页签时触发 change 事件', async () => {
    const onChange = vi.fn();
    const screen = render({
      render: () =>
        h(
          OTab,
          { modelValue: '1', onChange },
          {
            default: () => [h(OTabPane, { value: '1', label: 'T1' }), h(OTabPane, { value: '2', label: 'T2' })],
          },
        ),
    });
    await flush();
    const navs = screen.container.querySelectorAll('.o-tab-nav');
    expect(navs.length).toBeGreaterThanOrEqual(2);
    await navs[1].click();
    await flush();
    expect(onChange).toHaveBeenCalledWith('2', '1');
  });

  test('OTab add - 点击添加按钮触发 add 事件', async () => {
    const onAdd = vi.fn();
    const screen = render({
      render: () =>
        h(
          OTab,
          { addable: true, onAdd },
          {
            default: () => h(OTabPane, { value: '1', label: 'T' }),
          },
        ),
    });
    await flush();
    const addBtn = screen.container.querySelector('.o-tab-nav-add') as HTMLElement;
    await addBtn.click();
    expect(onAdd).toHaveBeenCalledTimes(1);
  });
});

describe('桌面端溢出静态几何契约', () => {
  test('OTab 溢出态尾部无空白 - 最后可见页签右缘不低于省略号阴影左缘', async () => {
    await setViewport('desktop');
    // 前置条件：600px 容器 + 10 个「标签N」页签（自然内容总宽约 747px，明显溢出），
    // 激活首个页签（位于左缘，无需滚动）。
    const screen = renderTabs({ width: 600, count: 10, modelValue: 'tab1' });
    await settle();

    const ellipsis = screen.container.querySelector(ELLIPSIS_SELECTOR) as HTMLElement;
    expect(ellipsis).not.toBeNull();
    // 前置确认：溢出态下省略号显示
    expect(getComputedStyle(ellipsis).display).not.toBe('none');

    const navs = Array.from(screen.container.querySelectorAll(VISIBLE_NAV_SELECTOR)) as HTMLElement[];
    expect(navs.length).toBeGreaterThan(0);
    const lastNav = navs[navs.length - 1];
    const lastNavRight = lastNav.getBoundingClientRect().right;
    const shadowLeft = getEllipsisShadowLeft(ellipsis);

    // 期望行为（spec User Story 1/2 + Testing Decisions 用例清单 #1）：
    // 溢出态下最后一个页签被容器右缘裁切，其右缘越过容器右缘（内容真溢出，
    // 断言其伸入省略号本体区域）——尾部不允许出现「不足一个页签宽」的空白断裂带。
    const containerRect = screen.container.querySelector(CONTAINER_SELECTOR)!.getBoundingClientRect();
    expect(lastNavRight, '溢出态末页签应被容器右缘裁切（右缘越界）').toBeGreaterThan(containerRect.right);
    expect(lastNavRight, '末页签右缘应伸入省略号阴影与本体区域').toBeGreaterThanOrEqual(shadowLeft - 1);
  });

  test('OTab 不完全可见页签 - 部分可见页签保留在可见列表且进入省略号弹层名单', async () => {
    await setViewport('desktop');
    // 前置条件：560px 容器 + 10 个页签（总宽约 747px）。新模型下页签左对齐全量渲染，
    // 560 落在第 8 个页签跨度内 → 标签8 应为「部分可见」（右缘被容器裁切）。
    // 激活首个页签（完整可见，无需滚动）。
    const screen = renderTabs({ width: 560, count: 10, modelValue: 'tab1' });
    await settle();

    const container = screen.container.querySelector(CONTAINER_SELECTOR) as HTMLElement;
    const containerRect = container.getBoundingClientRect();
    const navs = Array.from(screen.container.querySelectorAll(VISIBLE_NAV_SELECTOR)) as HTMLElement[];

    // 期望行为（spec User Story 3/5 + Implementation Decisions「可见性与隐藏名单判定」
    // + Testing Decisions 用例清单 #2）：全部页签常驻 DOM，内容溢出被容器裁切，
    // 被裁切的页签保留其可见部分（部分可见）。
    const partialNav = navs.find((nav) => {
      const rect = nav.getBoundingClientRect();
      return rect.right > containerRect.right + 1 && rect.left < containerRect.right - 1;
    });
    expect(partialNav, '溢出态下可见列表应存在被容器右缘裁切的部分可见页签').toBeDefined();

    // 点击省略号打开弹层（内容 Teleport 到 document.body，取最后一个实例）
    const ellipsis = screen.container.querySelector(ELLIPSIS_SELECTOR) as HTMLElement;
    ellipsis.click();
    await wait(600);

    // 期望行为（spec「不完全可见（左右任一缘越界）即进弹层名单」）：
    // 部分可见页签应出现在省略号弹层名单中（受控重复：既露出又出现在弹层）。
    const popup = lastBodyEl('.o-tab-more-popup');
    expect(popup).not.toBeNull();
    const optionTexts = Array.from(popup!.querySelectorAll('.o-option')).map((o) => (o.textContent || '').trim());
    expect(optionTexts).toContain((partialNav!.textContent || '').trim());

    // 期望行为（同一几何规则的反向）：完全可见的页签不应出现在弹层名单中
    // （名单 = 不完全可见页签集合，与滚动位置/容器宽度的判定解耦后的唯一语义）。
    const ellipsisWidth = ellipsis.getBoundingClientRect().width;
    const fullyVisibleBoundary = containerRect.right - ellipsisWidth;
    const fullyVisibleLabels = navs.filter((nav) => nav.getBoundingClientRect().right <= fullyVisibleBoundary - 1).map((nav) => (nav.textContent || '').trim());
    for (const label of fullyVisibleLabels) {
      expect(optionTexts, `完全可见页签 ${label} 不应出现在省略号弹层名单中`).not.toContain(label);
    }
  });

  test('OTab 激活视口外页签 - 容器编程式滚动入视且激活页签完整可见', async () => {
    await setViewport('desktop');
    // 前置条件：600px 容器 + 10 个页签（总宽约 747px），初始激活末尾页签 tab10
    // （新模型下位于容器滚动视口之外，激活时需滚动入视）。
    const screen = renderTabs({ width: 600, count: 10, modelValue: 'tab10' });
    await settle();

    const container = screen.container.querySelector(CONTAINER_SELECTOR) as HTMLElement;
    expect(container).not.toBeNull();

    // 期望行为（spec User Story 6 + Implementation Decisions「布局收口管线：
    // 滚动激活项入视」+ Testing Decisions 用例清单 #4）：激活视口外的页签时，
    // 滚动宿主（nav 容器）的 scrollLeft 应被编程式调整（桌面端与移动端同构）。
    expect(container.scrollLeft, '激活视口外页签时容器 scrollLeft 应大于 0').toBeGreaterThan(0);

    // 期望行为（复用移动端同款断言）：激活页签 rect 完整在容器可视范围内（±1px 容差），
    // 不被左右边缘裁切。
    const activeNav = screen.container.querySelector('.o-tab-nav-active') as HTMLElement;
    expect(activeNav).not.toBeNull();
    const containerRect = container.getBoundingClientRect();
    const activeRect = activeNav.getBoundingClientRect();
    expect(activeRect.left).toBeGreaterThanOrEqual(containerRect.left - 1);
    expect(activeRect.right).toBeLessThanOrEqual(containerRect.right + 1);
  });

  test('OTab 省略号显隐判据 - 以内容溢出为准，非溢出时隐藏且居中布局不变', async () => {
    await setViewport('desktop');

    // ── 前置条件 A：solid 变体 8 个页签（自然内容总宽约 920px，
    // 含边框与 solid 间距）放入 880px 容器 → 内容溢出约 40px。
    // solid 属于「variant 非 button」路径，在本 spec 范围内。
    const screenA = renderTabs({ width: 880, count: 8, modelValue: 'tab1', variant: 'solid' });
    await settle();

    const containerA = screenA.container.querySelector(CONTAINER_SELECTOR) as HTMLElement;
    const measurementA = screenA.container.querySelector(MEASUREMENT_SELECTOR) as HTMLElement;
    const ellipsisA = screenA.container.querySelector(ELLIPSIS_SELECTOR) as HTMLElement;
    expect(ellipsisA).not.toBeNull();

    // 前置确认：内容总宽（全量测量列表宽度）> 容器宽 → 溢出
    const contentWidth = measurementA.getBoundingClientRect().width;
    expect(contentWidth).toBeGreaterThan(containerA.clientWidth);

    // 期望行为（spec Implementation Decisions「省略号显隐与布局模式切换：
    // 统一改判『内容总宽 > 容器宽』（布局值，与滚动位置无关）」）：
    // 内容溢出时省略号显示、容器带溢出态 class（grid 居中 → 流式布局切换）。
    expect(getComputedStyle(ellipsisA).display, '内容溢出时省略号应显示').not.toBe('none');
    expect(containerA.classList.contains('overflown'), '内容溢出时容器应带 overflown 溢出态 class').toBe(true);

    screenA.unmount();
    await flush();

    // ── 前置条件 B（回归护栏）：600px 容器 + 3 个页签（总宽约 199px）
    // → 内容不溢出。
    const screenB = renderTabs({ width: 600, count: 3, modelValue: 'tab1' });
    await settle();

    const containerB = screenB.container.querySelector(CONTAINER_SELECTOR) as HTMLElement;
    const ellipsisB = screenB.container.querySelector(ELLIPSIS_SELECTOR) as HTMLElement;
    const visibleListB = screenB.container.querySelector(VISIBLE_LIST_SELECTOR) as HTMLElement;

    // 期望行为（spec User Story 9：非溢出场景的居中/对齐布局与现状完全一致）：
    // 省略号隐藏、无溢出态 class、可见列表在容器内水平居中（左右留边相等）。
    expect(getComputedStyle(ellipsisB).display).toBe('none');
    expect(containerB.classList.contains('overflown')).toBe(false);
    const containerRectB = containerB.getBoundingClientRect();
    const listRectB = visibleListB.getBoundingClientRect();
    const leftMargin = listRectB.left - containerRectB.left;
    const rightMargin = containerRectB.right - listRectB.right;
    expect(Math.abs(leftMargin - rightMargin)).toBeLessThanOrEqual(2);
  });

  test('OTab 完全不可见页签 - 可见部分不可点（盒子与容器可视区无交集）', async () => {
    await setViewport('desktop');
    // 前置条件：600px 容器 + 10 个页签（总宽约 747px），激活末尾页签 tab10 →
    // 容器滚动至尾部，左侧页签整体滚出可视区。
    const screen = renderTabs({ width: 600, count: 10, modelValue: 'tab10' });
    await settle();

    const container = screen.container.querySelector(CONTAINER_SELECTOR) as HTMLElement;
    expect(container.scrollLeft, '前置：激活视口外页签后容器已发生编程滚动').toBeGreaterThan(0);

    // 完全不可见页签：整体位于容器可视区左缘之外（右缘仍越界即整体滚出）
    const containerRect = container.getBoundingClientRect();
    const navs = Array.from(screen.container.querySelectorAll(VISIBLE_NAV_SELECTOR)) as HTMLElement[];
    const fullyHiddenNavs = navs.filter((nav) => nav.getBoundingClientRect().right < containerRect.left - 1);
    expect(fullyHiddenNavs.length, '前置：应存在完全滚出可视区的页签').toBeGreaterThan(0);

    // 期望行为（spec Testing Decisions 用例清单 #3「完全不可见页签可见部分不可点或不存在」）：
    // 容器 overflow-x 裁切下，完全不可见页签的盒子与容器可视区矩形无交集，
    // 即其可见部分为零、无可点区域；此类页签必须经省略号弹层可达（触达性断言）。
    const options = await readHiddenListTexts(screen);
    for (const nav of fullyHiddenNavs) {
      expect(options, `完全不可见页签 ${nav.textContent?.trim()} 应出现在省略号弹层名单中`).toContain((nav.textContent || '').trim());
    }
  });
});

// ============================================================================
// 动态交互收口
//
// 验证几何模型在动态触发源下的收口正确性；若红即为模型真实 bug。
//
// 场景与收口管线触发源的映射（三类触发源均被真实触达，满足验收硬指标）：
//   - 页签增删（MutationObserver + uidSet watch）：
//       closable 四子场景、addable 新增页签；
//   - 容器 resize（navsContainer 宽度 watch + v-on-resize）：
//       prefix 插槽出现/消失挤压容器宽；
//   - 激活变化（activeKey watch）：
//       省略号弹层选中视口外页签、关闭当前激活页签的迁移。
//   另有：文案宽度变化（测量列表宽度 watch）、断点往返（lePadV watch）。
// ============================================================================

/** 动态场景的页签数据项（响应式数组元素，支持运行中增删与文案变更） */
interface TabItem {
  value: string;
  label: string;
}

/** 可见列表内激活页签（排除测量列表的同名节点与省略号节点） */
const ACTIVE_NAV_SELECTOR = `${VISIBLE_LIST_SELECTOR} > .o-tab-nav.o-tab-nav-active:not(.o-tab-nav-ellipsis)`;

interface StateTabsOptions {
  /** 外层容器固定宽度（px） */
  width: number;
  /** 页签数量（生成 标签1..标签N），与 tabs 二选一 */
  count?: number;
  /** 自定义页签数据（文案变化场景使用） */
  tabs?: TabItem[];
  /** 初始激活页签值（OTab 的 modelValue 为必传 prop） */
  modelValue: string;
  /** 页签是否可关闭（关闭按钮触发 delete → 状态移除） */
  closable?: boolean;
  /** 是否渲染添加按钮 */
  addable?: boolean;
}

/**
 * 以响应式页签数组挂载 OTab：支持运行中增删页签（delete/add 事件由状态
 * 处理器接管，与真实业务用法一致）、修改文案、切换 prefix 插槽。
 * @param options 渲染配置（宽度/页签数据/交互开关）
 * @returns screen 渲染句柄；state 响应式状态（tabs/prefix）；
 *   removeTab/addTab 业务侧增删页签的操作入口
 */
function renderStateTabs({ width, count, tabs, modelValue, closable, addable = false }: StateTabsOptions) {
  const items: TabItem[] = tabs ?? Array.from({ length: count ?? 0 }, (_, i) => ({ value: `tab${i + 1}`, label: `标签${i + 1}` }));
  const state = reactive({ tabs: items.map((t) => ({ ...t })), prefix: false });

  /** 业务侧响应 delete 事件：从状态中移除对应页签 */
  const removeTab = (value: string | number) => {
    state.tabs = state.tabs.filter((t) => t.value !== value);
  };
  /** 业务侧响应 add 事件：向状态追加新页签 */
  const addTab = (value: string, label: string) => {
    state.tabs.push({ value, label });
  };

  const screen = render({
    setup() {
      return () => {
        // prefix 插槽按 state.prefix 条件注入：插槽缺席时头部不渲染前缀容器
        const slots: { default: () => VNode[]; prefix?: () => VNode } = {
          default: () => state.tabs.map((t) => h(OTabPane, { key: t.value, value: t.value, label: t.label, closable })),
        };
        if (state.prefix) {
          slots.prefix = () => h('span', { style: 'display: inline-block; width: 200px;' }, '前缀占位');
        }
        return h('div', { style: `width: ${width}px;` }, [h(OTab, { modelValue, addable, onDelete: removeTab }, slots)]);
      };
    },
  });
  return { screen, state, removeTab, addTab };
}

/** 获取可见列表内的页签元素数组（已排除省略号节点） */
const getNavs = (screen: ScreenLike) => Array.from(screen.container.querySelectorAll(VISIBLE_NAV_SELECTOR)) as HTMLElement[];

/** 按文本在可见页签中查找（label 唯一，用包含匹配） */
const findNavByText = (navs: HTMLElement[], text: string) => navs.find((nav) => (nav.textContent || '').includes(text));

/** 点击指定文本页签的关闭按钮（真实交互路径：delete 事件 → 状态移除） */
function closeNavByText(screen: ScreenLike, text: string) {
  const nav = findNavByText(getNavs(screen), text);
  expect(nav, `前置：应存在页签 ${text}`).toBeDefined();
  (nav!.querySelector('.o-tab-nav-close') as HTMLElement).click();
}

/** 判据：页签被容器右缘裁切（部分可见）——右缘越界且左缘仍在容器内 */
const isPartiallyCutByRight = (containerRect: DOMRect) => (nav: HTMLElement) => {
  const rect = nav.getBoundingClientRect();
  return rect.right > containerRect.right + 1 && rect.left < containerRect.right - 1;
};

/**
 * 打开省略号弹层（点击省略号 → OPopup 过渡显隐，固定等待落定）
 * @returns 弹层 wrap 元素（document.body 中最后一个实例）
 */
async function openEllipsisPopup(screen: ScreenLike): Promise<HTMLElement> {
  (screen.container.querySelector(ELLIPSIS_SELECTOR) as HTMLElement).click();
  await wait(600);
  const popup = lastBodyEl(POPUP_SELECTOR);
  expect(popup, '省略号弹层应已展开').not.toBeNull();
  return popup!;
}

/**
 * 读取省略号弹层名单的选项文本（名单 = 不完全可见页签集合）。
 * 弹层 wrap 未挂载时先点击省略号展开；已挂载时直接读取实时名单
 * （v-for hiddenUids 响应式更新，无需重新打开）。
 */
async function readHiddenListTexts(screen: ScreenLike): Promise<string[]> {
  if (!lastBodyEl(POPUP_SELECTOR)) {
    await openEllipsisPopup(screen);
  }
  const popup = lastBodyEl(POPUP_SELECTOR)!;
  return Array.from(popup.querySelectorAll('.o-option')).map((o) => (o.textContent || '').trim());
}

/** 断言激活页签在容器可视范围内完整可见（±1px 容差，与移动端既有断言同构） */
function expectActiveFullyVisible(screen: ScreenLike) {
  const container = screen.container.querySelector(CONTAINER_SELECTOR) as HTMLElement;
  const activeNav = screen.container.querySelector(ACTIVE_NAV_SELECTOR) as HTMLElement;
  expect(activeNav, '应存在激活页签').not.toBeNull();
  const containerRect = container.getBoundingClientRect();
  const activeRect = activeNav.getBoundingClientRect();
  expect(activeRect.left).toBeGreaterThanOrEqual(containerRect.left - 1);
  expect(activeRect.right).toBeLessThanOrEqual(containerRect.right + 1);
}

/** 断言滚动位置合法：scrollLeft 不越过 scrollWidth - clientWidth（clamp 语义，±1px 容差） */
function expectScrollLeftClamped(container: HTMLElement) {
  expect(container.scrollLeft).toBeGreaterThanOrEqual(-1);
  expect(container.scrollLeft).toBeLessThanOrEqual(container.scrollWidth - container.clientWidth + 1);
}

/** 断言指示器（anchor）与激活页签左右缘对齐（稳态亚像素容差） */
function expectAnchorAligned(screen: ScreenLike) {
  const anchor = screen.container.querySelector('.o-tab-nav-anchor') as HTMLElement;
  const activeNav = screen.container.querySelector(ACTIVE_NAV_SELECTOR) as HTMLElement;
  expect(anchor).not.toBeNull();
  expect(activeNav).not.toBeNull();
  const anchorRect = anchor.getBoundingClientRect();
  const activeRect = activeNav.getBoundingClientRect();
  expect(Math.abs(anchorRect.left - activeRect.left)).toBeLessThanOrEqual(1.5);
  expect(Math.abs(anchorRect.right - activeRect.right)).toBeLessThanOrEqual(1.5);
}

describe('动态交互收口（几何模型验证）', () => {
  test('closable 关闭视口内非激活页签 - 后续页签前移无空白、省略号名单重算', async () => {
    await setViewport('desktop');
    const { screen } = renderStateTabs({ width: 600, count: 10, modelValue: 'tab1', closable: true });
    await settle();

    // 前置：溢出态下弹层名单非空（尾部页签在视口外）
    const optionsBefore = await readHiddenListTexts(screen);
    expect(optionsBefore.length).toBeGreaterThan(0);
    // 记录被关闭页签的左缘，用于验证后续页签前移收口
    const removedNav = findNavByText(getNavs(screen), '标签3')!;
    const removedLeft = removedNav.getBoundingClientRect().left;

    // 关闭视口内非激活页签 标签3（delete 事件 → 状态移除 → DOM 增删触发收口管线）
    closeNavByText(screen, '标签3');
    await settle();

    const navs = getNavs(screen);
    expect(navs.length).toBe(9);
    expect(findNavByText(navs, '标签3')).toBeUndefined();

    // 布局收口：后续页签前移填补空位（左缘对齐被关闭页签原位，±2px 容差）
    const shiftedNav = findNavByText(navs, '标签4')!;
    expect(Math.abs(shiftedNav.getBoundingClientRect().left - removedLeft)).toBeLessThanOrEqual(2);
    // 无空白残留：内容仍溢出容器右缘（末页签被裁切，无断裂带）——
    // scrollLeft=0 场景末页签右缘本就越过阴影左缘，不适用滚动终点双边界
    const containerRect = screen.container.querySelector(CONTAINER_SELECTOR)!.getBoundingClientRect();
    expect(navs[navs.length - 1].getBoundingClientRect().right, '末页签右缘应仍溢出容器右缘（尾部无空白）').toBeGreaterThan(containerRect.right);

    // 激活项（tab1）保持完整可见、无多余滚动
    expectActiveFullyVisible(screen);
    expect(screen.container.querySelector(CONTAINER_SELECTOR)!.scrollLeft).toBe(0);

    // 名单重算：被关闭页签不再出现在弹层名单；溢出仍在，名单非空
    const optionsAfter = await readHiddenListTexts(screen);
    expect(optionsAfter).not.toContain('标签3');
    expect(optionsAfter.length).toBeGreaterThan(0);
  });

  test('closable 关闭仅存在于弹层名单的视口外页签 - scrollLeft 收敛合法区间、名单重算', async () => {
    await setViewport('desktop');
    // 激活末尾页签使容器滚动到最右：视口外（仅弹层可见）的是左侧被裁切页签
    const { screen, state } = renderStateTabs({ width: 600, count: 10, modelValue: 'tab10' });
    await settle();

    const container = screen.container.querySelector(CONTAINER_SELECTOR) as HTMLElement;
    const scrollLeftBefore = container.scrollLeft;
    expect(scrollLeftBefore).toBeGreaterThan(0);
    // 前置：标签1 在当前滚动位置被左缘裁切，仅存在于弹层名单
    expect(await readHiddenListTexts(screen)).toContain('标签1');

    // 从状态移除视口外页签 标签1（视口外无可见关闭按钮，等价于业务侧数据变更）
    state.tabs = state.tabs.filter((t) => t.value !== 'tab1');
    await settle();

    // 收口：内容收缩使原 scrollLeft 越界，被 clamp 回合法区间并左移
    expectScrollLeftClamped(container);
    expect(container.scrollLeft).toBeLessThan(scrollLeftBefore - 10);
    // 激活项收口后仍完整可见
    expectActiveFullyVisible(screen);
    // 名单重算：标签1 不再出现在弹层名单
    expect(await readHiddenListTexts(screen)).not.toContain('标签1');
  });

  test('closable 关闭部分可见页签 - 收口后无空白、裁切边界推移到下一个页签', async () => {
    await setViewport('desktop');
    // 560px 容器：裁切线落在 标签8 跨度内（部分可见）；600px 时裁切线
    // 落在页签间隙，不存在部分可见页签
    const { screen } = renderStateTabs({ width: 560, count: 10, modelValue: 'tab1', closable: true });
    await settle();

    // 前置：找到被容器右缘裁切的部分可见页签（如 标签8）
    const container = screen.container.querySelector(CONTAINER_SELECTOR) as HTMLElement;
    const partialBefore = getNavs(screen).find(isPartiallyCutByRight(container.getBoundingClientRect()));
    expect(partialBefore, '前置：应存在被右缘裁切的部分可见页签').toBeDefined();
    const partialText = (partialBefore!.textContent || '').trim();

    // 关闭该部分可见页签
    closeNavByText(screen, partialText);
    await settle();

    const navs = getNavs(screen);
    expect(navs.length).toBe(9);
    expect(findNavByText(navs, partialText)).toBeUndefined();

    // 收口后无空白：最后一个页签右缘贴住省略号阴影左缘
    const ellipsis = screen.container.querySelector(ELLIPSIS_SELECTOR) as HTMLElement;
    expect(navs[navs.length - 1].getBoundingClientRect().right).toBeGreaterThanOrEqual(getEllipsisShadowLeft(ellipsis) - 1);

    // 裁切边界正确：原先视口外的下一个页签滑入裁切位置，成为新的部分可见页签
    const partialAfter = navs.find(isPartiallyCutByRight(container.getBoundingClientRect()));
    expect(partialAfter, '收口后应存在新的部分可见页签（边界推移）').toBeDefined();
    const partialAfterText = (partialAfter!.textContent || '').trim();
    expect(partialAfterText).not.toBe(partialText);

    // 名单重算：旧页签移出名单，新部分可见页签进入名单
    const options = await readHiddenListTexts(screen);
    expect(options).not.toContain(partialText);
    expect(options).toContain(partialAfterText);
  });

  test('closable 关闭当前激活页签 - 激活迁移到相邻页签且新激活滚动入视', async () => {
    await setViewport('desktop');
    // 200px 窄容器：居中的激活页签被关闭后，迁移目标（模板序前一项）处于
    // 左缘裁切状态，收口管线需滚动入视才能使其完整可见
    const { screen } = renderStateTabs({ width: 200, count: 10, modelValue: 'tab6', closable: true });
    await settle();

    const container = screen.container.querySelector(CONTAINER_SELECTOR) as HTMLElement;
    const scrollLeftBefore = container.scrollLeft;

    // 关闭当前激活页签 标签6（delete 事件 → 状态移除；激活迁移到相邻项）
    closeNavByText(screen, '标签6');
    await settle();

    expect(getNavs(screen).length).toBe(9);

    // 激活迁移到模板序前一项 标签5
    const activeNav = screen.container.querySelector(ACTIVE_NAV_SELECTOR) as HTMLElement;
    expect(activeNav).not.toBeNull();
    expect((activeNav.textContent || '').trim()).toBe('标签5');

    // 新激活完整可见（滚动入视），且滚动确实发生（迁移目标原被左缘裁切）
    expectActiveFullyVisible(screen);
    expect(Math.abs(container.scrollLeft - scrollLeftBefore)).toBeGreaterThan(5);
    expectScrollLeftClamped(container);
    // 指示器跟随迁移：anchor 与新激活页签对齐
    expectAnchorAligned(screen);
  });

  test('addable 新增页签 - 列表重排且新激活页签滚动到完整可见', async () => {
    await setViewport('desktop');
    const { screen, addTab } = renderStateTabs({ width: 600, count: 10, modelValue: 'tab1', addable: true });
    await settle();

    const container = screen.container.querySelector(CONTAINER_SELECTOR) as HTMLElement;
    expect(container.scrollLeft).toBe(0);

    // 点击添加按钮（add 事件 + isAdding）→ 业务侧追加页签 → 组件自动激活新页签
    (screen.container.querySelector('.o-tab-nav-add') as HTMLElement).click();
    addTab('tab11', '标签11');
    await settle();

    // 列表重排：11 个页签、新页签追加在尾部
    const navs = getNavs(screen);
    expect(navs.length).toBe(11);
    expect((navs[navs.length - 1].textContent || '').trim()).toBe('标签11');

    // 新激活页签完整可见：原在视口外的尾部页签被编程滚动入视
    const activeNav = screen.container.querySelector(ACTIVE_NAV_SELECTOR) as HTMLElement;
    expect((activeNav.textContent || '').trim()).toBe('标签11');
    expectActiveFullyVisible(screen);
    expect(container.scrollLeft).toBeGreaterThan(0);
  });

  test('文案宽度变化 - label 变长/变短后溢出判定与布局即时重算', async () => {
    await setViewport('desktop');
    const { screen, state } = renderStateTabs({
      width: 600,
      modelValue: 'tab1',
      tabs: Array.from({ length: 6 }, (_, i) => ({ value: `tab${i + 1}`, label: `短${i + 1}` })),
    });
    await settle();

    const container = screen.container.querySelector(CONTAINER_SELECTOR) as HTMLElement;
    const ellipsis = screen.container.querySelector(ELLIPSIS_SELECTOR) as HTMLElement;

    // 前置：短文案不溢出 → 省略号隐藏、无溢出态 class
    expect(getComputedStyle(ellipsis).display).toBe('none');
    expect(container.classList.contains('overflown')).toBe(false);

    // 文案变长：内容总宽超过容器 → 溢出判定即时翻转
    state.tabs.forEach((t) => (t.label = '这是一个特别长的页签文案用于触发溢出判定'));
    await settle();
    expect(getComputedStyle(ellipsis).display).not.toBe('none');
    expect(container.classList.contains('overflown')).toBe(true);
    // 布局重算：激活页签保持完整可见，弹层名单出现被裁切页签
    expectActiveFullyVisible(screen);
    expect((await readHiddenListTexts(screen)).length).toBeGreaterThan(0);

    // 文案变短：判定即时翻回，无残留溢出态与滚动
    state.tabs.forEach((t) => (t.label = `短${t.value.slice(3)}`));
    await settle();
    expect(getComputedStyle(ellipsis).display).toBe('none');
    expect(container.classList.contains('overflown')).toBe(false);
    expect(container.scrollLeft).toBe(0);
  });

  test('断点往返 desktop↔phone - 两模式各自正确、无残留态', async () => {
    await setViewport('desktop');
    const { screen } = renderStateTabs({ width: 600, count: 10, modelValue: 'tab5' });
    await settle();

    const container = screen.container.querySelector(CONTAINER_SELECTOR) as HTMLElement;
    const ellipsis = screen.container.querySelector(ELLIPSIS_SELECTOR) as HTMLElement;

    // 桌面（几何路径）：溢出折叠激活、激活项入视、指示器对齐
    expect(getComputedStyle(ellipsis).display).not.toBe('none');
    expect(container.classList.contains('overflown')).toBe(true);
    expectActiveFullyVisible(screen);
    expectAnchorAligned(screen);

    // 切到 phone（lePadV）：全量渲染 + 横向滚动模式
    await setViewport('phone');
    await settle();
    expect(getComputedStyle(ellipsis).display).toBe('none');
    expect(container.classList.contains('overflown')).toBe(false);
    expectActiveFullyVisible(screen);
    expectAnchorAligned(screen);
    expectScrollLeftClamped(container);
    // 无残留态：省略号的钉住内联平移被清除
    expect(ellipsis.style.transform).toBe('');

    // 切回 desktop（几何路径）：折叠与名单恢复，无移动端残留
    await setViewport('desktop');
    await settle();
    expect(getComputedStyle(ellipsis).display).not.toBe('none');
    expect(container.classList.contains('overflown')).toBe(true);
    expectActiveFullyVisible(screen);
    expectAnchorAligned(screen);
    expectScrollLeftClamped(container);
    // 名单恢复重算：弹层名单非空
    expect((await readHiddenListTexts(screen)).length).toBeGreaterThan(0);
    // 省略号钉在可视右缘（平移与当前 scrollLeft 一致，无错位残留）
    const ellipsisRight = ellipsis.getBoundingClientRect().right;
    const containerRight = container.getBoundingClientRect().right;
    expect(Math.abs(ellipsisRight - containerRight)).toBeLessThanOrEqual(2);
  });

  test('省略号弹层选中视口外页签 - 弹层关闭、激活项滚动到完整可见', async () => {
    await setViewport('desktop');
    const { screen } = renderStateTabs({ width: 600, count: 10, modelValue: 'tab1' });
    await settle();

    // 打开省略号弹层（内容 Teleport 到 body，取最后实例）
    const popup = await openEllipsisPopup(screen);
    // 前置：弹层名单包含视口外页签 标签9
    const optionTexts = Array.from(popup.querySelectorAll('.o-option')).map((o) => (o.textContent || '').trim());
    expect(optionTexts).toContain('标签9');

    // 从弹层选中视口外页签 标签9
    const option9 = Array.from(popup.querySelectorAll('.o-option')).find((o) => (o.textContent || '').trim() === '标签9') as HTMLElement;
    option9.click();
    await settle();

    // 弹层关闭（OPopup 隐藏后卸载内容：v-show 隐藏或节点脱离文档）
    expect(popup.isConnected === false || getComputedStyle(popup).display === 'none').toBe(true);

    // 激活项切换为 标签9 并被滚动到完整可见
    const container = screen.container.querySelector(CONTAINER_SELECTOR) as HTMLElement;
    const activeNav = screen.container.querySelector(ACTIVE_NAV_SELECTOR) as HTMLElement;
    expect((activeNav.textContent || '').trim()).toBe('标签9');
    expectActiveFullyVisible(screen);
    expect(container.scrollLeft).toBeGreaterThan(0);

    // 名单重算：标签9 已完整可见，不再出现在弹层名单
    expect(await readHiddenListTexts(screen)).not.toContain('标签9');
  });

  test('prefix 插槽出现/消失 - 容器宽被挤压后溢出判定即时更新', async () => {
    await setViewport('desktop');
    const { screen, state } = renderStateTabs({
      width: 600,
      modelValue: 'tab1',
      tabs: Array.from({ length: 7 }, (_, i) => ({ value: `tab${i + 1}`, label: `标签${i + 1}` })),
    });
    await settle();

    const container = screen.container.querySelector(CONTAINER_SELECTOR) as HTMLElement;
    const ellipsis = screen.container.querySelector(ELLIPSIS_SELECTOR) as HTMLElement;

    // 前置：无前缀时内容不溢出（7 个页签约 520px < 600px 容器）
    expect(getComputedStyle(ellipsis).display).toBe('none');
    expect(container.classList.contains('overflown')).toBe(false);

    // 前缀插槽出现：挤压 nav 容器宽（约 400px）→ 溢出判定即时翻转
    state.prefix = true;
    await settle();
    expect(getComputedStyle(ellipsis).display).not.toBe('none');
    expect(container.classList.contains('overflown')).toBe(true);
    // 布局收口：激活页签完整可见、滚动合法、名单出现被裁切页签
    expectActiveFullyVisible(screen);
    expectScrollLeftClamped(container);
    expect((await readHiddenListTexts(screen)).length).toBeGreaterThan(0);

    // 前缀消失：判定即时翻回，无残留溢出态与滚动
    state.prefix = false;
    await settle();
    expect(getComputedStyle(ellipsis).display).toBe('none');
    expect(container.classList.contains('overflown')).toBe(false);
    expect(container.scrollLeft).toBe(0);
  });
});

// ============================================================================
// 省略号覆盖区遮蔽（遮蔽几何契约）
//
// 背景：几何路径下省略号盒背景透明，其覆盖区（省略号本体左缘至容器右缘）
// 会透出下层页签文字。本组断言覆盖区遮蔽契约——边界线 B = 容器右缘 −
// 省略号本体宽（与隐藏名单同一条线，±1px 容差）：
//   - 右缘 ≤ B 的页签（含渐变阴影区、视口内完整可见、左侧滚出）：
//     不携带任何遮蔽注入样式；
//   - 跨越 B 的部分可见页签：clip-path 右侧裁切，可见区恰止于 B；
//   - 左缘 ≥ B 的页签（整体落入覆盖区）：visibility:hidden（保布局占位）。
// 断言接缝为 computed style + rect 的外部可观测量。
// ============================================================================

/**
 * 读取页签 computed clip-path 的右侧裁切量（px）
 * @param nav 页签元素
 * @returns inset() 的 right 分量；无 inset 裁切时返回 null
 */
function getClipRightInset(nav: HTMLElement): number | null {
  const clip = getComputedStyle(nav).clipPath;
  const matched = clip.match(/inset\(([^)]+)\)/);
  if (!matched) {
    return null;
  }
  // inset(top right bottom left)，不足 4 值时按 CSS 展开规则取第 2 位为 right
  const parts = matched[1].trim().split(/\s+/).map(parseFloat);
  return parts.length >= 2 ? parts[1] : parts[0];
}

/**
 * 判据：页签携带遮蔽注入样式（clip-path 裁切或 visibility 隐藏）
 * @param nav 页签元素
 */
const isMasked = (nav: HTMLElement) => getComputedStyle(nav).clipPath !== 'none' || getComputedStyle(nav).visibility === 'hidden';

/**
 * 断言覆盖区遮蔽契约在全部可见页签上一致成立（遮蔽契约的三分支全量校验）
 * @param screen 渲染句柄
 * @returns 边界线 B 的视口横坐标（供前置条件复用）
 */
function expectCoverageMaskConsistent(screen: ScreenLike): number {
  const container = screen.container.querySelector(CONTAINER_SELECTOR) as HTMLElement;
  const ellipsis = screen.container.querySelector(ELLIPSIS_SELECTOR) as HTMLElement;
  const containerRect = container.getBoundingClientRect();
  const boundary = containerRect.right - ellipsis.getBoundingClientRect().width;
  for (const nav of getNavs(screen)) {
    const rect = nav.getBoundingClientRect();
    const label = (nav.textContent || '').trim();
    if (rect.right <= boundary + 1) {
      // 阴影区/视口内完整可见/左侧滚出：不携带任何遮蔽注入样式
      expect(getComputedStyle(nav).clipPath, `页签 ${label} 右缘未越界，不应携带 clip-path`).toBe('none');
      expect(getComputedStyle(nav).visibility, `页签 ${label} 右缘未越界，应保持可见`).toBe('visible');
    } else if (rect.left >= boundary - 1) {
      // 整体落入覆盖区：隐藏但保留布局占位
      expect(getComputedStyle(nav).visibility, `页签 ${label} 整体在省略号覆盖区内，应被隐藏`).toBe('hidden');
      expect(rect.width, `页签 ${label} 隐藏后应保留布局占位`).toBeGreaterThan(0);
    } else {
      // 跨越边界：clip-path 右侧裁切，裁切量 = 右缘越界量（可见区恰止于 B）
      const inset = getClipRightInset(nav);
      expect(inset, `页签 ${label} 跨越省略号边界，应携带 clip-path 右侧裁切`).not.toBeNull();
      expect(Math.abs(inset! - (rect.right - boundary)), `页签 ${label} 裁切后可见区应恰止于省略号本体左缘`).toBeLessThanOrEqual(1.5);
    }
  }
  return boundary;
}

describe('省略号覆盖区遮蔽（遮蔽几何契约）', () => {
  test('OTab 部分可见页签 - 可见区止于省略号本体左缘（clip-path 右侧裁切）', async () => {
    await setViewport('desktop');
    // 前置条件：540px 容器 + 10 个页签（总宽约 747px），省略号边界线落在
    // 中部页签跨度内，保证存在「左缘在边界内、右缘越界」的跨越页签。
    // 激活首个页签（完整可见，无需滚动）。
    const screen = renderTabs({ width: 540, count: 10, modelValue: 'tab1' });
    await settle();

    const ellipsis = screen.container.querySelector(ELLIPSIS_SELECTOR) as HTMLElement;
    const container = screen.container.querySelector(CONTAINER_SELECTOR) as HTMLElement;
    expect(getComputedStyle(ellipsis).display).not.toBe('none');
    const boundary = container.getBoundingClientRect().right - ellipsis.getBoundingClientRect().width;

    // 前置确认：存在跨越边界线的部分可见页签（保证裁切分支被真实触达）
    const straddling = getNavs(screen).find((nav) => {
      const rect = nav.getBoundingClientRect();
      return rect.left < boundary - 1 && rect.right > boundary + 1;
    });
    expect(straddling, '前置：应存在跨越省略号边界线的部分可见页签').toBeDefined();

    // 期望行为：部分可见页签的可见区止于省略号本体左缘（否则透明
    // 覆盖区透出下层页签文字）——遮蔽三分支由 expectCoverageMaskConsistent 全量校验
    expectCoverageMaskConsistent(screen);
  });

  test('OTab 完全落入覆盖区的页签 - visibility 隐藏且保留布局占位', async () => {
    await setViewport('desktop');
    // 前置条件：540px 容器 + 10 个页签，尾部页签整体落入省略号覆盖区
    const screen = renderTabs({ width: 540, count: 10, modelValue: 'tab1' });
    await settle();

    const container = screen.container.querySelector(CONTAINER_SELECTOR) as HTMLElement;
    const ellipsis = screen.container.querySelector(ELLIPSIS_SELECTOR) as HTMLElement;
    const boundary = container.getBoundingClientRect().right - ellipsis.getBoundingClientRect().width;

    // 前置确认：存在整体落入覆盖区的页签（左缘越过边界线）
    const covered = getNavs(screen).filter((nav) => {
      const rect = nav.getBoundingClientRect();
      return rect.left >= boundary - 1 && rect.right > boundary + 1;
    });
    expect(covered.length, '前置：应存在整体落入省略号覆盖区的页签').toBeGreaterThan(0);

    // 期望行为：覆盖区内页签隐藏但保留布局占位（否则文字经透明
    // 覆盖区透出）。遮蔽三分支一致性由 expectCoverageMaskConsistent 全量校验
    expectCoverageMaskConsistent(screen);
  });

  test('OTab 滚动后覆盖区迁移 - 遮蔽样式随逐帧重算更新且无残留', async () => {
    await setViewport('desktop');
    // 前置条件：560px 容器 + 10 个页签，初始激活首项；随后弹层选中视口外页签，
    // 容器平滑滚动，覆盖区随滚动位置迁移
    const { screen } = renderStateTabs({ width: 560, count: 10, modelValue: 'tab1' });
    await settle();

    // 初始遮蔽契约成立
    expectCoverageMaskConsistent(screen);

    // 弹层选中视口外页签 标签9（激活 → 编程滚动入视，覆盖区逐帧迁移）
    const popup = await openEllipsisPopup(screen);
    const option9 = Array.from(popup.querySelectorAll('.o-option')).find((o) => (o.textContent || '').trim() === '标签9') as HTMLElement;
    expect(option9).toBeDefined();
    option9.click();
    await settle();

    // 激活项滚动入视且完整可见
    expectActiveFullyVisible(screen);
    // 曾落入覆盖区的 标签9 现已完整可见：不携带任何遮蔽注入样式（无残留）
    const nav9 = findNavByText(getNavs(screen), '标签9')!;
    expect(getComputedStyle(nav9).visibility).toBe('visible');
    expect(getComputedStyle(nav9).clipPath).toBe('none');
    // 新滚动位置下遮蔽契约仍一致（覆盖区迁移到新的页签集合）
    expectCoverageMaskConsistent(screen);
  });

  test('OTab 断点往返 desktop↔phone - 离开几何路径遮蔽样式清场，返回后重算', async () => {
    await setViewport('desktop');
    // 前置条件：600px 容器 + 10 个页签（溢出），激活中位页签
    const { screen } = renderStateTabs({ width: 600, count: 10, modelValue: 'tab5' });
    await settle();

    // 桌面（几何路径）：遮蔽生效——存在携带遮蔽样式的页签
    const maskedCount = getNavs(screen).filter(isMasked).length;
    expect(maskedCount, '溢出态下应存在携带遮蔽样式的页签').toBeGreaterThan(0);
    expectCoverageMaskConsistent(screen);

    // 切到 phone（lePadV）：离开几何路径，全部页签无遮蔽注入样式（清场）
    await setViewport('phone');
    await settle();
    for (const nav of getNavs(screen)) {
      const label = (nav.textContent || '').trim();
      expect(getComputedStyle(nav).clipPath, `页签 ${label} 离开几何路径后不应携带 clip-path`).toBe('none');
      expect(getComputedStyle(nav).visibility, `页签 ${label} 离开几何路径后应恢复可见`).toBe('visible');
    }

    // 切回 desktop（几何路径）：遮蔽重算恢复
    await setViewport('desktop');
    await settle();
    expect(getNavs(screen).filter(isMasked).length).toBeGreaterThan(0);
    expectCoverageMaskConsistent(screen);
  });

  test('OTab 非溢出与 maxShow 路径 - 页签不携带任何遮蔽注入样式', async () => {
    await setViewport('desktop');
    // 前置条件 A：非溢出（600px 容器 + 3 个页签，总宽约 199px）
    const screenA = renderTabs({ width: 600, count: 3, modelValue: 'tab1' });
    await settle();
    const ellipsisA = screenA.container.querySelector(ELLIPSIS_SELECTOR) as HTMLElement;
    expect(getComputedStyle(ellipsisA).display).toBe('none');
    for (const nav of getNavs(screenA)) {
      expect(getComputedStyle(nav).clipPath).toBe('none');
      expect(getComputedStyle(nav).visibility).toBe('visible');
    }
    screenA.unmount();
    await flush();

    // 前置条件 B：maxShow 状态机路径（隔离墙，遮蔽仅限几何路径）
    const screenB = renderTabs({ width: 600, count: 10, modelValue: 'tab1', maxShow: 4 });
    await settle();
    for (const nav of getPaneNavs(screenB)) {
      const label = (nav.textContent || '').trim();
      expect(getComputedStyle(nav).clipPath, `页签 ${label} 属 maxShow 路径，不应携带 clip-path`).toBe('none');
      expect(getComputedStyle(nav).visibility, `页签 ${label} 属 maxShow 路径，应保持可见`).toBe('visible');
    }
  });
});

// ============================================================================
// 省略号右缘让位滚动（让位滚动契约）
//
// 背景：省略号显示时，若滚动终点把「容器右缘」当作可见终点，末尾页签
// 会整体落入省略号覆盖区被裁切/隐藏（激活项只剩碎片），且浏览器钳制下
// 不存在可让位的滚动余量。让位契约：溢出态给可见列表尾部注入让位身位
// （省略号本体宽 + 渐变阴影宽），滚动终点为末尾页签右缘止于渐变阴影左缘
// ——激活末尾页签完整可见、不携带遮蔽样式，且尾部无空白。
// ============================================================================

/**
 * 断言激活页签在省略号左缘内完整可见且未被遮蔽管线处理（让位契约）
 * @param screen 渲染句柄
 */
function expectActiveLeftOfEllipsis(screen: ScreenLike) {
  const ellipsis = screen.container.querySelector(ELLIPSIS_SELECTOR) as HTMLElement;
  const activeNav = screen.container.querySelector(ACTIVE_NAV_SELECTOR) as HTMLElement;
  expect(ellipsis, '应存在省略号节点').not.toBeNull();
  expect(activeNav, '应存在激活页签').not.toBeNull();
  // 激活页签右缘不越过省略号本体左缘（±1px 容差）
  const ellipsisLeft = ellipsis.getBoundingClientRect().left;
  const activeRight = activeNav.getBoundingClientRect().right;
  expect(activeRight, '激活页签右缘应止于省略号本体左缘（为省略号让位）').toBeLessThanOrEqual(ellipsisLeft + 1);
  // 让位后激活页签不落入遮蔽范围：不携带裁切/隐藏样式
  expect(getComputedStyle(activeNav).clipPath, '让位后激活页签不应携带 clip-path 裁切').toBe('none');
  expect(getComputedStyle(activeNav).visibility, '让位后激活页签应保持可见').toBe('visible');
}

describe('省略号右缘让位滚动（让位滚动契约）', () => {
  test('OTab 激活末尾页签 - 滚动入视时为省略号让位，末页签完整可见', async () => {
    await setViewport('desktop');
    // 前置条件：600px 容器 + 10 个页签（总宽约 747px），初始激活末尾 tab10
    // （位于视口外，挂载时滚动入视）
    const screen = renderTabs({ width: 600, count: 10, modelValue: 'tab10' });
    await settle();

    const container = screen.container.querySelector(CONTAINER_SELECTOR) as HTMLElement;
    expect(container.scrollLeft, '前置：激活视口外页签后容器已发生编程滚动').toBeGreaterThan(0);

    // 期望行为：末尾页签完整可见于省略号左缘之内（让位身位保证
    // 滚动终点不以容器右缘为可见终点）
    expectActiveLeftOfEllipsis(screen);
  });

  test('OTab 激活末尾页签 - 滚动终点末页签右缘止于渐变阴影左缘，尾部无空白', async () => {
    await setViewport('desktop');
    // 前置条件：600px 容器 + 10 个页签（总宽约 747px），初始激活末尾 tab10
    // （滚动入视被 clamp 到最大滚动量，落点即滚动终点）
    const screen = renderTabs({ width: 600, count: 10, modelValue: 'tab10' });
    await settle();

    // 滚动终点契约：末尾页签右缘贴合渐变阴影左缘（双边界——
    // 多让位即尾部露出空隙，少让位即末页签侵入覆盖区被裁切）
    expectLastNavFlushWithShadow(screen);
  });

  test('OTab 弹层选中末尾页签 - 滚动落点同样为省略号让位', async () => {
    await setViewport('desktop');
    // 前置条件：600px 容器 + 10 个页签，初始激活 tab1；经省略号弹层选中
    // 末尾页签（动态激活 → 滚动入视路径）
    const { screen } = renderStateTabs({ width: 600, count: 10, modelValue: 'tab1' });
    await settle();

    const popup = await openEllipsisPopup(screen);
    const option10 = Array.from(popup.querySelectorAll('.o-option')).find((o) => (o.textContent || '').trim() === '标签10') as HTMLElement;
    expect(option10).toBeDefined();
    option10.click();
    await settle();

    const container = screen.container.querySelector(CONTAINER_SELECTOR) as HTMLElement;
    expect(container.scrollLeft, '前置：选中视口外页签后容器已发生编程滚动').toBeGreaterThan(0);

    // 期望行为：动态激活路径的滚动落点同样让位
    expectActiveLeftOfEllipsis(screen);
  });

  test('OTab size 矩阵 - 各尺寸下让位身位随省略号本体宽自适应', async () => {
    await setViewport('desktop');
    // 省略号「…」宽度随 size 字号变化，让位身位（省略号本体宽 + 渐变阴影宽）
    // 须在各尺寸下均成立：末尾页签完整可见于省略号本体左缘之内
    for (const size of ['small', 'medium', 'large'] as const) {
      const screen = renderTabs({ width: 600, count: 10, modelValue: 'tab10', size });
      await settle();
      expectActiveLeftOfEllipsis(screen);
      screen.unmount();
      await flush();
    }
  });

  test('OTab 断点往返 desktop↔phone - 让位身位随几何路径进退，无残留', async () => {
    await setViewport('desktop');
    const { screen } = renderStateTabs({ width: 600, count: 10, modelValue: 'tab5' });
    await settle();

    // 桌面（几何路径溢出态）：列表携带让位身位，激活项在省略号左缘内完整可见
    const list = screen.container.querySelector(VISIBLE_LIST_SELECTOR) as HTMLElement;
    expect(list.style.paddingRight, '溢出态下可见列表应携带尾部让位身位').not.toBe('');
    expectActiveLeftOfEllipsis(screen);

    // 切到 phone（lePadV）：离开几何路径，让位身位清除
    await setViewport('phone');
    await settle();
    expect(list.style.paddingRight, '离开几何路径后让位身位应清除').toBe('');

    // 切回 desktop（几何路径）：让位身位恢复，激活项完整可见
    await setViewport('desktop');
    await settle();
    expect(list.style.paddingRight, '回到几何路径后让位身位应恢复').not.toBe('');
    expectActiveLeftOfEllipsis(screen);
  });

  test('OTab 非溢出 - 不注入尾部让位身位', async () => {
    await setViewport('desktop');
    // 前置条件：600px 容器 + 3 个页签（总宽约 199px），内容不溢出
    const screen = renderTabs({ width: 600, count: 3, modelValue: 'tab1' });
    await settle();

    const ellipsis = screen.container.querySelector(ELLIPSIS_SELECTOR) as HTMLElement;
    expect(getComputedStyle(ellipsis).display).toBe('none');
    const list = screen.container.querySelector(VISIBLE_LIST_SELECTOR) as HTMLElement;
    expect(list.style.paddingRight, '非溢出态不应注入让位身位').toBe('');
  });
});

describe('卸载契约', () => {
  test('OTab unmount - 卸载后 DOM 清理不残留', async () => {
    const screen = render(OTab, {
      props: { modelValue: '1' },
      slots: {
        default: () => [h(OTabPane, { value: '1', label: 'T1' }), h(OTabPane, { value: '2', label: 'T2' })],
      },
    });
    await flush();
    expect(screen.container.querySelector('.o-tab')).not.toBeNull();
    screen.unmount();
    await flush();
    expect(screen.container.querySelector('.o-tab')).toBeNull();
  });
});

describe('SSR 契约', () => {
  test('OTab SSR - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OTab, { modelValue: '1' }, '')).resolves.toEqual(expect.any(String));
  });

  test('OTab hydration - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OTab, { modelValue: '1' }, '');
    expect(result.hasMismatch).toBe(false);
    if (result.root) result.root.remove();
  });

  // ==========================================================================
  // 溢出场景 SSR 冒烟（spec issue #226 用户故事 22）：桌面端溢出几何模型
  // 的测量、滚动、布局管线全部客户端限定，服务端渲染只应输出初始态——
  // 页签经测量列表全量渲染（可见列表 showUids 初始为空），不依赖任何
  // 浏览器 API；水合阶段两端 DOM 一致，onMounted 后才由布局管线收口。
  // ==========================================================================

  /** 溢出场景载体：20 个页签在 1920px 桌面视口下必然超出容器宽（激活第 7 项） */
  const OverflowTab = {
    render: () =>
      h(
        OTab,
        { modelValue: 'tab7' },
        {
          default: () => Array.from({ length: 20 }, (_, i) => h(OTabPane, { value: `tab${i + 1}`, label: `标签${i + 1}` })),
        },
      ),
  };

  test('OTab SSR 溢出场景 - 多页签 renderToString 不抛出错误且全量序列化', async () => {
    const html = await renderSSR(OverflowTab);
    // 页签 pane 全量序列化（激活项带 active 类）；导航头 v-for 的 uid 列表
    // 在服务端渲染时尚未注册（子组件在 body 渲染阶段才向 childMap 登记），
    // 服务端只输出空列表骨架，与客户端水合首帧一致
    expect(html).toContain('data-tab-pane-key="tab1"');
    expect(html).toContain('data-tab-pane-key="tab20"');
    expect(html).toContain('o-tab-pane-active');
    expect(html).toContain('width-measurement');
  });

  test('OTab hydration 溢出场景 - 多页签水合无 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OverflowTab);
    expect(result.hasMismatch).toBe(false);
    if (result.root) result.root.remove();
  });
});

// ============================================================================
// 移动端滚动行为
//
// 背景：OTab 在 lePadV（≤840px）断点下启用横向滚动模式，onMounted / watch
// 会调用 scrollActiveIntoView 将激活页签在 nav 容器中水平居中。
//
// Bug：该函数使用 Element.scrollIntoView({ block: 'nearest', inline: 'center' })，
// 该 API 会滚动所有可滚动祖先——不仅水平滚动 nav 容器，还会在元素不可见时
// 触发页面垂直滚动，导致页面加载时自动跳到 tab 位置。
//
// 契约：scrollActiveIntoView 应仅操作 navsContainer 的 scrollLeft，
// 绝不改变 window.scrollY。
// ============================================================================

describe('移动端滚动行为（lePadV 断点）', () => {
  test('OTab onMounted - 组件位于首屏下方时不应触发页面垂直滚动', async () => {
    await setViewport('phone');
    window.scrollTo(0, 0);
    expect(window.scrollY).toBe(0);

    // 1000px 占位把 OTab 推到首屏之下（phone 视口高度 812px）
    render({
      setup() {
        return () =>
          h('div', {}, [
            h('div', { style: 'height: 1000px;' }),
            h(OTab, { modelValue: 'tab5' }, () => Array.from({ length: 10 }, (_, i) => h(OTabPane, { value: `tab${i + 1}`, label: `标签${i + 1}` }))),
          ]);
      },
    });

    // 等待 onMounted + watch immediate 触发的 scrollActiveIntoView 执行完毕
    await flush();
    // smooth 滚动是异步的，额外等待确保滚动已发起
    await new Promise((r) => setTimeout(r, 300));

    // 核心断言：页面不应被垂直滚动到 tab 位置
    expect(window.scrollY).toBe(0);
  });

  test('OTab scrollActiveIntoView - Element.scrollIntoView 不应被调用（改用 scrollLeft）', async () => {
    await setViewport('phone');
    window.scrollTo(0, 0);

    const scrollIntoViewSpy = vi.spyOn(Element.prototype, 'scrollIntoView');

    render({
      setup() {
        return () =>
          h('div', {}, [
            h('div', { style: 'height: 1000px;' }),
            h(OTab, { modelValue: 'tab5' }, () => Array.from({ length: 10 }, (_, i) => h(OTabPane, { value: `tab${i + 1}`, label: `标签${i + 1}` }))),
          ]);
      },
    });

    await flush();
    await new Promise((r) => setTimeout(r, 300));

    // 修复后应使用 container.scrollTo({ left }) 而非 element.scrollIntoView()
    // scrollIntoView 不应被 navEl 调用
    expect(scrollIntoViewSpy).not.toHaveBeenCalled();

    scrollIntoViewSpy.mockRestore();
  });

  test('OTab scrollActiveIntoView - 激活页签在 nav 容器中水平居中（scrollLeft 被调整）', async () => {
    await setViewport('phone');
    window.scrollTo(0, 0);

    const screen = render({
      setup() {
        return () => h(OTab, { modelValue: 'tab7' }, () => Array.from({ length: 10 }, (_, i) => h(OTabPane, { value: `tab${i + 1}`, label: `标签${i + 1}` })));
      },
    });

    await flush();
    await new Promise((r) => setTimeout(r, 300));

    const container = screen.container.querySelector('.o-tab-navs-container') as HTMLElement;
    expect(container).not.toBeNull();

    // nav 容器应有水平滚动（激活项 tab7 不是第一个，需要向右滚动才能居中）
    expect(container.scrollLeft).toBeGreaterThan(0);

    // 页面垂直位置不应改变
    expect(window.scrollY).toBe(0);
  });

  // ==========================================================================
  // 可见性验证：激活 tab 应在容器可视范围内完全可见（不被边缘裁切）
  // 注意：inline:'center' 语义为"尽量居中"，靠近两端时 scrollLeft 会被
  // clamp，此时激活项靠左/靠右而非居中，因此只验证完全可见而非中心对齐。
  // ==========================================================================

  test('OTab scrollActiveIntoView - 激活页签在 nav 容器可视范围内完全可见', async () => {
    await setViewport('phone');
    window.scrollTo(0, 0);

    const screen = render({
      setup() {
        return () => h(OTab, { modelValue: 'tab7' }, () => Array.from({ length: 10 }, (_, i) => h(OTabPane, { value: `tab${i + 1}`, label: `标签${i + 1}` })));
      },
    });

    await flush();
    await new Promise((r) => setTimeout(r, 500));

    const container = screen.container.querySelector('.o-tab-navs-container') as HTMLElement;
    expect(container).not.toBeNull();

    const activeNav = screen.container.querySelector('.o-tab-nav-active') as HTMLElement;
    expect(activeNav).not.toBeNull();

    // 验证激活 tab 完全在容器可视范围内（不被左右边缘裁切）
    const containerRect = container.getBoundingClientRect();
    const activeRect = activeNav.getBoundingClientRect();

    // 左边缘不超出容器左边界
    expect(activeRect.left).toBeGreaterThanOrEqual(containerRect.left - 1);
    // 右边缘不超出容器右边界
    expect(activeRect.right).toBeLessThanOrEqual(containerRect.right + 1);
  });

  test('OTab scrollActiveIntoView - 激活首个页签时 scrollLeft 为 0（左边缘 clamp）', async () => {
    await setViewport('phone');
    window.scrollTo(0, 0);

    const screen = render({
      setup() {
        return () => h(OTab, { modelValue: 'tab1' }, () => Array.from({ length: 10 }, (_, i) => h(OTabPane, { value: `tab${i + 1}`, label: `标签${i + 1}` })));
      },
    });

    await flush();
    await new Promise((r) => setTimeout(r, 500));

    const container = screen.container.querySelector('.o-tab-navs-container') as HTMLElement;
    expect(container).not.toBeNull();

    // 第一个 tab 已在左边缘，居中计算结果为负值，scrollTo 自动 clamp 到 0
    expect(container.scrollLeft).toBe(0);
  });

  test('OTab scrollActiveIntoView - 激活末尾页签时 scrollLeft 达到最大值（右边缘 clamp）', async () => {
    await setViewport('phone');
    window.scrollTo(0, 0);

    const screen = render({
      setup() {
        return () => h(OTab, { modelValue: 'tab10' }, () => Array.from({ length: 10 }, (_, i) => h(OTabPane, { value: `tab${i + 1}`, label: `标签${i + 1}` })));
      },
    });

    await flush();
    await new Promise((r) => setTimeout(r, 500));

    const container = screen.container.querySelector('.o-tab-navs-container') as HTMLElement;
    expect(container).not.toBeNull();

    // 最后一个 tab 应将 scrollLeft 推到最大值（scrollWidth - clientWidth）
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    expect(container.scrollLeft).toBeGreaterThan(0);
    // 应接近最大值（允许 smooth 滚动残余误差）
    expect(Math.abs(container.scrollLeft - maxScrollLeft)).toBeLessThanOrEqual(3);
  });

  test('OTab scrollActiveIntoView - 切换激活页签后仅水平滚动，不触发垂直滚动', async () => {
    await setViewport('phone');
    window.scrollTo(0, 0);

    const screen = render({
      setup() {
        return () =>
          h('div', {}, [
            h('div', { style: 'height: 1000px;' }),
            h(OTab, { modelValue: 'tab1' }, () => Array.from({ length: 10 }, (_, i) => h(OTabPane, { value: `tab${i + 1}`, label: `标签${i + 1}` }))),
          ]);
      },
    });

    await flush();
    await new Promise((r) => setTimeout(r, 300));

    // 初始 scrollY 应为 0
    expect(window.scrollY).toBe(0);

    // 点击最后一个 tab 触发 scrollActiveIntoView（watch activeKey）
    const navs = screen.container.querySelectorAll('.o-tab-nav');
    const lastNav = navs[navs.length - 1] as HTMLElement;
    expect(lastNav).toBeTruthy();
    lastNav.click();

    await flush();
    await new Promise((r) => setTimeout(r, 300));

    // 切换后页面垂直位置仍不应改变
    expect(window.scrollY).toBe(0);
  });

  // ==========================================================================
  // 指示器对齐验证（spec issue #226 用户故事 12）：移动端横向滚动模式下，
  // 底部指示线 `.o-tab-nav-anchor` 应始终与激活页签 `.o-tab-nav-active` 的
  // 实际渲染位置左右缘对齐——无论滚动来源是用户手势滑动、编程滚动，
  // 还是激活切换触发的 scrollActiveIntoView 平滑滚动。
  //
  // 断言来由：指示器是滚动容器的 absolute 子元素（left:0 + translate3d），
  // 激活页签 navEl.offsetLeft 是布局坐标；两者需在同一视口坐标系下对齐。
  // 采样于滚动落定后（等待 500ms 覆盖 smooth 滚动与指示器 transition），
  // 容差 ±1px 吸收设备像素比带来的亚像素偏差（实测约 0.48px）。
  // ==========================================================================

  test('OTab 指示器对齐 - 用户手势滑动后 anchor 与激活页签左右缘对齐', async () => {
    await setViewport('phone');
    window.scrollTo(0, 0);

    const screen = render({
      setup() {
        return () => h(OTab, { modelValue: 'tab1' }, () => Array.from({ length: 10 }, (_, i) => h(OTabPane, { value: `tab${i + 1}`, label: `标签${i + 1}` })));
      },
    });

    await flush();
    // 等待挂载时的 scrollActiveIntoView（tab1 无需滚动）与指示器定位落定
    await new Promise((r) => setTimeout(r, 500));

    const container = screen.container.querySelector('.o-tab-navs-container') as HTMLElement;
    expect(container).not.toBeNull();
    // 测量列表（v-show 隐藏）内也有同名类，须取可见列表内的激活项
    const visibleList = screen.container.querySelector('.o-tab-nav-list:not(.width-measurement)') as HTMLElement;
    const activeNav = visibleList.querySelector('.o-tab-nav-active') as HTMLElement;
    expect(activeNav).not.toBeNull();
    const anchor = screen.container.querySelector('.o-tab-nav-anchor') as HTMLElement;
    expect(anchor).not.toBeNull();

    // 模拟用户手势滑动浏览页签（编程滚动，与手势对布局等价），滑到中部再滑到末端
    container.scrollTo({ left: 150, behavior: 'auto' });
    await new Promise((r) => setTimeout(r, 300));
    container.scrollTo({ left: container.scrollWidth - container.clientWidth, behavior: 'auto' });
    await new Promise((r) => setTimeout(r, 300));
    expect(container.scrollLeft).toBeGreaterThan(0);

    // 滚动落定后采样：指示器左右缘应与激活页签（即便已滑出视口）左右缘对齐
    const activeRect = activeNav.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();
    expect(Math.abs(anchorRect.left - activeRect.left)).toBeLessThanOrEqual(1);
    expect(Math.abs(anchorRect.right - activeRect.right)).toBeLessThanOrEqual(1);
  });

  test('OTab 指示器对齐 - 激活切换触发的平滑滚动落定后 anchor 与激活页签左右缘对齐', async () => {
    await setViewport('phone');
    window.scrollTo(0, 0);

    const screen = render({
      setup() {
        return () => h(OTab, { modelValue: 'tab1' }, () => Array.from({ length: 10 }, (_, i) => h(OTabPane, { value: `tab${i + 1}`, label: `标签${i + 1}` })));
      },
    });

    await flush();
    await new Promise((r) => setTimeout(r, 500));

    const container = screen.container.querySelector('.o-tab-navs-container') as HTMLElement;
    expect(container).not.toBeNull();
    const visibleList = screen.container.querySelector('.o-tab-nav-list:not(.width-measurement)') as HTMLElement;
    const anchor = screen.container.querySelector('.o-tab-nav-anchor') as HTMLElement;
    expect(anchor).not.toBeNull();

    // 切换到靠后的页签，触发 scrollActiveIntoView 的 smooth scrollTo
    // 注意：末尾还有一个 v-show 隐藏的省略号 nav（也带 o-tab-nav 类），须排除
    const navs = visibleList.querySelectorAll('.o-tab-nav:not(.o-tab-nav-ellipsis)');
    (navs[navs.length - 1] as HTMLElement).click();

    // 等待 smooth 滚动与指示器 transition（var(--o-duration-m1)）全部落定
    await flush();
    await new Promise((r) => setTimeout(r, 500));
    expect(container.scrollLeft).toBeGreaterThan(0);

    // 落定后采样：指示器左右缘应与激活页签左右缘对齐
    const activeNav = visibleList.querySelector('.o-tab-nav-active') as HTMLElement;
    const activeRect = activeNav.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();
    expect(Math.abs(anchorRect.left - activeRect.left)).toBeLessThanOrEqual(1);
    expect(Math.abs(anchorRect.right - activeRect.right)).toBeLessThanOrEqual(1);
  });
});

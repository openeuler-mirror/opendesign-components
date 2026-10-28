/**
 * OTab 桌面端溢出新行为红用例组。
 *
 * Spec：https://gitcode.com/openeuler/opendesign-components/issues/226
 * （原始 bug 报告：#215；规格、实施决策与验收标准以 #226 为权威源）
 *
 * ⚠️ 本组用例遵循仓库红绿纪律「先写失败用例确认红 → 修复 → 转绿」：
 * 基于 6e064cab 现状运行时**全部失败（红）**，等待溢出几何模型实现（T04，
 * 即「全量渲染 + 容器裁切 + 激活项就近滚动入视」）落地后转绿。
 *
 * 范围：桌面端（非 lePadV 断点，全局 setup 默认视口 1920×1080）、
 * `variant` 非 `button`、未设置 `maxShow` 的溢出行为，含两组用例：
 *   - 静态几何契约（T03 红用例组）：模型就位前先行红、T04 落地后转绿；
 *   - 动态交互收口（T05 验证用例组）：模型就位后的动态场景（closable /
 *     addable / 文案变化 / 断点往返 / 弹层选中 / prefix 插槽），预期全绿——
 *     若出现红即为几何模型的真实 bug。
 *
 * 断言接缝：组件挂载级 DOM 行为（class / rect / scrollLeft / 弹层内容），
 * 只断言外部可观测行为，不断言内部状态与实现细节。
 * 测试环境勘误：本仓测试基建为 vitest browser mode（真实 Chromium，
 * 真实布局），spec Testing Decisions 中「jsdom 挂载 + scrollTo mock」为
 * 笔误；rect / scrollLeft 直接真值断言，无需 mock。
 *
 * 不归属本文件的维度：
 *   - 断点尺寸数值 → OTab.responsive.test.ts
 *   - 移动端滚动行为 → OTab.index.test.ts（lePadV 断点分组）
 */
import { test, expect, describe, beforeEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, reactive, type VNode } from 'vue';
import OTab from '../OTab.vue';
import OTabPane from '../OTabPane.vue';
import { flush } from '../../../__tests__/_helpers/dom';
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
  /** 变体（默认 text；button 路径为回归隔离墙，不在本组用例范围） */
  variant?: 'text' | 'solid';
}

/** 以固定宽度容器 + N 个「标签N」页签挂载 OTab（桌面端默认 text/medium） */
function renderTabs({ width, count, modelValue, variant = 'text' }: RenderTabsOptions) {
  return render({
    setup() {
      return () =>
        h('div', { style: `width: ${width}px;` }, [
          h(OTab, { modelValue, variant }, () =>
            Array.from({ length: count }, (_, i) => h(OTabPane, { value: `tab${i + 1}`, label: `标签${i + 1}` })),
          ),
        ]);
    },
  });
}

/**
 * 等布局落定：sortUidList（debounceRAF）+ useElementBounding 测量链 +
 * 省略号显隐一帧时差收敛。固定等待（非轮询条件），无时间敏感断言。
 */
async function settle() {
  await flush();
  await new Promise((r) => setTimeout(r, 500));
}

/** 读取省略号渐变阴影的左缘（视口坐标）：阴影为省略号节点的 ::before，左移一个阴影宽 */
function getEllipsisShadowLeft(ellipsis: HTMLElement): number {
  const shadowWidth = parseFloat(getComputedStyle(ellipsis, ':before').width) || 0;
  return ellipsis.getBoundingClientRect().left - shadowWidth;
}

beforeEach(() => {
  // 防御性清理：正常情况下 vitest-browser-vue 的自动 cleanup 已移除传送门内容
  document.body.querySelectorAll(':scope > .o-popup, :scope > .o-layer').forEach((el) => el.remove());
});

describe('桌面端溢出新行为（红用例组，待溢出几何模型实现后转绿）', () => {
  test('OTab 溢出态尾部无空白 - 最后可见页签右缘不低于省略号阴影左缘', async () => {
    await setViewport('desktop');
    // 前置条件：600px 容器 + 10 个「标签N」页签（自然内容总宽约 747px，明显溢出），
    // 激活首个页签（位于左缘，无需滚动）。现状下旧宽度状态机只保留 7 个完整放得下的页签。
    const screen = renderTabs({ width: 600, count: 10, modelValue: 'tab1' });
    await settle();

    const ellipsis = screen.container.querySelector(ELLIPSIS_SELECTOR) as HTMLElement;
    expect(ellipsis).not.toBeNull();
    // 前置确认：溢出态下省略号显示（现状即为真，非本用例的红点）
    expect(getComputedStyle(ellipsis).display).not.toBe('none');

    const navs = Array.from(screen.container.querySelectorAll(VISIBLE_NAV_SELECTOR)) as HTMLElement[];
    expect(navs.length).toBeGreaterThan(0);
    const lastNav = navs[navs.length - 1];
    const lastNavRight = lastNav.getBoundingClientRect().right;
    const shadowLeft = getEllipsisShadowLeft(ellipsis);

    // 期望行为（spec User Story 1/2 + Testing Decisions 用例清单 #1）：
    // 溢出态下最后一个页签应被容器右缘裁切或贴住省略号阴影，右缘 ≥ 阴影左缘
    // （1px 亚像素容差）——尾部不允许出现「不足一个页签宽」的空白断裂带。
    // 现状红：旧算法以「页签完整放入容器」为唯一纳入标准，离散页签宽度必然
    // 剩余 0..单页签宽的尾部空白（issue #215 的断裂带，实测约 39px）。
    expect(lastNavRight).toBeGreaterThanOrEqual(shadowLeft - 1);
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
    // 现状红：旧算法只折叠「放不下」的项，可见列表中不存在任何被裁切的部分可见页签。
    const partialNav = navs.find((nav) => {
      const rect = nav.getBoundingClientRect();
      return rect.right > containerRect.right + 1 && rect.left < containerRect.right - 1;
    });
    expect(partialNav, '溢出态下可见列表应存在被容器右缘裁切的部分可见页签').toBeDefined();

    // 点击省略号打开弹层（内容 Teleport 到 document.body，取最后一个实例）
    const ellipsis = screen.container.querySelector(ELLIPSIS_SELECTOR) as HTMLElement;
    ellipsis.click();
    await new Promise((r) => setTimeout(r, 600));

    // 期望行为（spec「不完全可见（左右任一缘越界）即进弹层名单」）：
    // 部分可见页签应出现在省略号弹层名单中（受控重复：既露出又出现在弹层）。
    // 现状红：部分可见页签被整体折叠出可见列表，弹层名单与其可见性状态脱节。
    const popup = lastBodyEl('.o-tab-more-popup');
    expect(popup).not.toBeNull();
    const optionTexts = Array.from(popup!.querySelectorAll('.o-option')).map((o) => (o.textContent || '').trim());
    expect(optionTexts).toContain((partialNav!.textContent || '').trim());

    // 期望行为（同一几何规则的反向）：完全可见的页签不应出现在弹层名单中
    // （名单 = 不完全可见页签集合，与滚动位置/容器宽度的判定解耦后的唯一语义）。
    // 现状红：标签7 完整可见（右缘未触及省略号）却因「放不下」被折叠进弹层名单。
    const ellipsisWidth = ellipsis.getBoundingClientRect().width;
    const fullyVisibleBoundary = containerRect.right - ellipsisWidth;
    const fullyVisibleLabels = navs
      .filter((nav) => nav.getBoundingClientRect().right <= fullyVisibleBoundary - 1)
      .map((nav) => (nav.textContent || '').trim());
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
    // 现状红：桌面端 scrollActiveIntoView 有 lePadV 守卫直接返回，scrollLeft 恒为 0。
    expect(container.scrollLeft, '激活视口外页签时容器 scrollLeft 应大于 0（桌面端无滚动）').toBeGreaterThan(0);

    // 期望行为（复用移动端同款断言）：激活页签 rect 完整在容器可视范围内（±1px 容差），
    // 不被左右边缘裁切。现状下此断言因旧算法「激活项就近插入」恰好为绿，
    // 红点在上一条：桌面端根本不滚动。
    const activeNav = screen.container.querySelector('.o-tab-nav-active') as HTMLElement;
    expect(activeNav).not.toBeNull();
    const containerRect = container.getBoundingClientRect();
    const activeRect = activeNav.getBoundingClientRect();
    expect(activeRect.left).toBeGreaterThanOrEqual(containerRect.left - 1);
    expect(activeRect.right).toBeLessThanOrEqual(containerRect.right + 1);
  });

  test('OTab 省略号显隐判据 - 以内容溢出为准，非溢出时隐藏且居中布局不变', async () => {
    await setViewport('desktop');

    // ── 前置条件 A（红）：solid 变体 8 个页签（自然内容总宽约 920px，
    // 含边框与 solid 间距）放入 880px 容器 → 内容溢出约 40px。
    // 现状：旧宽度状态机以 clientWidth（不含边框）+ 估算间距计算「放得下」，
    // 判定不溢出 → hiddenUids 为空 → 省略号与溢出态 class 均不显示，
    // 内容实际被容器裁切。solid 属于「variant 非 button」路径，在本 spec 范围内。
    const screenA = renderTabs({ width: 880, count: 8, modelValue: 'tab1', variant: 'solid' });
    await settle();

    const containerA = screenA.container.querySelector(CONTAINER_SELECTOR) as HTMLElement;
    const measurementA = screenA.container.querySelector(MEASUREMENT_SELECTOR) as HTMLElement;
    const ellipsisA = screenA.container.querySelector(ELLIPSIS_SELECTOR) as HTMLElement;
    expect(ellipsisA).not.toBeNull();

    // 前置确认（现状即为真，非红点）：内容总宽（全量测量列表宽度）> 容器宽 → 溢出
    const contentWidth = measurementA.getBoundingClientRect().width;
    expect(contentWidth).toBeGreaterThan(containerA.clientWidth);

    // 期望行为（spec Implementation Decisions「省略号显隐与布局模式切换：
    // 统一改判『内容总宽 > 容器宽』（布局值，与滚动位置无关）」）：
    // 内容溢出时省略号显示、容器带溢出态 class（grid 居中 → 流式布局切换）。
    // 现状红：两者均未显示（实测 display:none / 无 overflown 类）。
    expect(getComputedStyle(ellipsisA).display, '内容溢出时省略号应显示（现状：solid 估宽偏差导致漏显）').not.toBe('none');
    expect(containerA.classList.contains('overflown'), '内容溢出时容器应带 overflown 溢出态 class').toBe(true);

    screenA.unmount();
    await flush();

    // ── 前置条件 B（回归护栏，现状为绿）：600px 容器 + 3 个页签（总宽约 199px）
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
});

// ============================================================================
// 动态交互收口（T05 验证用例组）
//
// 前提：T04 的溢出几何模型（全量渲染 + 容器裁切 + 激活项滚动入视）已就位，
// 本组为验证性用例，预期全绿；若红即为模型真实 bug（红绿纪律同样适用）。
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

/** vitest-browser-vue render 返回结构的最小类型约束 */
interface ScreenLike {
  container: HTMLElement;
}

/** 省略号弹层 wrap（内容 Teleport 到 document.body） */
const POPUP_SELECTOR = '.o-tab-more-popup';
/** 可见列表内激活页签（排除测量列表的同名节点与省略号节点） */
const ACTIVE_NAV_SELECTOR = `${VISIBLE_LIST_SELECTOR} > .o-tab-nav.o-tab-nav-active:not(.o-tab-nav-ellipsis)`;

interface StateTabsOptions {
  /** 外层容器固定宽度（px） */
  width: number;
  /** 页签数量（生成 标签1..标签N），与 tabs 二选一 */
  count?: number;
  /** 自定义页签数据（文案变化场景使用） */
  tabs?: TabItem[];
  /** 初始激活页签值 */
  modelValue?: string;
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
function renderStateTabs({ width, count, tabs, modelValue, closable, addable }: StateTabsOptions) {
  const items: TabItem[] = tabs ?? Array.from({ length: count ?? 0 }, (_, i) => ({ value: `tab${i + 1}`, label: `标签${i + 1}` }));
  const state = reactive({ tabs: items.map((t) => ({ ...t })), prefix: false });

  /** 业务侧响应 delete 事件：从状态中移除对应页签 */
  const removeTab = (value: string) => {
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
  await new Promise((r) => setTimeout(r, 600));
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

describe('动态交互收口（几何模型验证用例组）', () => {
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
    // 无空白残留：最后一个页签右缘仍贴住省略号阴影左缘
    const ellipsis = screen.container.querySelector(ELLIPSIS_SELECTOR) as HTMLElement;
    expect(navs[navs.length - 1].getBoundingClientRect().right).toBeGreaterThanOrEqual(getEllipsisShadowLeft(ellipsis) - 1);

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

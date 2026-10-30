/**
 * OCascaderV2 round 圆角语义与断点对齐验收测试。
 *
 * 覆盖维度：
 *   R1 · 断点对齐验收：cascader-v2 的降档语义与 input 家族一致
 *       （`<=laptop` 降档 + `<=pad_v` 恢复），medium 在 ≤840 视口高度为 28px，
 *       large 在 ≤840 恢复 40px；
 *   R2 · pill 圆角矩阵：多行式控件的 pill 圆角应为"同 size 单行 OInput 含边框
 *       容器高度一半"的预定义常数（large：20/18/20；medium：16/14/14），
 *       不随内容高度增长，且随断点与 input 家族镜像收缩/恢复；
 *   R3 · multiple 模式抽查：多选标签撑高控件后圆角仍为该 size 常数。
 *
 * 断言口径（真实 Chromium，vitest browser mode）：
 *   - 高度：`.o_box-main`（border-box，含 1px 边框）offsetHeight 精确断言；
 *   - 圆角：`.o_box-main` 四角 computed border-radius 精确 px 断言
 *     （computedStyle 读到的是声明值而非渲染层 clamp 结果）。
 *
 * 约定：cascader-v2 组件默认 size 为 large（源码 cascaderDefaultSize），
 * 测 medium 须显式传 `size="medium"`；组件无 small 样式档，不测 small。
 *
 * 通路覆盖：组件 prop（R2/R3）、OForm/OFormItem 继承与全局 initRound
 * class 兜底（R4）——三条配置通路收敛到同一常数矩阵。
 */
import { test, expect, describe, afterEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OCascaderV2 from '../OCascaderV2.vue';
import OForm from '../../form/OForm.vue';
import OFormItem from '../../form/OFormItem.vue';
import { initRound, defaultRound } from '../../_utils/global';
import { flush } from '../../../__tests__/_helpers/dom';
import { setViewport, type BreakpointName } from '../../../__tests__/_helpers/viewport';
import { OINPUT_HEIGHT_MATRIX, PILL_RADIUS_MATRIX, ROUND_MATRIX_VIEWPORTS, expectRadiusCornersPx } from '../../../__tests__/_helpers/round-pill';

/**
 * 测试用级联选项树：两级结构，叶子节点供 multiple 模式选中多个值。
 */
const OPTIONS = [
  {
    label: 'Option 1',
    value: '1',
    children: [
      { label: 'Sub 1-1', value: '1-1' },
      { label: 'Sub 1-2', value: '1-2' },
      { label: 'Sub 1-3', value: '1-3' },
    ],
  },
  {
    label: 'Option 2',
    value: '2',
    children: [
      { label: 'Sub 2-1', value: '2-1' },
      { label: 'Sub 2-2', value: '2-2' },
    ],
  },
  { label: 'Option 3', value: '3' },
  { label: 'Option 4', value: '4' },
];

/**
 * multiple 模式选中的叶子值集合：六个标签在受限宽度下必然换行，
 * 用于验证"内容撑高后圆角仍为常数"。
 */
const MULTIPLE_VALUES = ['1-1', '1-2', '1-3', '2-1', '2-2', '3'];

/**
 * 渲染单个 OCascaderV2 并返回 `.o_box-main` 主元素。
 * `.o_box-main` 是圆角（border-radius: var(--_box-radius)）与盒子高度的
 * 实际承载元素，是本文件高度与圆角断言的统一观测点。
 * @param props 透传给组件的 props（size / round / multiple / modelValue / style 等）
 * @returns `.o_box-main` 元素
 */
async function renderMain(props: Record<string, unknown> = {}): Promise<HTMLElement> {
  const screen = render(OCascaderV2, {
    props: { options: OPTIONS, placeholder: '请选择', ...props },
  });
  await flush();
  const main = screen.container.querySelector('.o-cascader-v2 .o_box-main');
  expect(main).not.toBeNull();
  return main as HTMLElement;
}

/**
 * 渲染后返回 InBox 根元素（` `.o-cascader-v2`，同时携带 `o_box-*` 组件类与
 * `o-cascader-v2-{size}` 尺寸类），供 class 组成断言使用。
 * @param props 透传给组件的 props（同 renderMain）
 * @returns InBox 根元素
 */
async function renderRoot(props: Record<string, unknown> = {}): Promise<HTMLElement> {
  const screen = render(OCascaderV2, {
    props: { options: OPTIONS, placeholder: '请选择', ...props },
  });
  await flush();
  const root = screen.container.querySelector('.o-cascader-v2');
  expect(root).not.toBeNull();
  return root as HTMLElement;
}

/**
 * 清理 teleport 到 body 的浮层节点（OPopup / 面板），避免跨用例 DOM 泄漏。
 */
const cleanupBodyPopups = () => {
  document.body.querySelectorAll('.o-cascader-v2-panel-popup, .o-popup-content, .o-cascader-v2-tag-popover').forEach((el) => el.remove());
};

afterEach(cleanupBodyPopups);

/**
 * R1 高度矩阵的视口档：断点端点与恢复档（不含 pad_h 中段代表，
 * 与本组既有结构保持一致）。期望值取自共享 helper 的高度矩阵（单一来源）。
 */
const HEIGHT_VIEWPORTS: readonly BreakpointName[] = ['desktop', 'laptop_max', 'pad_v_min', 'pad_v_max', 'phone'];

/**
 * R1 高度矩阵：cascader-v2 各视口期望高度（对齐 input 家族断点语义）。
 * - desktop(>1680)：不命中任何 media，medium 32 / large 40；
 * - laptop_max(1680)、pad_v_min(841)：命中 `<=laptop` 降档，medium 28 / large 36；
 * - pad_v_max(840)、phone(600)：命中 `<=pad_v` 恢复，medium 28（input 家族
 *   medium 在 ≤840 保持 28，不恢复 32）/ large 40。
 */
const HEIGHT_MATRIX = HEIGHT_VIEWPORTS.map((viewport) => ({
  viewport,
  medium: OINPUT_HEIGHT_MATRIX.medium[viewport],
  large: OINPUT_HEIGHT_MATRIX.large[viewport],
}));

describe('OCascaderV2 断点对齐（非 pill，高度）', () => {
  /**
   * R1 · 高度矩阵：断点降档/恢复语义与 input 家族一致
   * （`<=laptop` 降档，`<=pad_v` 恢复 large，medium 保持降档值）。
   */
  test.each(HEIGHT_MATRIX)('高度矩阵 $viewport：medium $medium px / large $large px', async ({ viewport, medium, large }) => {
    await setViewport(viewport);

    // large 先断言：≤840 恢复 40px 为独立护栏（断点恢复语义）
    const largeMain = await renderMain({ size: 'large' });
    expect(largeMain.offsetHeight, `${viewport} 下 large 高度`).toBe(large);

    // medium 后断言：≤840 保持 28px（input 家族语义，不恢复 32px）
    const mediumMain = await renderMain({ size: 'medium' });
    expect(mediumMain.offsetHeight, `${viewport} 下 medium 高度`).toBe(medium);
  });
});

/**
 * R2 pill 圆角矩阵：pill 圆角 = 同 size 单行 OInput 含边框容器高度的一半。
 * 期望值取自共享 helper 的圆角矩阵（单一来源）；本组件仅 large/medium 两档
 * （无 small 样式定义，不测 small）。遍历视口档同共享矩阵档。
 */
const PILL_MATRIX = ROUND_MATRIX_VIEWPORTS.map((viewport) => ({
  viewport,
  large: PILL_RADIUS_MATRIX.large[viewport],
  medium: PILL_RADIUS_MATRIX.medium[viewport],
}));

describe('OCascaderV2 pill 圆角（多行语义常数矩阵）', () => {
  /**
   * R2 · 四角精确 px 断言：round="pill" 时圆角为预定义常数，
   * 随 size 与断点取值，不随盒子实际高度变化。
   */
  test.each(PILL_MATRIX)('pill 矩阵 $viewport：large $large px / medium $medium px', async ({ viewport, large, medium }) => {
    await setViewport(viewport);

    const largeMain = await renderMain({ size: 'large', round: 'pill' });
    expectRadiusCornersPx(largeMain, large, `OCascaderV2 large @${viewport}`);

    const mediumMain = await renderMain({ size: 'medium', round: 'pill' });
    expectRadiusCornersPx(mediumMain, medium, `OCascaderV2 medium @${viewport}`);
  });

  /**
   * R2 补充 · 默认档（不传 size）：组件默认 size 为 large（源码
   * cascaderDefaultSize），未传 size 时 pill 圆角必须取 large 档常数，
   * 而非 InBox 全局回退的 medium 档——锁定 InBox size 口径与组件
   * 实际渲染尺寸一致的契约。
   */
  test('默认 size（large）+ pill：圆角取 large 档常数而非 InBox 回退的 medium 档', async () => {
    await setViewport('desktop');

    // 前置：组件默认档为 large（高度 class 落 large，40px 高）
    const root = await renderRoot({ round: 'pill' });
    expect(root.classList.contains('o-cascader-v2-large')).toBe(true);

    // 核心契约：不传 size 时 pill 圆角 = large 档常数（共享矩阵单一来源），
    // InBox 的 size 口径须与组件实际渲染尺寸一致，不落入全局回退 medium
    const main = root.querySelector('.o_box-main') as HTMLElement;
    expectRadiusCornersPx(main, PILL_RADIUS_MATRIX.large.desktop, 'OCascaderV2 默认档 large @desktop');
  });
});

describe('OCascaderV2 pill multiple 模式（圆角常数不随内容高度增长）', () => {
  /**
   * R3 · multiple 抽查：desktop + medium + 多个选中值。
   * 多选标签在受限宽度下换行撑高盒子（高度 > 单行 32px），
   * 圆角仍须为该 size 常数 16px，证明"胶囊常数"而非"半高自适应"。
   */
  test('multiple 撑高后圆角仍为 medium 常数 16px', async () => {
    await setViewport('desktop');

    const main = await renderMain({
      size: 'medium',
      round: 'pill',
      multiple: true,
      modelValue: MULTIPLE_VALUES,
      // 受限宽度迫使六个标签换行，盒子高度必然超过单行 medium 高度
      style: 'width: 260px',
    });

    // 前置：盒子确实被多选内容撑高（大于单行 32px），断言才有区分度
    expect(main.offsetHeight, 'multiple 撑高后盒子高度应大于单行 32px').toBeGreaterThan(32);

    // 核心契约：撑高不改变 pill 圆角常数（medium @desktop，共享矩阵单一来源）
    expectRadiusCornersPx(main, PILL_RADIUS_MATRIX.medium.desktop, 'OCascaderV2 medium @desktop');
  });
});

describe('OCascaderV2 pill 配置通路（OForm/OFormItem 继承与全局 initRound 兜底）', () => {
  // 快照 + 复位：全局圆角配置的用例间隔离，避免污染其他测试文件
  const ROUND_SNAPSHOT = defaultRound.value;

  afterEach(() => {
    initRound(ROUND_SNAPSHOT);
    cleanupBodyPopups();
  });

  /**
   * R4 · 通路②（表单继承）：OForm round=pill 经 OFormItem 合并提供给
   * cascader-v2（useFormField 注入链），须与显式 prop 路径收敛到同一常数。
   */
  test('OForm round=pill 内的 OCascaderV2 @desktop size=medium - 四角圆角 16px', async () => {
    await setViewport('desktop');
    const screen = render({
      render: () =>
        h(
          OForm,
          { round: 'pill' },
          {
            default: () => h(OFormItem, { label: '级联' }, { default: () => h(OCascaderV2, { size: 'medium', options: OPTIONS, placeholder: '请选择' }) }),
          },
        ),
    });
    await flush();
    const main = screen.container.querySelector('.o-cascader-v2 .o_box-main') as HTMLElement;
    expect(main).not.toBeNull();
    expectRadiusCornersPx(main, PILL_RADIUS_MATRIX.medium.desktop, 'OCascaderV2 medium @desktop');
  });

  /**
   * R4 · 通路②优先级：OFormItem round=pill 覆盖 OForm round=8px，
   * 验证 FormItem 优先于 Form 的合并语义在多行 pill 常数下同样成立。
   */
  test('OFormItem round=pill 覆盖 OForm round=8px @desktop size=medium - 四角圆角 16px', async () => {
    await setViewport('desktop');
    const screen = render({
      render: () =>
        h(
          OForm,
          { round: '8px' },
          {
            default: () =>
              h(OFormItem, { label: '级联', round: 'pill' }, { default: () => h(OCascaderV2, { size: 'medium', options: OPTIONS, placeholder: '请选择' }) }),
          },
        ),
    });
    await flush();
    const main = screen.container.querySelector('.o-cascader-v2 .o_box-main') as HTMLElement;
    expect(main).not.toBeNull();
    expectRadiusCornersPx(main, PILL_RADIUS_MATRIX.medium.desktop, 'OCascaderV2 medium @desktop');
  });

  /**
   * R4 · 通路③（全局兜底）：initRound('pill') 且组件不传 round prop 时，
   * 走 `.o_box-round-pill` class 常数路径，须与显式 prop 路径收敛。
   */
  test('无 round prop + initRound(pill) @desktop size=medium - class 兜底四角圆角 16px', async () => {
    await setViewport('desktop');
    initRound('pill');
    const main = await renderMain({ size: 'medium' });
    expectRadiusCornersPx(main, PILL_RADIUS_MATRIX.medium.desktop, 'OCascaderV2 medium @desktop');
  });
});

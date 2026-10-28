/**
 * OInput round 圆角现状基线护栏测试。
 *
 * 定位：单行控件视觉契约的基线护栏。多行控件 pill 语义调整为胶囊常数的变更中，
 * OInput 等单行组件的行为必须零变化：pill（100vh 内联，浏览器 clamp 成半胶囊）、
 * 默认圆角（随主题 token）、自定义值（内联精确生效）三条路径由本文件锁定，
 * 任何红即代表单行契约被破坏。
 *
 * 断言口径（与 spec Testing Decisions 一致）：
 *   - 环境为真实 Chromium（vitest browser mode），getComputedStyle 可读解析后的
 *     border-radius 声明值；
 *   - 已知边界：computedStyle 返回**声明值**而非渲染层 clamp 后的使用值——单行 pill
 *     的内联 `--_box-radius: 100vh` 读出为视口高像素数。因此单行 pill 只能**间接**断言：
 *     四角声明值 ≥ 实测高度/2 + 高度精确断言，数学上锁定「渲染层 clamp 后必为完整半胶囊」；
 *   - 高度取 `.o_box-main`（border-box，含 1px 边框）的 getComputedStyle().height；
 *   - 默认（非 pill）圆角在 e.light 主题下三个 size 均为 4px（token 全档 4px）。
 *
 * 不归属本文件的维度：
 *   - 按 types.ts 的功能/视觉/插槽契约 → OInput.index.test.ts
 *   - SSR 字符串渲染 + hydration mismatch → OInput.ssr.test.ts
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OInput from '../OInput.vue';
import OForm from '../../form/OForm.vue';
import OFormItem from '../../form/OFormItem.vue';
import { setViewport, type BreakpointName } from '../../../__tests__/_helpers/viewport';
import { OINPUT_HEIGHT_MATRIX, ROUND_MATRIX_VIEWPORTS, expectRadiusCornersPx, type RoundSizeKey } from '../../../__tests__/_helpers/round-pill';

/** OInput 组件 props 的测试用子集（仅本文件关注的字段） */
interface InputPropsSubset {
  size?: RoundSizeKey;
  round?: 'pill' | '8px';
}

/** 期望值数据源：`.o_box-main` 高度矩阵与矩阵遍历视口档由共享 helper `round-pill` 提供（单一来源，口径见其 JSDoc） */

/** 四角 computed border-radius 的读取顺序（与断言失败信息中的角名一一对应） */
const RADIUS_CORNERS = [
  ['左上', 'borderTopLeftRadius'],
  ['右上', 'borderTopRightRadius'],
  ['右下', 'borderBottomRightRadius'],
  ['左下', 'borderBottomLeftRadius'],
] as const;

/**
 * @description 在指定视口渲染 OInput 并返回其 `.o_box-main`（圆角与边框的承载元素）
 * @param bp 断点名称（先切视口再渲染，确保 media query 在渲染前已命中）
 * @param props OInput props 子集
 * @returns 渲染出的 `.o_box-main` 元素
 */
async function renderInputMain(bp: BreakpointName, props: InputPropsSubset) {
  await setViewport(bp);
  const screen = render(OInput, { props: props as any });
  return screen.container.querySelector('.o_box-main') as HTMLElement;
}

/**
 * @description 断言 pill 单行胶囊语义：高度精确 + 四角圆角声明值 ≥ 高度/2
 *
 * computedStyle 的 borderRadius 为声明值（100vh = 视口高像素），clamp 只发生在渲染层，
 * 因此「声明值 ≥ 半高」+「高度精确」在数学上锁定浏览器渲染时四角被夹为完整半胶囊。
 * @param main `.o_box-main` 元素
 * @param size size 档位（用于查期望高度矩阵与失败信息）
 * @param bp 断点名称（用于失败信息）
 */
function expectPillCapsule(main: HTMLElement, size: RoundSizeKey, bp: BreakpointName) {
  const expectedHeight = OINPUT_HEIGHT_MATRIX[size][bp];
  const cs = getComputedStyle(main);
  expect(parseFloat(cs.height), `OInput round=pill size=${size} @${bp} - .o_box-main 高度`).toBeCloseTo(expectedHeight, 0);
  const half = expectedHeight / 2;
  for (const [cornerName, propName] of RADIUS_CORNERS) {
    const radius = parseFloat(cs[propName]);
    expect(radius, `OInput round=pill size=${size} @${bp} - ${cornerName}圆角声明值应 ≥ 半高 ${half}px（100vh 声明值）`).toBeGreaterThanOrEqual(half);
  }
}

// ============================================================================
// G1 · pill 矩阵：3 size × 6 视口（18 case）
// 高度精确断言 + 四角声明值 ≥ 半高（间接口径，见文件头说明）
// ============================================================================
describe('G1 · pill 矩阵（3 size × 6 视口）', () => {
  for (const size of ['small', 'medium', 'large'] as RoundSizeKey[]) {
    for (const bp of ROUND_MATRIX_VIEWPORTS) {
      const height = OINPUT_HEIGHT_MATRIX[size][bp];
      test(`OInput round=pill size=${size} @${bp} - 高度${height}px，四角圆角声明值≥${height / 2}px`, async () => {
        const main = await renderInputMain(bp, { size, round: 'pill' });
        expectPillCapsule(main, size, bp);
      });
    }
  }
});

// ============================================================================
// G2 · 默认圆角对照（无 round）：desktop 与 pad_v_max 下三 size 均为 4px
// 锁定默认圆角走 token 路径且不随断点变化（e.light 主题 --o-radius_control-* 全档 4px）
// ============================================================================
describe('G2 · 默认圆角对照（无 round）', () => {
  for (const bp of ['desktop', 'pad_v_max'] as BreakpointName[]) {
    for (const size of ['small', 'medium', 'large'] as RoundSizeKey[]) {
      test(`OInput round 默认 size=${size} @${bp} - 四角圆角均为 4px`, async () => {
        const main = await renderInputMain(bp, { size });
        expectRadiusCornersPx(main, 4, `OInput round 默认 size=${size} @${bp}`);
      });
    }
  }
});

// ============================================================================
// G3 · 自定义值路径：round="8px" 内联直出，desktop 与 pad_v_max 各一次
// （内联路径不受断点影响，作为 pill 改造不触碰自定义值路径的护栏）
// ============================================================================
describe('G3 · 自定义值路径', () => {
  for (const bp of ['desktop', 'pad_v_max'] as BreakpointName[]) {
    test(`OInput round=8px @${bp} - 四角圆角精确 8px`, async () => {
      const main = await renderInputMain(bp, { size: 'medium', round: '8px' });
      expectRadiusCornersPx(main, 8, `OInput round=8px @${bp}`);
    });
  }
});

// ============================================================================
// G4 · OForm 继承基线：OForm round="pill" 包裹的 OInput 与直接传 prop 结果一致
// 继承链：OForm provide → OFormItem 合并 → OInput inject（effectiveRound）
// ============================================================================
describe('G4 · OForm 继承基线', () => {
  test('OInput round 继承 OForm round=pill - 与直接传 prop 的 pill 表现完全一致', async () => {
    await setViewport('desktop');
    // 经 OForm > OFormItem > OInput 继承（真实表单用法）
    const inheritedScreen = render({
      setup() {
        return () => h(OForm, { round: 'pill' }, { default: () => h(OFormItem, null, { default: () => h(OInput, { size: 'medium' }) }) });
      },
    });
    // 直接传 prop（对照组）
    const directScreen = render(OInput, { props: { size: 'medium', round: 'pill' } });

    const inheritedMain = inheritedScreen.container.querySelector('.o_box-main') as HTMLElement;
    const directMain = directScreen.container.querySelector('.o_box-main') as HTMLElement;
    const inheritedBox = inheritedScreen.container.querySelector('.o-input') as HTMLElement;
    const directBox = directScreen.container.querySelector('.o-input') as HTMLElement;

    // 两条路径均注入 pill class（class 兜底与内联路径共用的选择器钩子）
    expect(inheritedBox.classList.contains('o_box-round-pill'), 'OForm 继承路径 - o_box-round-pill class').toBe(true);
    expect(directBox.classList.contains('o_box-round-pill'), '直接 prop 路径 - o_box-round-pill class').toBe(true);

    // 高度一致且精确（medium @desktop = 32px）
    const inheritedCs = getComputedStyle(inheritedMain);
    const directCs = getComputedStyle(directMain);
    expect(inheritedCs.height, 'OForm 继承路径 - .o_box-main 高度').toBe('32px');
    expect(directCs.height, '直接 prop 路径 - .o_box-main 高度').toBe('32px');

    // 四角圆角声明值逐角一致（两条路径均输出 100vh 内联声明）
    for (const [cornerName, propName] of RADIUS_CORNERS) {
      expect(inheritedCs[propName], `OForm 继承路径 - ${cornerName}圆角与直接 prop 路径一致`).toBe(directCs[propName]);
      expect(parseFloat(inheritedCs[propName]), `OForm 继承路径 - ${cornerName}圆角声明值 ≥ 半高 16px`).toBeGreaterThanOrEqual(16);
    }
  });
});

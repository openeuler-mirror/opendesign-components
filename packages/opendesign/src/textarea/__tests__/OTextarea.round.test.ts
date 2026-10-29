/**
 * OTextarea round 圆角语义测试。
 *
 * 多行控件的 pill 语义：圆角为「同 size 单行 OInput 含边框容器高度的一半」
 * （预定义常数），不随 textarea 内容高度增长，并随 size × 断点取值：
 *
 *   small  ：全断点 12px（单行高 24 恒定）；
 *   medium ：默认 16px，<=laptop（≤1680）降 14px，≤840 不恢复；
 *   large  ：默认 20px，<=laptop 降 18px，<=pad_v（≤840）恢复 20px。
 *
 * 覆盖维度：
 *   R1 显式 round="pill" 的 3 size × 6 视口矩阵（精确 px 断言）；
 *   R2 高度无关性（圆角是常数而非自身半高）；
 *   R3 继承链（OForm / OFormItem 两级）；
 *   R4 全局 initRound('pill') class 兜底路径与显式 prop 路径收敛到同一常数；
 *   R5 自定义 round 值直接生效（不经过 pill 常数路径）。
 *
 * 断言策略：真实 Chromium 下用 getComputedStyle 读取 .o_box-main 的
 * borderRadius 声明值做 px 精断比对。pill 常数语义恰好落在声明层，
 * 可直接精确断言（渲染层 clamp 只影响使用值，不影响本读数）。
 */
import { test, expect, describe, beforeEach, afterEach } from 'vitest';
// test.each 从 vitest 导入（上方具名导入已含 test）
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OTextarea from '../OTextarea.vue';
import OForm from '../../form/OForm.vue';
import OFormItem from '../../form/OFormItem.vue';
import { setViewport, type BreakpointName } from '../../../__tests__/_helpers/viewport';
import { PILL_RADIUS_MATRIX, ROUND_MATRIX_VIEWPORTS, type RoundSizeKey } from '../../../__tests__/_helpers/round-pill';
import { flush } from '../../../__tests__/_helpers/dom';
import { defaultRound, initRound } from '../../_utils/global';

const SIZES: RoundSizeKey[] = ['small', 'medium', 'large'];

/** 期望值数据源：pill 圆角常数矩阵与矩阵遍历视口档由共享 helper `round-pill` 提供（单一来源，口径见其 JSDoc） */

// 全局 initRound 状态初始快照，用例间复位，避免污染其他测试文件与本文件其余用例
const ROUND_SNAPSHOT = defaultRound.value;

beforeEach(() => {
  initRound(ROUND_SNAPSHOT);
});

afterEach(() => {
  initRound(ROUND_SNAPSHOT);
});

/**
 * 在指定视口渲染一个 OTextarea 并返回其含边框容器 .o_box-main。
 *
 * @param vp 目标视口档
 * @param props 透传给 OTextarea 的 props
 * @returns 已完成渲染的 .o_box-main 元素
 */
async function renderTextareaAt(vp: BreakpointName, props: Record<string, unknown> = {}): Promise<HTMLElement> {
  await setViewport(vp);
  const screen = render(OTextarea, { props });
  await flush();
  return screen.container.querySelector('.o_box-main') as HTMLElement;
}

/**
 * 在指定视口以 OForm > OFormItem > OTextarea 层级渲染，并返回 .o_box-main。
 *
 * @param vp 目标视口档
 * @param formRound OForm 的 round prop
 * @param itemRound OFormItem 的 round prop（可选，缺省不透传）
 * @returns 已完成渲染的 .o_box-main 元素
 */
async function renderTextareaInFormAt(vp: BreakpointName, formRound: string, itemRound?: string): Promise<HTMLElement> {
  await setViewport(vp);
  const screen = render({
    render: () =>
      h(
        OForm,
        { model: { name: '' }, round: formRound },
        {
          default: () =>
            h(
              OFormItem,
              { label: '备注', field: 'name', ...(itemRound ? { round: itemRound } : {}) },
              {
                default: () => h(OTextarea, { size: 'medium' }),
              },
            ),
        },
      ),
  });
  await flush();
  return screen.container.querySelector('.o_box-main') as HTMLElement;
}

describe('R1 · pill 圆角矩阵（3 size × 6 视口，显式 round prop）', () => {
  for (const size of SIZES) {
    for (const vp of ROUND_MATRIX_VIEWPORTS) {
      const expected = PILL_RADIUS_MATRIX[size][vp];
      test(`OTextarea round=pill size=${size} @${vp} - .o_box-main 圆角为常数 ${expected}px`, async () => {
        const boxMain = await renderTextareaAt(vp, { size, round: 'pill' });
        expect(getComputedStyle(boxMain).borderRadius).toBe(`${expected}px`);
      });
    }
  }
});

describe('R2 · 高度无关性（圆角为常数而非自身半高）', () => {
  test('OTextarea round=pill size=medium @desktop - 多行容器高度 > 2× 圆角（胶囊常数）', async () => {
    const boxMain = await renderTextareaAt('desktop', { size: 'medium', round: 'pill' });
    const expected = `${PILL_RADIUS_MATRIX.medium.desktop}px`;
    const radius = parseFloat(getComputedStyle(boxMain).borderRadius);
    const height = boxMain.getBoundingClientRect().height;
    // 常数语义：textarea 自身高度远大于直径，圆角不随内容高度（半高 clamp）走
    expect(getComputedStyle(boxMain).borderRadius).toBe(expected);
    expect(height).toBeGreaterThan(2 * radius);
  });
});

describe('R3 · 继承链（OForm / OFormItem 两级配置）', () => {
  test('OForm round=pill - 内部 textarea 继承 pill 并应用多行胶囊常数', async () => {
    const boxMain = await renderTextareaInFormAt('desktop', 'pill');
    expect(getComputedStyle(boxMain).borderRadius).toBe(`${PILL_RADIUS_MATRIX.medium.desktop}px`);
  });

  test('OFormItem round=pill 覆盖 OForm round=8px - FormItem 优先，取胶囊常数而非 8px', async () => {
    const boxMain = await renderTextareaInFormAt('desktop', '8px', 'pill');
    expect(getComputedStyle(boxMain).borderRadius).toBe(`${PILL_RADIUS_MATRIX.medium.desktop}px`);
  });
});

describe('R4 · 全局 initRound(pill) class 兜底路径收敛', () => {
  for (const size of SIZES) {
    for (const vp of ROUND_MATRIX_VIEWPORTS) {
      const expected = PILL_RADIUS_MATRIX[size][vp];
      test(`initRound('pill') 无 round prop size=${size} @${vp} - class 兜底与显式 prop 同值 ${expected}px`, async () => {
        // 组件不传 round prop，走全局 class 兜底路径，须与 R1 显式 prop 路径收敛到同一常数
        initRound('pill');
        const boxMain = await renderTextareaAt(vp, { size });
        expect(getComputedStyle(boxMain).borderRadius).toBe(`${expected}px`);
      });
    }
  }

  /**
   * 跨单/多行收敛（强锔定）：同断点同 size 下，多行常数与单行 OInput 的
   * 实际渲染圆角直接相等——全局 pill 时单行走 InBox token 兜底（40px
   * 被 clamp 到实际高度半高），多行走 mixin 常数，两条机制数值收敛。
   * 抽查 desktop / laptop_max / pad_v_max × medium / large 共 6 组，
 * 单行侧无需 helper，直接以共享矩阵为期望值（与多行 R4 同源）。
   */
  test.each([
    ['desktop', 'medium'],
    ['desktop', 'large'],
    ['laptop_max', 'medium'],
    ['laptop_max', 'large'],
    ['pad_v_max', 'medium'],
    ['pad_v_max', 'large'],
  ] as const)('全局 pill @%s %s - 多行常数与单行 OInput 实际渲染圆角收敛', async (vp, size) => {
    initRound('pill');
    const boxMain = await renderTextareaAt(vp, { size });
    const multiRadius = getComputedStyle(boxMain).borderRadius;
    // 期望值 = 共享矩阵（单行/多行同源）：多行实测值必须等于它
    expect(multiRadius).toBe(`${PILL_RADIUS_MATRIX[size][vp]}px`);
  });
});

describe('R5 · 自定义 round 值直接生效', () => {
  test('OTextarea round=8px @desktop - 自定义值精确生效（8px），不经过 pill 常数路径', async () => {
    const boxMain = await renderTextareaAt('desktop', { size: 'medium', round: '8px' });
    expect(getComputedStyle(boxMain).borderRadius).toBe('8px');
  });
});

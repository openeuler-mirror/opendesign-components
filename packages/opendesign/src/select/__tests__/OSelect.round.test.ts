/**
 * OSelect round 圆角语义测试（spec：多行输入控件的 pill 圆角语义调整 — Testing 文件 C）。
 *
 * 验证目标：OSelect 的 border-radius 落在 `.o-select` 根元素
 * （`border-radius: var(--select-radius)`）。pill 在 OSelect 上的语义为
 * "同 size 单行 pill OInput 的圆角常数"（预定义常数，不随内容高度增长），
 * 随 size 与断点取值（断点口径镜像 OInput：<=laptop=1680、<=pad_v=840，含等号）：
 *   small  ：全断点 12px；
 *   medium ：默认 16px，<=laptop 降 14px，<=840 不恢复；
 *   large  ：默认 20px，<=laptop 降 18px，<=pad_v 恢复 20px。
 *
 * 覆盖维度：
 *   R1 · pill 矩阵（3 size × 6 视口，单选与 multiple 双跑——全模式同待遇防回归护栏）；
 *   R2 · 多选长高不变性（5 个选中项撑过 --select-multiple-max-height 后圆角仍为常数）；
 *   R3 · OForm round="pill" 继承链；
 *   R4 · 全局 initRound('pill') class 兜底路径（与显式 prop 路径收敛到同一矩阵值）；
 *   R5 · 自定义值 round="8px" 直接生效（防回归，现状即绿）；
 *   R6 · cascader v1 透传（OCascader 纯包装 OSelect，round 透传到内部 .o-select）。
 *
 */
import { test, expect, describe, afterEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, reactive, ref } from 'vue';
import OSelect from '../OSelect.vue';
import OCascader from '../../cascader/OCascader.vue';
import OForm from '../../form/OForm.vue';
import OFormItem from '../../form/OFormItem.vue';
import { flush } from '../../../__tests__/_helpers/dom';
import { setViewport } from '../../../__tests__/_helpers/viewport';
import { PILL_RADIUS_MATRIX, ROUND_MATRIX_VIEWPORTS, expectRadiusCornersPx, type RoundSizeKey } from '../../../__tests__/_helpers/round-pill';
import { initRound } from '../../_utils/global';

/**
 * 下拉选项数据（multiple 场景复用，参考 OSelect.multipleInput.test.ts 的数据写法）。
 */
const OPTIONS = [
  { label: 'Apple', value: 'a' },
  { label: 'Banana', value: 'b' },
  { label: 'Cherry', value: 'c' },
  { label: 'Durian', value: 'd' },
  { label: 'Elderberry', value: 'e' },
];

/**
 * cascader v1 透传用例的级联选项数据（两级结构，单选模式）。
 */
const CASCADE_OPTIONS = [
  { value: 'a', label: 'Guide', children: [{ value: 'a1', label: 'Principles' }] },
  { value: 'b', label: 'Components', children: [{ value: 'b1', label: 'Form' }] },
];

/** 期望值数据源：pill 圆角期望矩阵与矩阵遍历视口档由共享 helper `round-pill` 提供（单一来源，口径见其 JSDoc） */

/**
 * 渲染 OSelect 并返回其根元素（`.o-select`，border-radius 所在元素）。
 *
 * @param props - 传给 OSelect 的 props（自动附带 options 数据）
 * @returns `.o-select` 根元素
 */
const renderSelect = async (props: Record<string, unknown>) => {
  const screen = render(OSelect, { props: { options: OPTIONS, ...props } });
  await flush();
  return screen.container.querySelector('.o-select') as HTMLElement;
};

/**
 * 断言元素四角圆角为精确 px 值（computedStyle 声明值口径）。
 *
 * @param el - 目标元素
 * @param expectedPx - 期望圆角值（px 数值）
 */

// ============================================================================
// R1 · pill 圆角矩阵（单选与 multiple 双跑）
// ============================================================================

/**
 * 单选与 multiple 各跑一遍完整矩阵（3 size × 6 视口）：
 * 用户决策为"全模式同待遇"，双跑防止后续实现按模式隔离圆角语义。
 */
for (const mode of ['single', 'multiple'] as const) {
  describe(`R1 · pill 圆角矩阵（${mode === 'single' ? '单选' : 'multiple 多选'}）`, () => {
    for (const bp of ROUND_MATRIX_VIEWPORTS) {
      for (const size of ['small', 'medium', 'large'] as RoundSizeKey[]) {
        test(`OSelect round=pill ${mode} @${bp} size=${size} - 四角圆角 ${PILL_RADIUS_MATRIX[size][bp]}px`, async () => {
          await setViewport(bp);
          // multiple 场景带 1 个选中项，确保走 tags 渲染分支（多行形态入口）
          const el = await renderSelect({
            round: 'pill',
            size,
            ...(mode === 'multiple' ? { multiple: true, modelValue: ['a'] } : {}),
          });
          expectRadiusCornersPx(el, PILL_RADIUS_MATRIX[size][bp], `OSelect round=pill size=${size} @${bp}`);
        });
      }
    }
  });
}

// ============================================================================
// R2 · 多选长高不变性
// ============================================================================

describe('R2 · 多选长高不变性', () => {
  test('OSelect multiple round=pill @desktop size=medium - 5 个选中项撑高后圆角仍为 16px', async () => {
    await setViewport('desktop');
    const el = await renderSelect({
      round: 'pill',
      size: 'medium',
      multiple: true,
      modelValue: ['a', 'b', 'c', 'd', 'e'],
    });
    // 窄宽度促使标签换行，撑过多行最大高度（--select-multiple-max-height）
    el.style.width = '180px';
    await flush();
    // 护栏：5 个标签全部渲染，且控件高度超过单行高度（medium 单行 32px），证明已进入多行形态
    expect(el.querySelectorAll('.o-select-tag').length).toBe(5);
    expect(el.getBoundingClientRect().height).toBeGreaterThan(40);
    expectRadiusCornersPx(el, PILL_RADIUS_MATRIX.medium.desktop, 'OSelect medium @desktop');
  });
});

// ============================================================================
// R3 · OForm 继承链
// ============================================================================

describe('R3 · OForm 继承链', () => {
  test('OForm round=pill 内的 OSelect @desktop size=medium - 四角圆角 16px', async () => {
    await setViewport('desktop');
    const model = reactive<{ field?: string }>({});
    const screen = render({
      render: () =>
        h(
          OForm,
          { round: 'pill', model },
          {
            default: () =>
              h(
                OFormItem,
                { label: '选择', field: 'field' },
                {
                  default: () =>
                    h(OSelect, {
                      size: 'medium',
                      options: OPTIONS,
                      modelValue: model.field,
                      'onUpdate:modelValue': (v: string) => {
                        model.field = v;
                      },
                    }),
                },
              ),
          },
        ),
    });
    await flush();
    const el = screen.container.querySelector('.o-select') as HTMLElement;
    expectRadiusCornersPx(el, PILL_RADIUS_MATRIX.medium.desktop, 'OSelect medium @desktop');
  });
});

// ============================================================================
// R4 · 全局 initRound('pill') class 兜底路径
// ============================================================================

describe('R4 · 全局 initRound(pill) class 兜底路径', () => {
  // 用例间复位全局圆角配置，避免污染其他用例（无 prop 时才走 class 兜底）
  afterEach(() => {
    initRound(undefined);
  });

  for (const bp of ROUND_MATRIX_VIEWPORTS) {
    for (const size of ['small', 'medium', 'large'] as RoundSizeKey[]) {
      test(`OSelect 无 round prop + initRound(pill) @${bp} size=${size} - 四角圆角 ${PILL_RADIUS_MATRIX[size][bp]}px`, async () => {
        await setViewport(bp);
        initRound('pill');
        const el = await renderSelect({ size });
        // class 兜底路径须与显式 prop 路径收敛到同一矩阵值
        expectRadiusCornersPx(el, PILL_RADIUS_MATRIX[size][bp], `OSelect round=pill size=${size} @${bp}`);
      });
    }
  }
});

// ============================================================================
// R5 · 自定义值（现状即绿，防回归）
// ============================================================================

describe('R5 · 自定义圆角值', () => {
  test('OSelect round=8px @desktop - 四角圆角 8px（自定义值直接生效）', async () => {
    await setViewport('desktop');
    const el = await renderSelect({ round: '8px', size: 'medium' });
    expectRadiusCornersPx(el, 8, 'OSelect round=8px');
  });
});

// ============================================================================
// R6 · cascader v1 透传
// ============================================================================

describe('R6 · cascader v1 透传', () => {
  test('OCascader round=pill @desktop size=medium - 内部 .o-select 四角圆角 16px', async () => {
    await setViewport('desktop');
    // cascader v1 纯包装 OSelect 并透传 round，单选模式（modelValue 取叶子节点值）；
    // size 须显式传 medium：cascader v1 的 size prop 默认 large
    const screen = render(OCascader, {
      props: { round: 'pill', size: 'medium', modelValue: 'a1', options: CASCADE_OPTIONS },
    });
    await flush();
    const el = screen.container.querySelector('.o-select') as HTMLElement;
    expect(el).not.toBeNull();
    expectRadiusCornersPx(el, PILL_RADIUS_MATRIX.medium.desktop, 'OSelect medium @desktop');
  });
});

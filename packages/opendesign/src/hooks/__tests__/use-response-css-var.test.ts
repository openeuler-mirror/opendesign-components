/**
 * useResponseCssVar 响应式 CSS 变量钩子测试。
 *
 * 测试不依赖任何组件样式产物（dist），用测试内注入的媒体查询样式驱动变量变化，
 * 直接验证钩子的三个契约：
 *
 *   ① 初始读取：目标元素挂载后立即读到 computed 值（含媒体查询结果）；
 *   ② 视口折返恢复：断点间往返（>pad_v ↔ ≤pad_v）后，值始终跟随媒体查询；
 *   ③ 只读语义：任何时机都不向目标元素写回内联 CSS 变量
 *      （内联值会覆盖媒体查询的级联结果，导致变量被"钉死"在断点值，见 issue #216）。
 *
 * 不归属本文件的维度：
 *   - OTab 组件级断点行为 → tab/__tests__/OTab.index.test.ts
 */
import { test, expect, describe, beforeAll } from 'vitest';
import { render } from 'vitest-browser-vue';
import { defineComponent, h, ref } from 'vue';
import { useResponseCssVar } from '../use-response-css-var';
import { setViewport } from '../../../__tests__/_helpers/viewport';
import { flush, waitFor } from '../../../__tests__/_helpers/dom';

/** 被测 CSS 变量：>pad_v 为 8px，≤pad_v（840px）为 48px，模拟 OTab 省略号阴影变量 */
const TEST_VAR = '--test-responsive-var';

/** 断点切换时变量变化的期望值，与下方注入样式一一对应 */
const EXPECTED = { wide: '8', narrow: '48' } as const;

/** 测试宿主：变量声明在宿主根元素上，钩子从其子元素读取（复刻 OTab 的变量层级） */
const VarHost = defineComponent({
  setup() {
    const targetRef = ref<HTMLElement>();
    const value = useResponseCssVar(TEST_VAR, targetRef, {
      initialValue: '8px',
      transform: (v: string) => Number.parseInt(v),
    });
    return () => h('div', { class: 'uv-host' }, [h('div', { class: 'uv-target', ref: targetRef, 'data-value': String(value.value) })]);
  },
});

/** 读取目标元素上钩子当前值（经 transform 后的数字字符串） */
function readHookValue(container: HTMLElement): string {
  return container.querySelector<HTMLElement>('.uv-target')!.dataset.value!;
}

/** 读取目标元素上被写回的内联变量值（只读语义下应恒为空） */
function readInlineVar(container: HTMLElement): string {
  return container.querySelector<HTMLElement>('.uv-target')!.style.getPropertyValue(TEST_VAR);
}

beforeAll(() => {
  // 注入测试样式：媒体查询驱动的变量值变化，不依赖组件构建产物
  const style = document.createElement('style');
  style.textContent = `
    .uv-host { ${TEST_VAR}: 8px; }
    @media (max-width: 840px) {
      .uv-host { ${TEST_VAR}: 48px; }
    }
  `;
  document.head.appendChild(style);
});

describe('初始读取', () => {
  test('挂载于 ≤pad_v 视口时，初始读取即得到断点值 48px', async () => {
    await setViewport('pad_v');
    const screen = render(VarHost);
    await flush();
    expect(readHookValue(screen.container)).toBe(EXPECTED.narrow);
  });

  test('挂载于 >pad_v 视口时，初始读取得到默认值 8px', async () => {
    await setViewport('laptop');
    const screen = render(VarHost);
    await flush();
    expect(readHookValue(screen.container)).toBe(EXPECTED.wide);
  });
});

describe('视口折返', () => {
  test('断点往返（laptop → pad_v → laptop）后，值恢复为 8px 且不残留内联变量', async () => {
    await setViewport('laptop');
    const screen = render(VarHost);
    await flush();
    expect(readHookValue(screen.container)).toBe(EXPECTED.wide);

    // 缩窄进入断点：防抖（100ms）后应读到 48px
    await setViewport('pad_v');
    await waitFor(() => readHookValue(screen.container) === EXPECTED.narrow);
    expect(readHookValue(screen.container)).toBe(EXPECTED.narrow);

    // 拉回宽屏：防抖后应恢复 8px，且全程不允许向目标元素写回内联变量
    await setViewport('laptop');
    await waitFor(() => readHookValue(screen.container) === EXPECTED.wide);
    expect(readHookValue(screen.container)).toBe(EXPECTED.wide);
    expect(readInlineVar(screen.container)).toBe('');
  });

  test('断点内多次 resize 不产生内联变量', async () => {
    await setViewport('pad_v');
    const screen = render(VarHost);
    await waitFor(() => readHookValue(screen.container) === EXPECTED.narrow);

    // 断点内宽度变化（resize 事件触发防抖重读，值不变）
    window.dispatchEvent(new Event('resize'));
    await waitFor(() => readHookValue(screen.container) === EXPECTED.narrow);
    expect(readInlineVar(screen.container)).toBe('');
  });
});

describe('回退与转换', () => {
  test('变量未定义时回落到 initialValue', async () => {
    const NoVarHost = defineComponent({
      setup() {
        const targetRef = ref<HTMLElement>();
        const value = useResponseCssVar('--test-undefined-var', targetRef, { initialValue: '8px' });
        return () => h('div', [h('div', { class: 'uv-target', ref: targetRef, 'data-value': value.value })]);
      },
    });
    const screen = render(NoVarHost);
    await flush();
    expect(readHookValue(screen.container)).toBe('8px');
  });
});

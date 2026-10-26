/**
 * OSlider 单组件契约测试。
 *
 * 本文件重点验证「unit 插槽」——即 useSlots → defineSlots 重构后
 * hasUnit computed 和 unit slot 渲染是否仍正确工作。
 *
 * 组织原则：
 *   1. 静态契约：按 types.ts prop 顺序
 *   2. 插槽契约：unit 插槽渲染
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OSlider from '../OSlider.vue';
import { flush } from '../../../__tests__/_helpers/dom';

describe('静态契约（按 types.ts 属性）', () => {
  test('OSlider 根元素 class 包含 o-slider', async () => {
    const screen = render(OSlider);
    await flush();
    expect(screen.container.querySelector('.o-slider')).not.toBeNull();
  });

  test('OSlider modelValue - 渲染滑块按钮，默认 0', async () => {
    const screen = render(OSlider);
    await flush();
    const btn = screen.container.querySelector('.o-slider-btn');
    expect(btn).not.toBeNull();
  });

  test('OSlider min - 不影响渲染', async () => {
    const screen = render(OSlider, { props: { min: 10 } });
    await flush();
    expect(screen.container.querySelector('.o-slider')).not.toBeNull();
  });

  test('OSlider max - 不影响渲染', async () => {
    const screen = render(OSlider, { props: { max: 200 } });
    await flush();
    expect(screen.container.querySelector('.o-slider')).not.toBeNull();
  });

  test('OSlider step - 不影响渲染', async () => {
    const screen = render(OSlider, { props: { step: 5 } });
    await flush();
    expect(screen.container.querySelector('.o-slider')).not.toBeNull();
  });

  test('OSlider disabled - 注入 o-slider-disabled 类', async () => {
    const screen = render(OSlider, { props: { disabled: true } });
    await flush();
    expect((screen.container.querySelector('.o-slider') as HTMLElement).classList.contains('o-slider-disabled')).toBe(true);
  });

  test('OSlider showInput - 注入 o-slider-with-input 类且渲染 OInputNumber', async () => {
    const screen = render(OSlider, { props: { showInput: true } });
    await flush();
    const el = screen.container.querySelector('.o-slider') as HTMLElement;
    expect(el.classList.contains('o-slider-with-input')).toBe(true);
    expect(screen.container.querySelector('.o-slider-input-wrap')).not.toBeNull();
  });

  test('OSlider showStops - 注入 o-slider-with-stops 类且渲染间隔点', async () => {
    const screen = render(OSlider, { props: { showStops: true } });
    await flush();
    const el = screen.container.querySelector('.o-slider') as HTMLElement;
    expect(el.classList.contains('o-slider-with-stops')).toBe(true);
    expect(screen.container.querySelector('.o-slider-stop')).not.toBeNull();
  });

  test('OSlider range - 渲染两个滑块按钮', async () => {
    const screen = render(OSlider, { props: { range: true, modelValue: [20, 80] } });
    await flush();
    const buttons = screen.container.querySelectorAll('.o-slider-btn');
    expect(buttons.length).toBe(2);
  });

  test('OSlider direction=v - 注入 o-slider-vertical 类', async () => {
    const screen = render(OSlider, { props: { direction: 'v' } });
    await flush();
    expect((screen.container.querySelector('.o-slider') as HTMLElement).classList.contains('o-slider-vertical')).toBe(true);
  });

  test('OSlider unit prop - showInput 时渲染 unit 文本', async () => {
    const screen = render(OSlider, { props: { showInput: true, unit: 'px' } });
    await flush();
    const unitEl = screen.container.querySelector('.o-slider-input-unit');
    expect(unitEl).not.toBeNull();
    expect(unitEl?.textContent).toContain('px');
  });
});

// ============================================================================
// 插槽契约：验证 useSlots → defineSlots 重构后 unit 插槽渲染不受影响
// ============================================================================

describe('插槽契约（具名插槽）', () => {
  test('OSlider slot=unit - showInput 时渲染自定义 unit slot 内容', async () => {
    const screen = render(OSlider, {
      props: { showInput: true },
      slots: {
        unit: () => h('span', { class: 'custom-unit' }, '单位'),
      },
    });
    await flush();
    const unitWrap = screen.container.querySelector('.o-slider-input-unit');
    expect(unitWrap).not.toBeNull();
    expect(unitWrap?.querySelector('.custom-unit')?.textContent).toBe('单位');
  });

  test('OSlider slot=unit - 有 unit slot 时 hasUnit 为 true 且渲染 .o-slider-input-unit', async () => {
    const screen = render(OSlider, {
      props: { showInput: true },
      slots: {
        unit: () => '自定义单位',
      },
    });
    await flush();
    expect(screen.container.querySelector('.o-slider-input-unit')).not.toBeNull();
  });

  test('OSlider - 无 unit slot 且无 unit prop 时不渲染 .o-slider-input-unit', async () => {
    const screen = render(OSlider, { props: { showInput: true } });
    await flush();
    expect(screen.container.querySelector('.o-slider-input-unit')).toBeNull();
  });

  test('OSlider slot=unit - unit slot 优先于 unit prop 渲染', async () => {
    const screen = render(OSlider, {
      props: { showInput: true, unit: 'fallback' },
      slots: {
        unit: () => h('span', { class: 'slot-unit' }, 'slot'),
      },
    });
    await flush();
    const unitWrap = screen.container.querySelector('.o-slider-input-unit');
    expect(unitWrap?.querySelector('.slot-unit')).not.toBeNull();
    expect(unitWrap?.textContent).toContain('slot');
    expect(unitWrap?.textContent).not.toContain('fallback');
  });
});

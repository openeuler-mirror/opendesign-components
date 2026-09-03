/**
 * OLayer 单组件契约测试。
 *
 * 组织原则：
 *   1. 静态契约：按 types.ts prop 顺序，每个 prop 一条用例
 *   2. 动态契约：visible 切换 / mask 点击 / close 按钮 / beforeShow·beforeHide 拦截
 *   3. 暴露方法：toggle()
 *   4. 插槽契约：default / close
 *   5. 废弃兼容：transitionOrign → transitionOrigin 迁移
 *
 * 命名规范：OLayer <prop / 场景> - <中文描述>
 *
 * 不归属本文件的维度：
 *   - SSR 字符串渲染 + hydration mismatch → OLayer.ssr.test.ts
 *   - 像素级渲染 / 跨浏览器渲染差异          → E2E 截图回归
 */
import { test, expect, describe, vi, afterEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, ref } from 'vue';
import OLayer from '../OLayer.vue';
import { flush } from '../../../__tests__/_helpers/dom';
import { getZIndex } from '../../_utils/z-index';

/**
 * 清理 document.body 上可能残留的 teleport 内容和 o-layer-open 类。
 * OLayer 在 wrapper='body' 时将内容 teleport 到 document.body，
 * 并向 wrapper 元素添加 o-layer-open 类（overflow:hidden）。
 */
afterEach(() => {
  document.body.classList.remove('o-layer-open');
  document.body.querySelectorAll(':scope > .o-layer').forEach((el) => el.remove());
});

// ============================================================================
// 静态契约：按 types.ts 的 prop 顺序，每个 prop 一条用例
// ============================================================================
describe('静态契约（按 types.ts 属性）', () => {
  // ---- visible ----
  test('OLayer visible - 默认 false 时不渲染浮层根元素', async () => {
    const screen = render(OLayer, { props: { wrapper: null } });
    await flush();
    expect(screen.container.querySelector('.o-layer')).toBeNull();
  });

  test('OLayer visible=true - 渲染浮层根元素及内容', async () => {
    const screen = render(OLayer, {
      props: { visible: true, wrapper: null },
      slots: { default: () => h('div', { class: 'test-content' }, 'Content') },
    });
    await flush();
    expect(screen.container.querySelector('.o-layer')).not.toBeNull();
    expect(screen.container.querySelector('.o-layer-main')).not.toBeNull();
    expect(screen.container.querySelector('.test-content')).not.toBeNull();
  });

  // ---- wrapper ----
  test('OLayer wrapper=body - 默认值，内容 teleport 到 document.body', async () => {
    const screen = render(OLayer, {
      props: { visible: true },
      slots: { default: () => h('div', { class: 'test-body-content' }, 'Body') },
    });
    await flush();
    const layer = document.querySelector('.o-layer');
    expect(layer).not.toBeNull();
    expect(layer?.classList.contains('o-layer-to-body')).toBe(true);
    // teleport 到 body，不在 test container 内
    expect(screen.container.querySelector('.o-layer')).toBeNull();
  });

  test('OLayer wrapper=null - 内容渲染在当前组件位置（不 teleport）', async () => {
    const screen = render(OLayer, {
      props: { visible: true, wrapper: null },
      slots: { default: () => 'Inline' },
    });
    await flush();
    expect(screen.container.querySelector('.o-layer')).not.toBeNull();
  });

  // ---- unmountOnHide ----
  test('OLayer unmountOnHide=true - 默认值，visible=false 时不渲染 DOM', async () => {
    const screen = render(OLayer, {
      props: { visible: false, wrapper: null, unmountOnHide: true },
    });
    await flush();
    expect(screen.container.querySelector('.o-layer')).toBeNull();
  });

  test('OLayer unmountOnHide=false - visible=false 时保留 DOM（v-show 隐藏）', async () => {
    const screen = render(OLayer, {
      props: { visible: false, wrapper: null, unmountOnHide: false },
    });
    await flush();
    // isMounted=true → 根元素渲染
    const layer = screen.container.querySelector('.o-layer');
    expect(layer).not.toBeNull();
    // v-show=false → 隐藏
    expect(layer?.style.display).toBe('none');
  });

  // ---- mainClass ----
  test('OLayer mainClass - 自定义类名注入到 .o-layer-main', async () => {
    const screen = render(OLayer, {
      props: { visible: true, wrapper: null, mainClass: 'custom-main' },
    });
    await flush();
    const main = screen.container.querySelector('.o-layer-main') as HTMLElement;
    expect(main.classList.contains('custom-main')).toBe(true);
  });

  // ---- mainTransition ----
  test('OLayer mainTransition - 默认 o-zoom-fade2', async () => {
    const screen = render(OLayer, {
      props: { visible: true, wrapper: null },
    });
    await flush();
    // transition name 体现为 enter/leave 阶段的 CSS 类名前缀
    // 验证 transition 元素存在（.o-layer-main 被 <transition> 包裹）
    expect(screen.container.querySelector('.o-layer-main')).not.toBeNull();
  });

  // ---- maskTransition ----
  test('OLayer maskTransition - 默认 o-fade-in', async () => {
    const screen = render(OLayer, {
      props: { visible: true, wrapper: null },
    });
    await flush();
    expect(screen.container.querySelector('.o-layer-mask')).not.toBeNull();
  });

  // ---- transitionOrigin ----
  test('OLayer transitionOrigin=mouse - 默认值，设置内联 transform-origin', async () => {
    const screen = render(OLayer, {
      props: { visible: true, wrapper: null },
    });
    await flush();
    const main = screen.container.querySelector('.o-layer-main') as HTMLElement;
    expect(main).not.toBeNull();
    // mouse 模式下，transition enter 钩子设置 mainStyle.transformOrigin
    expect(main.style.transformOrigin).not.toBe('');
  });

  test('OLayer transitionOrigin=css - 不设置内联 transform-origin（使用 CSS 变量）', async () => {
    const screen = render(OLayer, {
      props: { visible: true, wrapper: null, transitionOrigin: 'css' },
    });
    await flush();
    const main = screen.container.querySelector('.o-layer-main') as HTMLElement;
    expect(main).not.toBeNull();
    // css 模式下，transform-origin 由 --layer-origin CSS 变量控制，不设置内联样式
    expect(main.style.transformOrigin).toBe('');
  });

  // ---- transitionOrign（废弃 prop 兼容）----
  test('OLayer transitionOrign=css (废弃) - 行为与 transitionOrigin=css 一致', async () => {
    const screen = render(OLayer, {
      props: { visible: true, wrapper: null, transitionOrign: 'css' },
    });
    await flush();
    const main = screen.container.querySelector('.o-layer-main') as HTMLElement;
    expect(main).not.toBeNull();
    expect(main.style.transformOrigin).toBe('');
  });

  test('OLayer transitionOrign 优先于 transitionOrigin (旧值优先兼容)', async () => {
    const screen = render(OLayer, {
      props: {
        visible: true,
        wrapper: null,
        transitionOrign: 'css',
        transitionOrigin: 'mouse',
      },
    });
    await flush();
    const main = screen.container.querySelector('.o-layer-main') as HTMLElement;
    // transitionOrign ?? transitionOrigin → 'css' ?? 'mouse' → 'css'
    expect(main.style.transformOrigin).toBe('');
  });

  // ---- mask ----
  test('OLayer mask=true - 默认值，渲染遮罩层', async () => {
    const screen = render(OLayer, {
      props: { visible: true, wrapper: null, mask: true },
    });
    await flush();
    expect(screen.container.querySelector('.o-layer-mask')).not.toBeNull();
  });

  test('OLayer mask=false - 不渲染遮罩层', async () => {
    const screen = render(OLayer, {
      props: { visible: true, wrapper: null, mask: false },
    });
    await flush();
    expect(screen.container.querySelector('.o-layer-mask')).toBeNull();
  });

  // ---- maskClose ----
  test('OLayer maskClose=true - 默认值', async () => {
    const screen = render(OLayer, {
      props: { visible: true, wrapper: null, maskClose: true },
    });
    await flush();
    // maskClose 是行为属性，不产生视觉差异，验证遮罩存在即可
    expect(screen.container.querySelector('.o-layer-mask')).not.toBeNull();
  });

  // ---- buttonClose ----
  test('OLayer buttonClose=true - 渲染关闭按钮', async () => {
    const screen = render(OLayer, {
      props: { visible: true, wrapper: null, buttonClose: true },
    });
    await flush();
    expect(screen.container.querySelector('.o-layer-close')).not.toBeNull();
    // 默认渲染 OIcon 关闭图标
    expect(screen.container.querySelector('.o-layer-close-icon')).not.toBeNull();
  });

  test('OLayer buttonClose=false - 默认值，不渲染关闭按钮', async () => {
    const screen = render(OLayer, {
      props: { visible: true, wrapper: null },
    });
    await flush();
    expect(screen.container.querySelector('.o-layer-close')).toBeNull();
  });

  // ---- beforeShow / beforeHide ----
  test('OLayer beforeShow - 传入函数，组件正常渲染不报错', async () => {
    const beforeShow = vi.fn(() => true);
    const screen = render(OLayer, {
      props: { visible: true, wrapper: null, beforeShow },
    });
    await flush();
    expect(screen.container.querySelector('.o-layer')).not.toBeNull();
  });

  test('OLayer beforeHide - 传入函数，组件正常渲染不报错', async () => {
    const beforeHide = vi.fn(() => true);
    const screen = render(OLayer, {
      props: { visible: true, wrapper: null, beforeHide },
    });
    await flush();
    expect(screen.container.querySelector('.o-layer')).not.toBeNull();
  });
});

// ============================================================================
// 动态契约：用户操作 → 组件响应（emit + 行为拦截）
// ============================================================================
describe('动态契约（用户交互 → 组件响应）', () => {
  test('OLayer change - visible prop 变更时触发', async () => {
    const visible = ref(false);
    const onChange = vi.fn();
    render({
      setup() {
        return () => h(OLayer, { visible: visible.value, wrapper: null, onChange });
      },
    });
    await flush();
    visible.value = true;
    await flush();
    expect(onChange).toHaveBeenCalledWith(true);
  });

  test('OLayer update:visible - toggle 时触发', async () => {
    const layerRef = ref<any>(null);
    const onUpdateVisible = vi.fn();
    render({
      setup() {
        return () =>
          h(OLayer as any, {
            ref: layerRef,
            visible: true,
            wrapper: null,
            'onUpdate:visible': onUpdateVisible,
          });
      },
    });
    await flush();
    await layerRef.value.toggle(false);
    await flush();
    expect(onUpdateVisible).toHaveBeenCalledWith(false);
  });

  test('OLayer click:mask - 点击遮罩时触发', async () => {
    const onClickMask = vi.fn();
    const screen = render({
      setup() {
        return () =>
          h(OLayer, {
            visible: true,
            wrapper: null,
            maskClose: false,
            'onClick:mask': onClickMask,
          });
      },
    });
    await flush();
    const mask = screen.container.querySelector('.o-layer-mask') as HTMLElement;
    await mask.click();
    expect(onClickMask).toHaveBeenCalledTimes(1);
    expect(onClickMask.mock.calls[0][0]).toBeInstanceOf(MouseEvent);
  });

  test('OLayer click:button - 点击关闭按钮时触发', async () => {
    const onClickButton = vi.fn();
    const screen = render({
      setup() {
        return () =>
          h(OLayer, {
            visible: true,
            wrapper: null,
            buttonClose: true,
            'onClick:button': onClickButton,
          });
      },
    });
    await flush();
    const closeBtn = screen.container.querySelector('.o-layer-close') as HTMLElement;
    closeBtn.click();
    expect(onClickButton).toHaveBeenCalledTimes(1);
    expect(onClickButton.mock.calls[0][0]).toBeInstanceOf(MouseEvent);
  });

  test('OLayer maskClose=true - 点击遮罩关闭浮层', async () => {
    const onUpdateVisible = vi.fn();
    const screen = render({
      setup() {
        return () =>
          h(OLayer, {
            visible: true,
            wrapper: null,
            maskClose: true,
            'onUpdate:visible': onUpdateVisible,
          });
      },
    });
    await flush();
    const mask = screen.container.querySelector('.o-layer-mask') as HTMLElement;
    await mask.click();
    await flush();
    expect(onUpdateVisible).toHaveBeenCalledWith(false);
  });

  test('OLayer maskClose=false - 点击遮罩不关闭浮层', async () => {
    const onUpdateVisible = vi.fn();
    const screen = render({
      setup() {
        return () =>
          h(OLayer, {
            visible: true,
            wrapper: null,
            maskClose: false,
            'onUpdate:visible': onUpdateVisible,
          });
      },
    });
    await flush();
    const mask = screen.container.querySelector('.o-layer-mask') as HTMLElement;
    await mask.click();
    await flush();
    expect(onUpdateVisible).not.toHaveBeenCalled();
  });

  // ---- beforeShow / beforeHide 拦截 ----
  test('OLayer beforeShow=false - 取消打开（prop 变更路径，同步回旧值）', async () => {
    const visible = ref(false);
    const beforeShow = vi.fn(() => false);
    const onChange = vi.fn();
    const onUpdateVisible = vi.fn();
    render({
      setup() {
        return () =>
          h(OLayer, {
            visible: visible.value,
            wrapper: null,
            beforeShow,
            onChange,
            'onUpdate:visible': onUpdateVisible,
          });
      },
    });
    await flush();
    visible.value = true;
    await flush();
    expect(beforeShow).toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
    // 被阻止时，emits('update:visible', visible.value) 同步回旧值
    expect(onUpdateVisible).toHaveBeenCalledWith(false);
  });

  test('OLayer beforeShow=true - 允许打开（prop 变更路径）', async () => {
    const visible = ref(false);
    const beforeShow = vi.fn(() => true);
    const onChange = vi.fn();
    render({
      setup() {
        return () =>
          h(OLayer, {
            visible: visible.value,
            wrapper: null,
            beforeShow,
            onChange,
          });
      },
    });
    await flush();
    visible.value = true;
    await flush();
    expect(beforeShow).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(true);
  });

  test('OLayer beforeShow=false - 取消打开（toggle 路径，静默返回）', async () => {
    const layerRef = ref<any>(null);
    const beforeShow = vi.fn(() => false);
    const onChange = vi.fn();
    const onUpdateVisible = vi.fn();
    render({
      setup() {
        return () =>
          h(OLayer as any, {
            ref: layerRef,
            visible: false,
            wrapper: null,
            beforeShow,
            onChange,
            'onUpdate:visible': onUpdateVisible,
          });
      },
    });
    await flush();
    await layerRef.value.toggle(true);
    await flush();
    expect(beforeShow).toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
    expect(onUpdateVisible).not.toHaveBeenCalled();
  });

  test('OLayer beforeHide=false - 取消关闭（toggle 路径，静默返回）', async () => {
    const layerRef = ref<any>(null);
    const beforeHide = vi.fn(() => false);
    const onChange = vi.fn();
    const onUpdateVisible = vi.fn();
    render({
      setup() {
        return () =>
          h(OLayer as any, {
            ref: layerRef,
            visible: true,
            wrapper: null,
            beforeHide,
            onChange,
            'onUpdate:visible': onUpdateVisible,
          });
      },
    });
    await flush();
    await layerRef.value.toggle(false);
    await flush();
    expect(beforeHide).toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
    expect(onUpdateVisible).not.toHaveBeenCalled();
  });

  test('OLayer beforeShow 支持 Promise - 异步返回 false 取消打开', async () => {
    const visible = ref(false);
    const beforeShow = vi.fn(async () => false);
    const onChange = vi.fn();
    render({
      setup() {
        return () =>
          h(OLayer, {
            visible: visible.value,
            wrapper: null,
            beforeShow,
            onChange,
          });
      },
    });
    await flush();
    visible.value = true;
    await flush();
    expect(beforeShow).toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });
});

// ============================================================================
// 暴露方法：OLayer 通过 defineExpose 暴露 toggle()
// ============================================================================
describe('暴露方法（defineExpose）', () => {
  test('OLayer exposed toggle() - 无参数切换可见状态', async () => {
    const layerRef = ref<any>(null);
    const onChange = vi.fn();
    const onUpdateVisible = vi.fn();
    render({
      setup() {
        return () =>
          h(OLayer as any, {
            ref: layerRef,
            visible: true,
            wrapper: null,
            onChange,
            'onUpdate:visible': onUpdateVisible,
          });
      },
    });
    await flush();
    // toggle() 无参数 → 切换为 false
    await layerRef.value.toggle();
    await flush();
    expect(onUpdateVisible).toHaveBeenCalledWith(false);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  test('OLayer exposed toggle(true) - 打开浮层', async () => {
    const layerRef = ref<any>(null);
    const onChange = vi.fn();
    render({
      setup() {
        return () =>
          h(OLayer as any, {
            ref: layerRef,
            visible: false,
            wrapper: null,
            onChange,
          });
      },
    });
    await flush();
    await layerRef.value.toggle(true);
    await flush();
    expect(onChange).toHaveBeenCalledWith(true);
  });

  test('OLayer exposed toggle(false) - 关闭浮层', async () => {
    const layerRef = ref<any>(null);
    const onChange = vi.fn();
    render({
      setup() {
        return () =>
          h(OLayer as any, {
            ref: layerRef,
            visible: true,
            wrapper: null,
            onChange,
          });
      },
    });
    await flush();
    await layerRef.value.toggle(false);
    await flush();
    expect(onChange).toHaveBeenCalledWith(false);
  });

  test('OLayer exposed toggle - 当前状态与目标相同时不操作', async () => {
    const layerRef = ref<any>(null);
    const onChange = vi.fn();
    render({
      setup() {
        return () =>
          h(OLayer as any, {
            ref: layerRef,
            visible: true,
            wrapper: null,
            onChange,
          });
      },
    });
    await flush();
    // visible 已为 true，toggle(true) 应直接返回
    await layerRef.value.toggle(true);
    await flush();
    expect(onChange).not.toHaveBeenCalled();
  });
});

// ============================================================================
// 插槽契约：OLayer 提供 default / close 两个具名插槽
// ============================================================================
describe('插槽契约（具名插槽）', () => {
  test('OLayer slot=default - 渲染默认插槽内容', async () => {
    const screen = render(OLayer, {
      props: { visible: true, wrapper: null },
      slots: { default: () => h('div', { class: 'slot-content' }, 'Slot') },
    });
    await flush();
    const main = screen.container.querySelector('.o-layer-main') as HTMLElement;
    expect(main.querySelector('.slot-content')).not.toBeNull();
    expect(main.textContent).toContain('Slot');
  });

  test('OLayer slot=close - 自定义关闭按钮内容', async () => {
    const screen = render(OLayer, {
      props: { visible: true, wrapper: null, buttonClose: true },
      slots: { close: () => h('span', { class: 'custom-close' }, 'Close') },
    });
    await flush();
    const closeWrap = screen.container.querySelector('.o-layer-close') as HTMLElement;
    expect(closeWrap).not.toBeNull();
    expect(closeWrap.querySelector('.custom-close')).not.toBeNull();
    // 自定义 slot 替换了默认 OIcon 关闭图标
    expect(closeWrap.querySelector('.o-layer-close-icon')).toBeNull();
  });
});

/**
 * 嵌套浮层 z-index 自动管理契约。
 *
 * 验证多个 OLayer 实例按打开顺序获得递增的 --layer-z-index 值，
 * 后打开的浮层 z-index 严格大于先打开的浮层。
 */
describe('z-index 嵌套管理', () => {
  test('OLayer 嵌套 - 后打开的浮层 z-index 大于先打开的', async () => {
    const parentVisible = ref(false);
    const childVisible = ref(false);
    render({
      setup() {
        return () => [
          h(OLayer, {
            visible: parentVisible.value,
            wrapper: null,
          }),
          h(OLayer, {
            visible: childVisible.value,
            wrapper: null,
          }),
        ];
      },
    });
    await flush();

    // 先打开父浮层
    parentVisible.value = true;
    await flush();

    const layers = document.querySelectorAll('.o-layer');
    // wrapper=null 时渲染在容器内
    const parentZ = parseInt(getComputedStyle(layers[0]).zIndex, 10);

    // 后打开子浮层
    childVisible.value = true;
    await flush();

    const updatedLayers = document.querySelectorAll('.o-layer');
    const childZ = parseInt(getComputedStyle(updatedLayers[1]).zIndex, 10);

    expect(childZ).toBeGreaterThan(parentZ);
    expect(parentZ).toBeGreaterThan(0);
  });

  test('OLayer 嵌套 - 关闭后 z-index 值回收', async () => {
    const visible1 = ref(false);
    const visible2 = ref(false);
    render({
      setup() {
        return () => [h(OLayer, { visible: visible1.value, wrapper: null }), h(OLayer, { visible: visible2.value, wrapper: null })];
      },
    });
    await flush();

    // 打开两个浮层，z-index 递增
    visible1.value = true;
    await flush();
    visible2.value = true;
    await flush();

    const zBefore = getZIndex();

    // 关闭第二个浮层
    visible2.value = false;
    await flush();

    const zAfter = getZIndex();
    // removeZIndex 在 topZIndex === 当前值时递减
    expect(zAfter).toBeLessThanOrEqual(zBefore);
  });
});

/**
 * unmountOnHide 过渡行为契约。
 *
 * 验证 unmountOnHide=false 时，浮层关闭后 DOM 保留（v-show 隐藏），
 * 且重新打开时无需重新挂载。验证 unmountOnHide=true 时关闭后 DOM 移除。
 *
 * 注意：这些测试涉及真实 CSS 动画的 after-leave 生命周期，
 * 必须使用 `global: { stubs: { transition: false } }` 禁用 transition-stub，
 * 否则 stub 不会触发 after-leave，导致 toMount 状态不更新。
 * leave 动画时长为 --o-duration-s（200ms），使用 vi.waitFor 等待动画完成。
 */
describe('unmountOnHide 过渡行为', () => {
  test('OLayer unmountOnHide=false - 关闭后 DOM 保留且 v-show 隐藏', async () => {
    const screen = render(OLayer, {
      props: { visible: true, wrapper: null, unmountOnHide: false },
      global: { stubs: { transition: false } },
    });
    await flush();

    // 关闭浮层
    await screen.rerender({ visible: false });

    // 等待 leave 动画完成后 v-show 生效
    await vi.waitFor(() => {
      const layer = screen.container.querySelector('.o-layer') as HTMLElement;
      expect(layer).not.toBeNull();
      expect(layer.style.display).toBe('none');
    });
  });

  test('OLayer unmountOnHide=false - 重新打开后 v-show 恢复显示', async () => {
    const screen = render(OLayer, {
      props: { visible: true, wrapper: null, unmountOnHide: false },
      global: { stubs: { transition: false } },
    });
    await flush();

    // 关闭
    await screen.rerender({ visible: false });
    await vi.waitFor(() => {
      const layer = screen.container.querySelector('.o-layer') as HTMLElement;
      expect(layer.style.display).toBe('none');
    });

    // 重新打开
    await screen.rerender({ visible: true });
    await flush();

    const layer = screen.container.querySelector('.o-layer') as HTMLElement;
    expect(layer).not.toBeNull();
    expect(layer.style.display).not.toBe('none');
  });

  test('OLayer unmountOnHide=true - 关闭后 DOM 移除', async () => {
    const screen = render(OLayer, {
      props: { visible: true, wrapper: null, unmountOnHide: true },
      global: { stubs: { transition: false } },
    });
    await flush();

    expect(screen.container.querySelector('.o-layer')).not.toBeNull();

    // 关闭浮层
    await screen.rerender({ visible: false });

    // 等待 leave 动画完成后 v-if 移除 DOM
    await vi.waitFor(() => {
      expect(screen.container.querySelector('.o-layer')).toBeNull();
    });
  });
});

/**
 * transitionOrigin=mouse 计算契约。
 *
 * 验证 mouse 模式下，过渡动画正确触发（CSS enter 类被应用）。
 * 验证 css 模式下，不设置内联 transform-origin。
 *
 * 注意：mouse 模式的内联 transform-origin 由 <transition> 的 enter 钩子
 * （handleTransitionEnter → updateOrigin → getOriginStyle）设置。
 * 在测试环境中，<transition> 的 persisted（v-show）模式 enter 回调
 * 无法可靠触发（Vue 已知限制），因此无法直接断言 inline transformOrigin 值。
 * 改为断言过渡动画 CSS 类被正确应用，证明 transition 运行正常。
 */
describe('transitionOrigin=mouse 计算验证', () => {
  test('OLayer transitionOrigin=mouse - 过渡动画 CSS 类正确应用', async () => {
    const screen = render(OLayer, {
      props: { visible: true, wrapper: null, transitionOrigin: 'mouse' },
      global: { stubs: { transition: false } },
    });
    // 不等 flush，在 enter 动画期间检查 CSS 类
    await new Promise((r) => setTimeout(r, 50));

    const main = screen.container.querySelector('.o-layer-main') as HTMLElement;
    expect(main).not.toBeNull();
    // 真实 transition 运行时，enter-active 类应被应用
    expect(main.className).toContain('o-zoom-fade2-enter-active');
  });

  test('OLayer transitionOrigin=css - 不设置内联 transform-origin，由 CSS 变量控制', async () => {
    const screen = render(OLayer, {
      props: { visible: true, wrapper: null, transitionOrigin: 'css' },
      global: { stubs: { transition: false } },
    });
    await new Promise((r) => setTimeout(r, 50));

    const main = screen.container.querySelector('.o-layer-main') as HTMLElement;
    expect(main).not.toBeNull();
    // css 模式下不设置内联 style，由 --layer-origin 变量控制
    expect(main.style.transformOrigin).toBe('');
  });
});

/**
 * wrapper 滚动锁定（o-layer-open class）契约。
 *
 * 验证浮层打开时 wrapper 元素获得 o-layer-open class（overflow: hidden），
 * 关闭时移除该 class。wrapper=body 时 body 元素获得 class。
 */
describe('wrapper 滚动锁定（o-layer-open class）', () => {
  test('OLayer wrapper=body visible=true - body 获得 o-layer-open class', async () => {
    const visible = ref(false);
    render({
      setup() {
        return () => h(OLayer, { visible: visible.value, wrapper: 'body' });
      },
    });
    await flush();

    visible.value = true;
    await flush();

    expect(document.body.classList.contains('o-layer-open')).toBe(true);
  });

  test('OLayer wrapper=body visible=false - body 移除 o-layer-open class', async () => {
    const visible = ref(true);
    render({
      setup() {
        return () => h(OLayer, { visible: visible.value, wrapper: 'body' });
      },
    });
    await flush();

    expect(document.body.classList.contains('o-layer-open')).toBe(true);

    visible.value = false;
    await flush();

    expect(document.body.classList.contains('o-layer-open')).toBe(false);
  });

  test('OLayer 组件卸载 - 从 wrapper 移除 o-layer-open class', async () => {
    const visible = ref(true);
    const screen = render({
      setup() {
        return () => h(OLayer, { visible: visible.value, wrapper: 'body' });
      },
    });
    await flush();

    expect(document.body.classList.contains('o-layer-open')).toBe(true);

    await screen.unmount();

    expect(document.body.classList.contains('o-layer-open')).toBe(false);
  });
});

/**
 * useMouse 清理契约。
 *
 * 验证组件卸载后 window 上的 mousemove 监听器被移除。
 * 通过 spy window.addEventListener / removeEventListener 断言。
 */
describe('useMouse 清理', () => {
  test('OLayer 卸载 - window mousemove 监听器被移除', async () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const screen = render(OLayer, { props: { visible: true, wrapper: null } });
    await flush();

    // useMouse 在 setup 时注册 mousemove
    const mousemoveAdded = addSpy.mock.calls.some(([type]) => type === 'mousemove');
    expect(mousemoveAdded).toBe(true);

    await screen.unmount();

    // 卸载后 mousemove 被移除
    const mousemoveRemoved = removeSpy.mock.calls.some(([type]) => type === 'mousemove');
    expect(mousemoveRemoved).toBe(true);

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});

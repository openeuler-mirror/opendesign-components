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

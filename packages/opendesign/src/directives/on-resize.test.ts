/**
 * vOnResize 指令测试。
 *
 * 以预防性契约为导向：验证指令在任何合理的 mount/unmount 组合下
 * 回调注册和移除的正确性，不依赖内部实现细节。
 */
import { test, expect, describe, vi, afterEach } from 'vitest';
import { defineComponent, nextTick } from 'vue';
import { render } from 'vitest-browser-vue';
import { vOnResize } from './on-resize';
import { useResizeObserver } from '../hooks';

/** 等待两帧，确保 ResizeObserver 异步回调完成 */
function waitForRO() {
  return new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
}

/** 等待 nextTick + RAF，确保 Vue 响应式更新和异步回调完成 */
async function flush() {
  await nextTick();
  await waitForRO();
  await nextTick();
}

/** 模拟 Vue 指令生命周期：挂载元素并注册回调 */
function mountDir(el: HTMLElement, callback: (...args: any[]) => void) {
  vOnResize.beforeMount?.(el as any, {} as any, null, null);
  vOnResize.mounted?.(el as any, { value: callback } as any, null, null);
}

/** 模拟 Vue 指令生命周期：卸载元素并移除回调 */
function unmountDir(el: HTMLElement) {
  vOnResize.unmounted?.(el as any, {} as any, null, null);
}

/** 创建带尺寸的 DOM 元素并挂载到 body */
function createEl(label: string): HTMLElement {
  const el = document.createElement('div');
  el.style.cssText = 'width:100px;height:50px';
  el.textContent = label;
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('基础契约', () => {
  test('mounted - 元素首次 resize 后触发回调', async () => {
    const el = createEl('A');
    const callback = vi.fn();
    mountDir(el, callback);
    await waitForRO();
    expect(callback).toHaveBeenCalled();

    // 手动清理（指令自身未提供 destroy 方法）
    const ro = useResizeObserver();
    ro.unobserve(el, callback);
    el.remove();
  });

  test('unmounted - 卸载后回调不再触发', async () => {
    const el = createEl('A');
    const callback = vi.fn();
    mountDir(el, callback);
    await waitForRO();
    expect(callback).toHaveBeenCalled();

    const count = callback.mock.calls.length;
    unmountDir(el);

    el.style.width = '300px';
    await waitForRO();
    expect(callback.mock.calls.length).toBe(count);
    el.remove();
  });
});

describe('多元素独立契约', () => {
  test('两个元素各自注册不同回调 → 各自触发', async () => {
    const elA = createEl('A');
    const elB = createEl('B');
    const cbA = vi.fn();
    const cbB = vi.fn();

    mountDir(elA, cbA);
    mountDir(elB, cbB);
    await waitForRO();

    expect(cbA).toHaveBeenCalled();
    expect(cbB).toHaveBeenCalled();
    expect(cbA).not.toBe(cbB);

    unmountDir(elA);
    unmountDir(elB);
    elA.remove();
    elB.remove();
  });

  test('卸载元素A → A 回调不再触发，B 回调仍正常', async () => {
    const elA = createEl('A');
    const elB = createEl('B');
    const cbA = vi.fn();
    const cbB = vi.fn();

    mountDir(elA, cbA);
    mountDir(elB, cbB);
    await waitForRO();
    cbA.mockClear();
    cbB.mockClear();

    // 卸载 A
    unmountDir(elA);

    // 改变两个元素的尺寸
    elA.style.width = '200px';
    elB.style.width = '300px';
    await waitForRO();

    // A 的回调不应再触发
    expect(cbA).not.toHaveBeenCalled();
    // B 的回调仍应正常触发
    expect(cbB).toHaveBeenCalled();

    unmountDir(elB);
    elA.remove();
    elB.remove();
  });

  test('卸载元素B → B 回调不再触发，A 回调仍正常', async () => {
    const elA = createEl('A');
    const elB = createEl('B');
    const cbA = vi.fn();
    const cbB = vi.fn();

    mountDir(elA, cbA);
    mountDir(elB, cbB);
    await waitForRO();
    cbA.mockClear();
    cbB.mockClear();

    // 卸载 B（后挂载的元素先卸载）
    unmountDir(elB);

    elA.style.width = '200px';
    elB.style.width = '300px';
    await waitForRO();

    expect(cbA).toHaveBeenCalled();
    expect(cbB).not.toHaveBeenCalled();

    unmountDir(elA);
    elA.remove();
    elB.remove();
  });

  test('三个元素全部卸载 → 无回调触发', async () => {
    const elA = createEl('A');
    const elB = createEl('B');
    const elC = createEl('C');
    const cbA = vi.fn();
    const cbB = vi.fn();
    const cbC = vi.fn();

    mountDir(elA, cbA);
    mountDir(elB, cbB);
    mountDir(elC, cbC);
    await waitForRO();

    const countA = cbA.mock.calls.length;
    const countB = cbB.mock.calls.length;
    const countC = cbC.mock.calls.length;

    unmountDir(elA);
    unmountDir(elB);
    unmountDir(elC);

    elA.style.width = '200px';
    elB.style.width = '200px';
    elC.style.width = '200px';
    await waitForRO();

    expect(cbA.mock.calls.length).toBe(countA);
    expect(cbB.mock.calls.length).toBe(countB);
    expect(cbC.mock.calls.length).toBe(countC);

    elA.remove();
    elB.remove();
    elC.remove();
  });
});

describe('连续 mount-unmount 契约', () => {
  test('同一元素 mount → unmount → mount → 回调仍正常', async () => {
    const el = createEl('A');
    const cb1 = vi.fn();
    const cb2 = vi.fn();

    // 第一轮
    mountDir(el, cb1);
    await waitForRO();
    expect(cb1).toHaveBeenCalled();
    unmountDir(el);

    el.style.width = '200px';
    await waitForRO();
    expect(cb1.mock.calls.length).toBe(1); // 卸载后不再触发

    // 第二轮（模拟 v-if 切换后重新挂载）
    cb1.mockClear();
    mountDir(el, cb2);
    await waitForRO();

    // 新回调应触发
    expect(cb2).toHaveBeenCalled();
    // 旧回调不应触发（已被 unmounted 移除）
    expect(cb1).not.toHaveBeenCalled();

    unmountDir(el);
    el.remove();
  });

  test('连续渲染-卸载多个不同组件 → 不报错', async () => {
    for (let i = 0; i < 3; i++) {
      const callback = vi.fn();
      const TestComp = defineComponent({
        directives: { 'on-resize': vOnResize },
        setup() {
          return { callback };
        },
        template: `<div v-on-resize="callback" style="width:100px;height:50px">test-${i}</div>`,
      });

      const screen = render(TestComp);
      await flush();
      expect(callback).toHaveBeenCalled();
      screen.unmount();
      await flush();
    }
  });
});

describe('Vue 组件集成', () => {
  test('v-on-resize - 组件挂载后触发回调', async () => {
    const callback = vi.fn();
    const TestComp = defineComponent({
      directives: { 'on-resize': vOnResize },
      setup() {
        return { callback };
      },
      template: `<div v-on-resize="callback" style="width:100px;height:50px">test</div>`,
    });

    const screen = render(TestComp);
    await flush();
    expect(callback).toHaveBeenCalled();
    screen.unmount();
  });

  test('v-on-resize - 组件卸载后回调不再触发', async () => {
    const callback = vi.fn();
    const TestComp = defineComponent({
      directives: { 'on-resize': vOnResize },
      setup() {
        return { callback };
      },
      template: `<div v-on-resize="callback" style="width:100px;height:50px">test</div>`,
    });

    const screen = render(TestComp);
    await flush();
    expect(callback).toHaveBeenCalled();
    callback.mockClear();

    screen.unmount();
    await flush();
    expect(callback).not.toHaveBeenCalled();
  });

  test('含多个 v-on-resize 的组件卸载后不残留回调', async () => {
    const cb1 = vi.fn();
    const cb2 = vi.fn();
    const cb3 = vi.fn();
    const TestComp = defineComponent({
      directives: { 'on-resize': vOnResize },
      setup() {
        return { cb1, cb2, cb3 };
      },
      template: `
        <div>
          <div v-on-resize="cb1" class="el-a" style="width:100px;height:50px">A</div>
          <div v-on-resize="cb2" class="el-b" style="width:100px;height:50px">B</div>
          <div v-on-resize="cb3" class="el-c" style="width:100px;height:50px">C</div>
        </div>
      `,
    });

    const screen = render(TestComp);
    await flush();
    expect(cb1).toHaveBeenCalled();
    expect(cb2).toHaveBeenCalled();
    expect(cb3).toHaveBeenCalled();

    const c1 = cb1.mock.calls.length;
    const c2 = cb2.mock.calls.length;
    const c3 = cb3.mock.calls.length;

    screen.unmount();
    await flush();

    expect(cb1.mock.calls.length).toBe(c1);
    expect(cb2.mock.calls.length).toBe(c2);
    expect(cb3.mock.calls.length).toBe(c3);
  });
});

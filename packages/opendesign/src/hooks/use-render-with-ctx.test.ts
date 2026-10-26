/**
 * hooks/use-render-with-ctx.ts 组合式上下文继承渲染测试。
 *
 * 覆盖 useRenderWithCtx 返回的 renderWithCtx / mountWithCtx / cleanup，
 * 以及宿主组件卸载时的自动清理行为。
 *
 * 测试策略：
 *   - 用 inject(KEY) 验证 provides 嫁接是否生效
 *   - renderWithCtx：VNode 挂载 / null 卸载 / 克隆不可变性 /
 *     上下文继承（app 级 + 组件级 provides 同时可注入）
 *   - mountWithCtx：Component / VNode 入参 / 自动容器 / 用户自备容器 /
 *     props 透传 / onUnmount 回调顺序 / 重复 unmount 幂等
 *   - cleanup：批量卸载 + 清空集合 + 幂等
 *   - 自动清理：宿主组件 onUnmounted 触发 cleanup / handle.unmount 从追踪集合移除
 *   - ctx 为 null：mountWithCtx 降级挂载（须手动清理）/ renderWithCtx 降级渲染
 *
 * 注意：vitest browser 模式下 process.env.NODE_ENV 在构建时被静态替换，
 * Log 方法为空操作，降级路径的日志输出不在测试覆盖范围。
 */
import { test, expect, describe, vi, afterEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, defineComponent, createApp, inject, provide, onMounted } from 'vue';
import { useRenderWithCtx } from './use-render-with-ctx';
import { flush } from '../../__tests__/_helpers/dom';
import OConfigProvider from '../config-provider/OConfigProvider.vue';
import { configProviderInjectKey } from '../config-provider';

/**
 * vi.mock 精确控制 getCurrentInstance 返回值。
 * 默认 false → 调用真实 getCurrentInstance，不影响其他测试；
 * 设为 true → 返回 null，模拟"非 setup 作用域调用 useRenderWithCtx"的场景。
 */
const mockConfig = vi.hoisted(() => ({ instanceReturnNull: false }));

vi.mock('vue', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import('vue');
  return {
    ...actual,
    getCurrentInstance: () => (mockConfig.instanceReturnNull ? null : actual.getCurrentInstance()),
  };
});

afterEach(() => {
  mockConfig.instanceReturnNull = false;
});

/** 测试用 injection key — app 级注入 */
const INJECT_KEY = Symbol('test-inject');

/** 测试用 injection key — 组件级注入（OConfigProvider） */
const COMPONENT_KEY = Symbol('test-component-inject');

/**
 * 用于验证 provides 嫁接的探针组件：
 * inject(INJECT_KEY) 成功则显示注入值，否则显示 not-injected
 */
const InjectProbe = defineComponent({
  setup() {
    const val = inject(INJECT_KEY, 'not-injected');
    return () => h('div', { class: 'inject-probe' }, val);
  },
});

// ============================================================
// renderWithCtx
// ============================================================

describe('renderWithCtx', () => {
  test('VNode 挂载到容器并返回克隆 VNode', async () => {
    let renderWithCtx: ReturnType<typeof useRenderWithCtx>['renderWithCtx'] = null as any;

    const HostComp = defineComponent({
      setup() {
        const api = useRenderWithCtx();
        renderWithCtx = api.renderWithCtx;
        return () => h('div');
      },
    });

    const screen = render(HostComp);
    await flush();

    const container = document.createElement('div');
    const result = renderWithCtx(h('div', { class: 'mounted' }, 'content'), container);
    const el = container.querySelector('.mounted');

    expect(el).not.toBeNull();
    expect(el?.textContent).toBe('content');
    // 返回的克隆 VNode 的 el 已被 Vue 填充，指向实际 DOM
    expect(result.vnode).not.toBeNull();
    expect(result.vnode?.el).toBe(el);

    renderWithCtx(null, container);
    await screen.unmount();
  });

  test('null vnode 执行卸载并返回 null', async () => {
    let renderWithCtx: ReturnType<typeof useRenderWithCtx>['renderWithCtx'] = null as any;

    const HostComp = defineComponent({
      setup() {
        const api = useRenderWithCtx();
        renderWithCtx = api.renderWithCtx;
        return () => h('div');
      },
    });

    const screen = render(HostComp);
    await flush();

    const container = document.createElement('div');
    renderWithCtx(h('div', { class: 'tmp' }, 'hello'), container);
    expect(container.children.length).toBe(1);

    const result = renderWithCtx(null, container);
    expect(result.vnode).toBeNull();
    expect(container.children.length).toBe(0);

    await screen.unmount();
  });

  test('cloneVNode 不修改原始 VNode — appContext 仅设置在克隆上', async () => {
    let renderWithCtx: ReturnType<typeof useRenderWithCtx>['renderWithCtx'] = null as any;

    const HostComp = defineComponent({
      setup() {
        const api = useRenderWithCtx();
        renderWithCtx = api.renderWithCtx;
        return () => h('div');
      },
    });

    const screen = render(HostComp);
    await flush();

    const original = h('div', { class: 'original' }, 'text');
    const originalAppContext = original.appContext;

    const container = document.createElement('div');
    renderWithCtx(original, container);

    // 原始 VNode 的 appContext 未被修改
    expect(original.appContext).toBe(originalAppContext);
    // 克隆后的 VNode 渲染成功
    expect(container.querySelector('.original')).not.toBeNull();

    renderWithCtx(null, container);
    await screen.unmount();
  });

  test('上下文继承 — app 级 provides 可注入', async () => {
    let renderWithCtx: ReturnType<typeof useRenderWithCtx>['renderWithCtx'] = null as any;

    const HostComp = defineComponent({
      setup() {
        const api = useRenderWithCtx();
        renderWithCtx = api.renderWithCtx;
        return () => h('div');
      },
    });

    // 用 createApp 包裹，provide 值
    const app = createApp(HostComp);
    app.provide(INJECT_KEY, 'app-level-value');
    const mountContainer = document.createElement('div');
    document.body.appendChild(mountContainer);
    app.mount(mountContainer);
    await flush();

    const container = document.createElement('div');
    renderWithCtx(h(InjectProbe), container);
    // 挂载在组件树外的探针能拿到 app 级注入
    expect(container.textContent).toBe('app-level-value');

    renderWithCtx(null, container);
    app.unmount();
    mountContainer.remove();
    await flush();
  });

  test('上下文继承 — app 级 + 组件级 provides 同时可注入', async () => {
    let renderWithCtx: ReturnType<typeof useRenderWithCtx>['renderWithCtx'] = null as any;

    // 外层 provide COMPONENT_KEY，验证组件级注入链
    const Inner = defineComponent({
      setup() {
        provide(COMPONENT_KEY, 'component-level-value');
        const api = useRenderWithCtx();
        renderWithCtx = api.renderWithCtx;
        return () => h('div');
      },
    });

    const HostComp = defineComponent({
      setup() {
        return () => h(Inner);
      },
    });

    const app = createApp(HostComp);
    app.provide(INJECT_KEY, 'app-level-value');
    const mountContainer = document.createElement('div');
    document.body.appendChild(mountContainer);
    app.mount(mountContainer);
    await flush();

    // 探针同时注入 app 级 key 和组件级 key
    const DualProbe = defineComponent({
      setup() {
        const appVal = inject(INJECT_KEY, 'no-app');
        const compVal = inject(COMPONENT_KEY, 'no-comp');
        return () => h('div', `${appVal}/${compVal}`);
      },
    });

    const container = document.createElement('div');
    renderWithCtx(h(DualProbe), container);
    // instance.provides 原型链 → app 级 + 组件级注入同时生效
    expect(container.textContent).toBe('app-level-value/component-level-value');

    renderWithCtx(null, container);
    app.unmount();
    mountContainer.remove();
    await flush();
  });

  test('OConfigProvider 集成 — configProviderInjectKey 可注入', async () => {
    let renderWithCtx: ReturnType<typeof useRenderWithCtx>['renderWithCtx'] = null as any;

    const Inner = defineComponent({
      setup() {
        const api = useRenderWithCtx();
        renderWithCtx = api.renderWithCtx;
        return () => h('div');
      },
    });

    // 用真实 OConfigProvider 验证组件级 provides 链
    const app = createApp({
      render: () => h(OConfigProvider, { locale: { name: 'zh-CN' } as any }, { default: () => h(Inner) }),
    });

    const mountContainer = document.createElement('div');
    document.body.appendChild(mountContainer);
    app.mount(mountContainer);
    await flush();

    const ProbeWithConfig = defineComponent({
      setup() {
        const config = inject(configProviderInjectKey, null);
        return () => h('div', config?.locale?.name ?? 'no-config');
      },
    });

    const container = document.createElement('div');
    renderWithCtx(h(ProbeWithConfig), container);
    await flush();
    expect(container.textContent).toBe('zh-CN');

    renderWithCtx(null, container);
    app.unmount();
    mountContainer.remove();
    await flush();
  });
});

// ============================================================
// mountWithCtx
// ============================================================

describe('mountWithCtx', () => {
  test('挂载 Component 并返回 handle', async () => {
    let mountWithCtx: ReturnType<typeof useRenderWithCtx>['mountWithCtx'] = null as any;

    const HostComp = defineComponent({
      setup() {
        const api = useRenderWithCtx();
        mountWithCtx = api.mountWithCtx;
        return () => h('div');
      },
    });

    const screen = render(HostComp);
    await flush();

    const Comp = defineComponent({
      render: () => h('div', { class: 'mounted-comp' }, 'hello'),
    });

    const handle = mountWithCtx(Comp);
    await flush();

    expect(handle).not.toBeNull();
    expect(handle.vnode).toBeDefined();
    expect(handle.vnode.el).toBeInstanceOf(HTMLElement);
    expect(handle.container).toBeInstanceOf(HTMLElement);
    const el = handle.container.querySelector('.mounted-comp');
    expect(el).not.toBeNull();
    expect(el?.textContent).toBe('hello');

    handle.unmount();
    await screen.unmount();
  });

  test('挂载 VNode 直接使用而非通过 h() 创建', async () => {
    let mountWithCtx: ReturnType<typeof useRenderWithCtx>['mountWithCtx'] = null as any;

    const HostComp = defineComponent({
      setup() {
        const api = useRenderWithCtx();
        mountWithCtx = api.mountWithCtx;
        return () => h('div');
      },
    });

    const screen = render(HostComp);
    await flush();

    const vnode = h('div', { class: 'direct-vnode' }, 'direct');
    const handle = mountWithCtx(vnode);
    await flush();

    expect(handle.container.querySelector('.direct-vnode')?.textContent).toBe('direct');

    handle.unmount();
    await screen.unmount();
  });

  test('自动容器 append 到 body，unmount 后移除', async () => {
    let mountWithCtx: ReturnType<typeof useRenderWithCtx>['mountWithCtx'] = null as any;

    const HostComp = defineComponent({
      setup() {
        const api = useRenderWithCtx();
        mountWithCtx = api.mountWithCtx;
        return () => h('div');
      },
    });

    const screen = render(HostComp);
    await flush();

    const Comp = defineComponent({ render: () => h('div', 'tmp') });
    const handle = mountWithCtx(Comp);
    await flush();

    expect(document.body.contains(handle.container)).toBe(true);

    handle.unmount();
    expect(document.body.contains(handle.container)).toBe(false);

    await screen.unmount();
  });

  test('用户自备容器也被移除', async () => {
    let mountWithCtx: ReturnType<typeof useRenderWithCtx>['mountWithCtx'] = null as any;

    const HostComp = defineComponent({
      setup() {
        const api = useRenderWithCtx();
        mountWithCtx = api.mountWithCtx;
        return () => h('div');
      },
    });

    const screen = render(HostComp);
    await flush();

    const Comp = defineComponent({ render: () => h('div', 'user') });
    const userContainer = document.createElement('div');
    document.body.appendChild(userContainer);

    const handle = mountWithCtx(Comp, {}, { container: userContainer });
    await flush();

    expect(userContainer.textContent).toBe('user');

    handle.unmount();
    expect(document.body.contains(userContainer)).toBe(false);

    await screen.unmount();
  });

  test('props 透传给组件', async () => {
    let mountWithCtx: ReturnType<typeof useRenderWithCtx>['mountWithCtx'] = null as any;

    const HostComp = defineComponent({
      setup() {
        const api = useRenderWithCtx();
        mountWithCtx = api.mountWithCtx;
        return () => h('div');
      },
    });

    const screen = render(HostComp);
    await flush();

    const Comp = defineComponent({
      props: { message: { type: String, default: '' } },
      setup(props) {
        return () => h('div', { class: 'prop-test' }, props.message);
      },
    });

    const handle = mountWithCtx(Comp, { message: 'passed' });
    await flush();

    expect(handle.container.querySelector('.prop-test')?.textContent).toBe('passed');

    handle.unmount();
    await screen.unmount();
  });

  test('onUnmount 回调在 render(null) 之后、container.remove() 之前执行', async () => {
    let mountWithCtx: ReturnType<typeof useRenderWithCtx>['mountWithCtx'] = null as any;

    const HostComp = defineComponent({
      setup() {
        const api = useRenderWithCtx();
        mountWithCtx = api.mountWithCtx;
        return () => h('div');
      },
    });

    const screen = render(HostComp);
    await flush();

    const Comp = defineComponent({ render: () => h('div', 'content') });
    let containerEmpty = false;
    let containerInBody = false;

    const handle = mountWithCtx(
      Comp,
      {},
      {
        onUnmount: () => {
          // render(null) 已执行：容器内无子元素
          containerEmpty = handle.container.children.length === 0;
          // container.remove() 尚未执行：容器仍在 body 中
          containerInBody = document.body.contains(handle.container);
        },
      },
    );
    await flush();

    handle.unmount();

    expect(containerEmpty).toBe(true);
    expect(containerInBody).toBe(true);
    // 最终容器已从 body 移除
    expect(document.body.contains(handle.container)).toBe(false);

    await screen.unmount();
  });

  test('重复 unmount 是 no-op', async () => {
    let mountWithCtx: ReturnType<typeof useRenderWithCtx>['mountWithCtx'] = null as any;

    const HostComp = defineComponent({
      setup() {
        const api = useRenderWithCtx();
        mountWithCtx = api.mountWithCtx;
        return () => h('div');
      },
    });

    const screen = render(HostComp);
    await flush();

    const Comp = defineComponent({ render: () => h('div') });
    const handle = mountWithCtx(Comp);
    await flush();

    handle.unmount();
    // 再次 unmount 不抛错
    expect(() => handle.unmount()).not.toThrow();

    await screen.unmount();
  });

  test('上下文继承 — 挂载的组件可注入 app 级 provides', async () => {
    let mountWithCtx: ReturnType<typeof useRenderWithCtx>['mountWithCtx'] = null as any;

    const HostComp = defineComponent({
      setup() {
        const api = useRenderWithCtx();
        mountWithCtx = api.mountWithCtx;
        return () => h('div');
      },
    });

    const app = createApp(HostComp);
    app.provide(INJECT_KEY, 'mount-app-value');
    const mountContainer = document.createElement('div');
    document.body.appendChild(mountContainer);
    app.mount(mountContainer);
    await flush();

    const handle = mountWithCtx(InjectProbe);
    await flush();
    expect(handle.container.textContent).toBe('mount-app-value');

    handle.unmount();
    app.unmount();
    mountContainer.remove();
    await flush();
  });
});

// ============================================================
// cleanup
// ============================================================

describe('cleanup', () => {
  test('cleanup 卸载所有 mountWithCtx 创建的挂载实例', async () => {
    let mountWithCtx: ReturnType<typeof useRenderWithCtx>['mountWithCtx'] = null as any;
    let cleanup: ReturnType<typeof useRenderWithCtx>['cleanup'] = null as any;

    const HostComp = defineComponent({
      setup() {
        const api = useRenderWithCtx();
        mountWithCtx = api.mountWithCtx;
        cleanup = api.cleanup;
        return () => h('div');
      },
    });

    const screen = render(HostComp);
    await flush();

    const Comp = defineComponent({ render: () => h('div', 'content') });
    const handle1 = mountWithCtx(Comp);
    const handle2 = mountWithCtx(Comp);
    await flush();

    expect(document.body.contains(handle1.container)).toBe(true);
    expect(document.body.contains(handle2.container)).toBe(true);

    cleanup();

    expect(document.body.contains(handle1.container)).toBe(false);
    expect(document.body.contains(handle2.container)).toBe(false);

    await screen.unmount();
  });

  test('cleanup 幂等 — 重复调用不抛错', async () => {
    let cleanup: ReturnType<typeof useRenderWithCtx>['cleanup'] = null as any;

    const HostComp = defineComponent({
      setup() {
        const api = useRenderWithCtx();
        cleanup = api.cleanup;
        return () => h('div');
      },
    });

    const screen = render(HostComp);
    await flush();

    expect(() => cleanup()).not.toThrow();
    expect(() => cleanup()).not.toThrow();

    await screen.unmount();
  });

  test('手动 unmount 后 cleanup 不重复清理', async () => {
    let mountWithCtx: ReturnType<typeof useRenderWithCtx>['mountWithCtx'] = null as any;
    let cleanup: ReturnType<typeof useRenderWithCtx>['cleanup'] = null as any;

    const HostComp = defineComponent({
      setup() {
        const api = useRenderWithCtx();
        mountWithCtx = api.mountWithCtx;
        cleanup = api.cleanup;
        return () => h('div');
      },
    });

    const screen = render(HostComp);
    await flush();

    const onUnmount = vi.fn();
    const Comp = defineComponent({ render: () => h('div') });
    const handle = mountWithCtx(Comp, {}, { onUnmount });
    await flush();

    // 手动卸载，触发 onUnmount 回调
    handle.unmount();
    expect(onUnmount).toHaveBeenCalledTimes(1);

    // cleanup 不应再次触发已卸载句柄的 onUnmount
    cleanup();
    expect(onUnmount).toHaveBeenCalledTimes(1);

    await screen.unmount();
  });
});

// ============================================================
// 自动清理（宿主组件 onUnmounted）
// ============================================================

describe('自动清理 — 宿主组件卸载', () => {
  test('宿主组件卸载时自动 cleanup 所有挂载实例', async () => {
    let mountWithCtx: ReturnType<typeof useRenderWithCtx>['mountWithCtx'] = null as any;
    const capturedHandles: Array<{ container: HTMLElement; unmount: () => void }> = [];

    const HostComp = defineComponent({
      setup() {
        const api = useRenderWithCtx();
        mountWithCtx = api.mountWithCtx;
        onMounted(() => {
          const Comp = defineComponent({ render: () => h('div', 'auto-cleanup') });
          const handle = mountWithCtx(Comp);
          capturedHandles.push(handle);
        });
        return () => h('div');
      },
    });

    const screen = render(HostComp);
    await flush();

    expect(capturedHandles.length).toBe(1);
    expect(document.body.contains(capturedHandles[0].container)).toBe(true);

    // 卸载宿主组件 → onUnmounted → cleanup → 所有挂载被清理
    await screen.unmount();
    await flush();

    expect(document.body.contains(capturedHandles[0].container)).toBe(false);
  });

  test('宿主组件卸载时触发各 handle 的 onUnmount 回调', async () => {
    let mountWithCtx: ReturnType<typeof useRenderWithCtx>['mountWithCtx'] = null as any;
    const onUnmountSpy = vi.fn();

    const HostComp = defineComponent({
      setup() {
        const api = useRenderWithCtx();
        mountWithCtx = api.mountWithCtx;
        onMounted(() => {
          const Comp = defineComponent({ render: () => h('div') });
          mountWithCtx(Comp, {}, { onUnmount: onUnmountSpy });
        });
        return () => h('div');
      },
    });

    const screen = render(HostComp);
    await flush();

    expect(onUnmountSpy).not.toHaveBeenCalled();

    await screen.unmount();
    await flush();

    expect(onUnmountSpy).toHaveBeenCalledTimes(1);
  });

  test('手动 unmount 的 handle 在宿主卸载时不重复清理', async () => {
    let mountWithCtx: ReturnType<typeof useRenderWithCtx>['mountWithCtx'] = null as any;
    const onUnmountSpy = vi.fn();
    let handle: { unmount: () => void } | null = null;

    const HostComp = defineComponent({
      setup() {
        const api = useRenderWithCtx();
        mountWithCtx = api.mountWithCtx;
        onMounted(() => {
          const Comp = defineComponent({ render: () => h('div') });
          handle = mountWithCtx(Comp, {}, { onUnmount: onUnmountSpy });
        });
        return () => h('div');
      },
    });

    const screen = render(HostComp);
    await flush();

    expect(handle).not.toBeNull();
    // 手动卸载
    handle!.unmount();
    expect(onUnmountSpy).toHaveBeenCalledTimes(1);

    // 宿主卸载时不应再次调用已卸载 handle 的 onUnmount
    await screen.unmount();
    await flush();

    expect(onUnmountSpy).toHaveBeenCalledTimes(1);
  });
});

// ============================================================
// ctx 为 null（非 setup 作用域）— mountWithCtx 降级挂载，须手动清理
// ============================================================

/**
 * 通过 vi.mock 将 getCurrentInstance 强制返回 null，模拟"useRenderWithCtx
 * 在 setup 作用域外调用"的场景。此场景下 onUnmounted 无法注册，挂载实例不会被自动回收，
 * 但 mountWithCtx 仍可正常挂载（降级，不嫁接上下文），用户须手动调用 handle.unmount() 清理。
 */
describe('ctx 为 null — mountWithCtx 降级挂载，须手动清理', () => {
  test('mountWithCtx 降级挂载，返回 handle 且创建 DOM', () => {
    mockConfig.instanceReturnNull = true;
    const { mountWithCtx } = useRenderWithCtx();

    const handle = mountWithCtx(h('div', { class: 'degraded' }, 'mounted'));

    expect(handle).not.toBeNull();
    expect(handle!.container.querySelector('.degraded')?.textContent).toBe('mounted');

    handle!.unmount();
    expect(document.body.contains(handle!.container)).toBe(false);
  });

  test('renderWithCtx 仍可渲染（降级，不嫁接上下文）', () => {
    mockConfig.instanceReturnNull = true;
    const { renderWithCtx } = useRenderWithCtx();

    const container = document.createElement('div');
    const result = renderWithCtx(h('div', { class: 'ctx-null' }, 'rendered'), container);

    expect(container.querySelector('.ctx-null')?.textContent).toBe('rendered');
    expect(result.vnode).not.toBeNull();

    renderWithCtx(null, container);

    // 降级模式下 ctx 为 null，appContext 未嫁接，探针组件 inject 应返回默认值
    const probeContainer = document.createElement('div');
    renderWithCtx(h(InjectProbe), probeContainer);
    expect(probeContainer.textContent).toBe('not-injected');

    renderWithCtx(null, probeContainer);
  });

  test('useRenderWithCtx 不抛错且不注册 onUnmounted', () => {
    mockConfig.instanceReturnNull = true;
    expect(() => useRenderWithCtx()).not.toThrow();
  });

  test('手动 cleanup 可清理降级挂载的实例', () => {
    mockConfig.instanceReturnNull = true;
    const { mountWithCtx, cleanup } = useRenderWithCtx();

    const handle = mountWithCtx(h('div'));
    expect(handle).not.toBeNull();
    expect(document.body.contains(handle!.container)).toBe(true);

    // 手动调用 cleanup 可清理挂载实例
    expect(() => cleanup()).not.toThrow();
    expect(document.body.contains(handle!.container)).toBe(false);
  });
});

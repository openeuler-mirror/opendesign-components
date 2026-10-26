/**
 * ssrHydrateAndCompare 检测能力的系统性验证。
 *
 * 本文件与 ssr.ts helper 同目录，测试的是 helper 方法本身的检测能力，
 * 而非任何具体组件的 SSR 行为（组件 SSR 测试在各组件 __tests__/ 下）。
 *
 * 每个 test 用一个故意触发 mismatch 的探针组件，
 * 断言 ssrHydrateAndCompare 能正确检测到（或正确不误报）。
 *
 * 按断言方向分为三组：
 *
 *   I. 应检测到的 mismatch（hasMismatch === true）
 *      随机值/时间戳、非法 HTML 嵌套、Teleport、节点类型不同、子节点数量不同、
 *      属性 mismatch（class/style/普通属性）
 *
 *   II. 不应误报的场景（hasMismatch === false）
 *      Browser Mode 环境共享、浏览器容忍的嵌套、onMounted 合法更新、静态组件
 *
 *   III. 已知盲区（真实 mismatch 但三维度均无法检测）
 *      v-html 结构不同但文本相同
 *
 * 三维度检测原理见 ssr.ts 的 ssrHydrateAndCompare JSDoc。
 */
import { test, expect, describe, afterEach } from 'vitest';
import { defineComponent, h, ref, onMounted, Teleport } from 'vue';
import { ssrHydrateAndCompare } from './_helpers/ssr';

// ============================================================================
// 探针组件定义
// ============================================================================

// ---- I 组探针：应检测到 mismatch ----

/** I-随机值: Math.random() — 每次 render 值不同 */
const RandomProbe = defineComponent({
  name: 'RandomProbe',
  render() {
    return h('span', `rand-${Math.floor(Math.random() * 10000)}`);
  },
});

/**
 * I-随机值: 递增计数器 — 模拟 Date.now() 等每次实例化值不同的场景。
 *
 * Date.now() 在 Browser Mode 下 SSR 和客户端可能在同一毫秒执行，
 * 导致 textContent 碰巧一致 → 不稳定。用全局计数器替代，确保值一定不同。
 */
let counterProbeCounter = 0;
const CounterProbe = defineComponent({
  name: 'CounterProbe',
  setup() {
    const val = ref(++counterProbeCounter);
    return { val };
  },
  render() {
    return h('span', `val-${this.val}`);
  },
});

/** I-非法嵌套: <p> 嵌 <div> — block-level 元素嵌在 <p> 内，浏览器自动修正 */
const PDivProbe = defineComponent({
  name: 'PDivProbe',
  render() {
    return h('p', [h('div', 'block-in-p')]);
  },
});

/** I-非法嵌套: <a> 嵌 <a> — 交互式内容嵌套，浏览器自动修正 */
const AInAProbe = defineComponent({
  name: 'AInAProbe',
  render() {
    return h('a', { href: '#outer' }, [h('a', { href: '#inner' }, 'nested-link')]);
  },
});

/** I-Teleport: Teleport to body — 客户端渲染后 root 内多出 teleported 节点 */
const TeleportProbe = defineComponent({
  name: 'TeleportProbe',
  render() {
    return h('div', [h('span', 'source-content'), h(Teleport, { to: 'body' }, [h('div', { id: 'teleported-content' }, 'teleported')])]);
  },
});

/**
 * I-属性 mismatch: class 名不同但文本相同。
 *
 * SSR 渲染 <span class="o-btn-normal">X</span>
 * 客户端渲染 <span class="o-btn-primary">X</span>
 * → class 属性 mismatch，但 textContent = "X" 一致。
 * Vue 对 class mismatch 只发 console.warn 不 patch DOM → 仅 console.warn 维度可检测。
 */
let classMismatchCounter = 0;
const ClassMismatchProbe = defineComponent({
  name: 'ClassMismatchProbe',
  setup() {
    const cls = ref(++classMismatchCounter === 1 ? 'normal' : 'primary');
    return { cls };
  },
  render() {
    return h('span', { class: `o-btn-${this.cls}` }, 'X');
  },
});

/**
 * I-属性 mismatch: style 属性不同但文本相同。
 *
 * SSR 渲染 <span style="">X</span>（空 style）
 * 客户端渲染 <span style="color: red">X</span>（有 style）
 * → style 属性 mismatch，但 textContent = "X" 一致。
 * Vue 对 style mismatch 只发 console.warn 不替换 Element → 仅 console.warn 维度可检测。
 */
let styleMismatchCounter = 0;
const StyleMismatchProbe = defineComponent({
  name: 'StyleMismatchProbe',
  setup() {
    const color = ref(++styleMismatchCounter === 1 ? '' : 'red');
    return { color };
  },
  render() {
    return h('span', { style: this.color ? `color: ${this.color}` : undefined }, 'X');
  },
});

/**
 * I-节点类型 mismatch: SSR 渲染 <div>，客户端渲染 <span>。
 *
 * 同一位置节点类型不同 → Vue 报告 "Hydration node mismatch" 并替换 Element。
 * textContent = "X" 一致 → textMismatch = false，
 * Element 引用变化（旧 <div> 消失、新 <span> 出现）→ structuralMismatch = true，
 * console.warn 也报告 node mismatch → hydrationMismatch = true。
 */
let nodeTypeMismatchCounter = 0;
const NodeTypeMismatchProbe = defineComponent({
  name: 'NodeTypeMismatchProbe',
  setup() {
    const tag = ref(++nodeTypeMismatchCounter === 1 ? 'div' : 'span');
    return { tag };
  },
  render() {
    return h(this.tag, 'X');
  },
});

/**
 * I-子节点数量 mismatch: SSR 渲染 1 个子节点，客户端渲染 2 个。
 *
 * SSR 渲染 <div><span>A</span></div>
 * 客户端渲染 <div><span>A</span><span>B</span></div>
 * → 子节点数量不同。
 * textContent: "A" vs "AB" → textMismatch = true，
 * 新 <span>B</span> Element 出现 → structuralMismatch = true，
 * console.warn 报告 children mismatch → hydrationMismatch = true。
 */
let childrenCountMismatchCounter = 0;
const ChildrenCountMismatchProbe = defineComponent({
  name: 'ChildrenCountMismatchProbe',
  setup() {
    const showExtra = ref(++childrenCountMismatchCounter !== 1);
    return { showExtra };
  },
  render() {
    const children = [h('span', 'A')];
    if (this.showExtra) children.push(h('span', 'B'));
    return h('div', children);
  },
});

/**
 * I-属性 mismatch: 普通属性（title）值不同但文本相同。
 *
 * SSR 渲染 <span title="ssr-title">X</span>
 * 客户端渲染 <span title="client-title">X</span>
 * → title 属性值不同，但 textContent = "X" 一致，Element 引用不变。
 *
 * Vue 对非 class/style 属性 mismatch 也发 console.warn（标注 check-only），
 * 但 textContent 和 Element 引用不变 → 仅 console.warn 维度可检测。
 */
let attrMismatchCounter = 0;
const AttributeMismatchProbe = defineComponent({
  name: 'AttributeMismatchProbe',
  setup() {
    const title = ref(++attrMismatchCounter === 1 ? 'ssr-title' : 'client-title');
    return { title };
  },
  render() {
    return h('span', { title: this.title }, 'X');
  },
});

// ---- II 组探针：不应误报 ----

/**
 * II-环境共享: typeof window 条件渲染。
 * Browser Mode 下 SSR 也在浏览器 → typeof window === 'object' → 无实际 mismatch。
 */
const WindowProbe = defineComponent({
  name: 'WindowProbe',
  setup() {
    const isClient = ref(typeof window !== 'undefined');
    return { isClient };
  },
  render() {
    return h('div', [this.isClient ? h('span', 'client-only') : null, h('span', 'shared')]);
  },
});

/**
 * II-环境共享: window.innerWidth。
 * Browser Mode 下 SSR 和客户端在同一视口（ssrHydrateAndCompare 已设置 viewport 1920×1080）→ 无 mismatch。
 */
const ViewportProbe = defineComponent({
  name: 'ViewportProbe',
  setup() {
    const width = ref(window.innerWidth);
    return { width };
  },
  render() {
    return h('span', `w-${this.width}`);
  },
});

/**
 * II-环境共享: navigator.userAgent。
 * Browser Mode 下共享 navigator → UA 一致 → 无 mismatch。
 */
const UaProbe = defineComponent({
  name: 'UaProbe',
  setup() {
    const ua = ref(navigator.userAgent.slice(0, 20));
    return { ua };
  },
  render() {
    return h('span', `ua-${this.ua}`);
  },
});

/**
 * II-环境共享: new Date() 格式化。
 * Browser Mode 下共享 Intl → toLocaleDateString() 返回值一致 → 无 mismatch。
 */
const DateFormatProbe = defineComponent({
  name: 'DateFormatProbe',
  setup() {
    const formatted = ref(new Date(2025, 0, 1).toLocaleDateString());
    return { formatted };
  },
  render() {
    return h('span', `date-${this.formatted}`);
  },
});

/** II-容忍嵌套: <ul> 嵌 <div> — 浏览器不强制修正，DOM 结构不变 */
const UlDivProbe = defineComponent({
  name: 'UlDivProbe',
  render() {
    return h('ul', [h('div', 'div-in-ul')]);
  },
});

/** II-onMounted: onMounted 修改 ref — 首帧一致，post-hydration 更新不算 mismatch */
const MountedProbe = defineComponent({
  name: 'MountedProbe',
  setup() {
    const val = ref('ssr-value');
    onMounted(() => {
      val.value = 'client-value';
    });
    return { val };
  },
  render() {
    return h('span', this.val);
  },
});

/** II-onMounted: ref(false) + onMounted 改 true — 首帧 false，SSR/客户端一致 */
const MountedToggleProbe = defineComponent({
  name: 'MountedToggleProbe',
  setup() {
    const show = ref(false);
    onMounted(() => {
      show.value = true;
    });
    return { show };
  },
  render() {
    return h('div', [h('span', 'always-visible'), this.show ? h('span', 'mounted-only') : null]);
  },
});

/** II-静态: 完全一致的静态组件 */
const StaticProbe = defineComponent({
  name: 'StaticProbe',
  render() {
    return h('span', 'static-content');
  },
});

// ---- III 组探针：已知盲区 ----

/**
 * III-盲区: v-html 内容不同但文本相同。
 *
 * SSR: <div>innerHTML = "<b>xxx</b>"
 * 客户端: <div>innerHTML = "<i>xxx</i>"
 * → HTML 结构不同但 textContent = "xxx" 一致。
 *
 * Vue 对 v-html(innerHTML) 的处理：hydrate 时完全不比较 innerHTML 值，
 * 不 patch DOM、不发 console.warn、不替换 Element → DOM 保持 SSR 版本不变。
 * 三维度（textContent / console.warn / Element 引用）均无法检测。
 */
let vHtmlMismatchCounter = 0;
const VHtmlMismatchProbe = defineComponent({
  name: 'VHtmlMismatchProbe',
  setup() {
    const html = ref(++vHtmlMismatchCounter === 1 ? '<b>xxx</b>' : '<i>xxx</i>');
    return { html };
  },
  render() {
    return h('div', { innerHTML: this.html });
  },
});

// ============================================================================
// 测试
// ============================================================================

describe('ssrHydrateAndCompare 检测能力验证', () => {
  let root: HTMLElement | null = null;

  afterEach(() => {
    if (root) {
      root.remove();
      root = null;
    }
    // 清理 TeleportProbe 侧效应：Vue 将 Teleport 目标节点移到 document.body，
    // afterEach 仅移除 root，teleported 内容残留在 body → 需额外清理
    const teleported = document.getElementById('teleported-content');
    if (teleported) teleported.remove();
  });

  // ================================================================
  // I. 应检测到的 mismatch
  // ================================================================

  test('随机值 Math.random() — textContent 不同 → 应检测到 mismatch', async () => {
    const result = await ssrHydrateAndCompare(RandomProbe);
    root = result.root;
    expect(result.hasMismatch).toBe(true);
  });

  test('递增计数器 — 每次实例化值不同 → 应检测到 mismatch', async () => {
    counterProbeCounter = 0;
    const result = await ssrHydrateAndCompare(CounterProbe);
    root = result.root;
    expect(result.hasMismatch).toBe(true);
  });

  test('<p> 嵌 <div> — 浏览器自动修正 DOM → 应检测到 mismatch', async () => {
    const result = await ssrHydrateAndCompare(PDivProbe);
    root = result.root;
    expect(result.hasMismatch).toBe(true);
  });

  test('<a> 嵌 <a> — 浏览器自动修正 DOM → 应检测到 mismatch', async () => {
    const result = await ssrHydrateAndCompare(AInAProbe);
    root = result.root;
    expect(result.hasMismatch).toBe(true);
  });

  test('Teleport to body — root 内 Element 引用变化 → 应检测到 mismatch', async () => {
    const result = await ssrHydrateAndCompare(TeleportProbe);
    root = result.root;
    expect(result.hasMismatch).toBe(true);
    // Teleport 是 Vue 正常行为（非 hydration mismatch），不发 console.warn
    // 但 root 内 Element 引用变化 + textContent 变化 → 维度 1+3 可检测
    expect(result.structuralMismatch).toBe(true);
  });

  test('class 属性不同但文本相同 — console.warn 维度可检测', async () => {
    classMismatchCounter = 0;
    const result = await ssrHydrateAndCompare(ClassMismatchProbe);
    root = result.root;
    expect(result.hasMismatch).toBe(true);
    expect(result.hydrationWarnings.length).toBeGreaterThanOrEqual(1);
    expect(result.hydrationWarnings.find((w) => w.includes('class mismatch'))).toBeDefined();
  });

  test('style 属性不同但文本相同 — console.warn 维度可检测', async () => {
    styleMismatchCounter = 0;
    const result = await ssrHydrateAndCompare(StyleMismatchProbe);
    root = result.root;
    expect(result.hasMismatch).toBe(true);
    expect(result.hydrationWarnings.length).toBeGreaterThanOrEqual(1);
    expect(result.hydrationWarnings.find((w) => w.includes('style mismatch'))).toBeDefined();
  });

  test('节点类型不同（<div> vs <span>）— console.warn + Element 引用可检测', async () => {
    nodeTypeMismatchCounter = 0;
    const result = await ssrHydrateAndCompare(NodeTypeMismatchProbe);
    root = result.root;
    expect(result.hasMismatch).toBe(true);
    // textContent 维度：相同文本 "X" → 不变
    expect(result.ssrTextContent).toBe(result.hydratedTextContent);
    // Element 引用维度：旧 <div> 被替换为 <span> → structuralMismatch = true
    expect(result.structuralMismatch).toBe(true);
    // console.warn 维度：node mismatch
    expect(result.hydrationWarnings.length).toBeGreaterThanOrEqual(1);
  });

  test('子节点数量不同（1 vs 2）— 三维度均可检测', async () => {
    childrenCountMismatchCounter = 0;
    const result = await ssrHydrateAndCompare(ChildrenCountMismatchProbe);
    root = result.root;
    expect(result.hasMismatch).toBe(true);
    // textContent 维度："A" ≠ "AB"
    expect(result.ssrTextContent).not.toBe(result.hydratedTextContent);
    // Element 引用维度：新 <span>B</span> 出现
    expect(result.structuralMismatch).toBe(true);
    // console.warn 维度：children mismatch
    expect(result.hydrationWarnings.length).toBeGreaterThanOrEqual(1);
  });

  test('title 属性值不同但文本相同 — console.warn 维度可检测', async () => {
    attrMismatchCounter = 0;
    const result = await ssrHydrateAndCompare(AttributeMismatchProbe);
    root = result.root;
    expect(result.hasMismatch).toBe(true);
    // textContent 维度："X" = "X" → 不变
    expect(result.ssrTextContent).toBe(result.hydratedTextContent);
    // Element 引用维度：同一 <span> Element → 不变
    expect(result.structuralMismatch).toBe(false);
    // console.warn 维度：attribute mismatch（check-only）
    expect(result.hydrationWarnings.length).toBeGreaterThanOrEqual(1);
    expect(result.hydrationWarnings.find((w) => w.includes('attribute mismatch'))).toBeDefined();
  });

  // ================================================================
  // II. 不应误报的场景
  // ================================================================

  describe('Browser Mode 环境共享 — SSR 和客户端在同一浏览器上下文', () => {
    test('typeof window — 无 mismatch', async () => {
      const result = await ssrHydrateAndCompare(WindowProbe);
      root = result.root;
      expect(result.hasMismatch).toBe(false);
    });

    test('window.innerWidth — viewport 已统一为 1920×1080，无 mismatch', async () => {
      const result = await ssrHydrateAndCompare(ViewportProbe);
      root = result.root;
      expect(result.hasMismatch).toBe(false);
    });

    test('navigator.userAgent — 共享 navigator，无 mismatch', async () => {
      const result = await ssrHydrateAndCompare(UaProbe);
      root = result.root;
      expect(result.hasMismatch).toBe(false);
    });

    test('new Date() 格式化 — 共享 Intl，无 mismatch', async () => {
      const result = await ssrHydrateAndCompare(DateFormatProbe);
      root = result.root;
      expect(result.hasMismatch).toBe(false);
    });
  });

  test('<ul> 嵌 <div> — 浏览器容忍此嵌套，DOM 不变 → 不应误报', async () => {
    const result = await ssrHydrateAndCompare(UlDivProbe);
    root = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  describe('onMounted 合法更新 — 首帧一致，post-hydration 更新不算 mismatch', () => {
    test('onMounted 修改 ref 值 → 不应误报', async () => {
      const result = await ssrHydrateAndCompare(MountedProbe);
      root = result.root;
      expect(result.hasMismatch).toBe(false);
    });

    test('ref(false) + onMounted 改 true → 不应误报', async () => {
      const result = await ssrHydrateAndCompare(MountedToggleProbe);
      root = result.root;
      expect(result.hasMismatch).toBe(false);
    });
  });

  test('静态组件 — SSR 和客户端完全一致 → 不应误报', async () => {
    const result = await ssrHydrateAndCompare(StaticProbe);
    root = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  // ================================================================
  // III. 已知盲区
  // ================================================================

  test('v-html 结构不同但文本相同 — 三维度均无法检测', async () => {
    vHtmlMismatchCounter = 0;
    const result = await ssrHydrateAndCompare(VHtmlMismatchProbe);
    root = result.root;
    // Vue 对 v-html(innerHTML)：hydrate 时完全不比较 innerHTML 值，
    // 不 patch DOM、不发 console.warn、不替换 Element → DOM 保持 SSR 版本不变。
    expect(result.hasMismatch).toBe(false);
    expect(result.hydrationWarnings).toEqual([]);
    expect(result.structuralMismatch).toBe(false);
  });
});

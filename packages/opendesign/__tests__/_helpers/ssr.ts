import { createSSRApp, h, type Component } from 'vue';
import { renderToString } from '@vue/server-renderer';

/**
 * SSR 渲染组件，返回 HTML 字符串。
 *
 * @description 在服务端语义下将组件渲染成 HTML 字符串，用于验证 renderToString 不抛错、输出包含预期内容。
 * 渲染完成后调用 app.unmount() 清理 effect scope，防止 setup 中启动的定时器（如 useIntervalFn）
 * 在渲染结束后继续运行，导致 Node.js 环境下 timer 回调访问 window 报错（uncaughtException）。
 * @param component Vue 组件定义
 * @param props 组件 props
 * @param slotText 默认插槽文本
 * @returns SSR HTML 字符串
 *
 * 可在浏览器或 Node 环境运行。抓的是「服务端直接报错 / 输出 HTML 不符合预期」类问题：
 *   - 模块顶层访问 window/document/localStorage 等浏览器 API
 *   - props 默认值依赖运行时环境（如 () => window.innerWidth）
 *   - CSS 变量 / style 属性序列化错误
 *   - 动态组件 <component :is> 在服务端解析失败
 */
export async function renderSSR(component: Component, props?: Record<string, unknown>, slotText?: string) {
  const app = createSSRApp({
    render: () => h(component, props, slotText ? { default: () => slotText } : undefined),
  });
  try {
    return await renderToString(app);
  } finally {
    // 清理 effect scope，确保 setup 中启动的定时器/监听器被正确释放
    app.unmount();
  }
}

/**
 * 收集指定根元素下所有后代 Element 对象的引用。
 *
 * @description 递归遍历 root 的所有后代 Element，将每个 Element 对象存入 Set。
 *   用于诊断字段 structuralMismatch 的计算：对比 hydrate 前后的 DOM 结构，
 *   正常 hydrate 保留所有 SSR Element 对象，遇到 mismatch 时 Vue 会替换 Element。
 *   此函数不参与 hasMismatch 判定，仅提供诊断信息。
 * @param root 根容器元素
 * @returns root 下所有后代 Element 的 Set（不含 root 自身）
 */
function collectElements(root: Element): Set<Element> {
  const elements = new Set<Element>();
  const walk = (el: Element) => {
    elements.add(el);
    for (const child of Array.from(el.children)) {
      walk(child);
    }
  };
  // 不收集 root 自身（root 是测试容器 div，不属于组件渲染内容）
  for (const child of Array.from(root.children)) {
    walk(child);
  }
  return elements;
}

/**
 * 对比 hydrate 前后的 Element 引用集合，计算结构性 mismatch 诊断值。
 *
 * @description 正常 hydrate（无 mismatch）时，所有 SSR DOM Element 对象在 hydrate 后仍存在。
 *   hydrate 遇到 mismatch 时，Vue 会替换 Element（旧对象从 DOM 中移除、新对象插入）。
 *   对比前后 Element 引用集合：旧对象消失或新对象出现 → 结构性 mismatch。
 *
 *   此函数为诊断字段，不参与 hasMismatch 判定。hasMismatch 仅基于 console.warn。
 *
 *   能反映的场景（Vue 替换或增删 Element 对象）：
 *   - 节点类型 mismatch：SSR 渲染 <div>，客户端渲染 <span> → Vue 替换整个 Element
 *   - 子节点数量 mismatch：SSR 渲染 N 个子节点，客户端渲染 M 个 → Vue 增删子 Element
 *   - 非法 HTML 嵌套被浏览器修正：浏览器重构 DOM → SSR Element 消失、新 Element 出现
 *   - Teleport 目标移出 root：hydrate 后 Element 从 root 移走 → root 内 Element 减少
 *
 *   无法反映的场景（Element 引用不变，Vue 不替换 Element 对象）：
 *   - class/style/普通属性 mismatch：Vue 只 patch 属性值，Element 对象引用不变
 *   - v-html 内容不同：Vue 不 patch innerHTML、不替换 Element，保留 SSR 版本
 *   - 纯文本内容 mismatch：Vue 替换文本节点（Text Node），但 Element 对象引用不变
 * @param before hydrate 前的 Element 引用集合
 * @param after hydrate 后的 Element 引用集合
 * @returns 是否存在结构性 mismatch（诊断值，不参与 hasMismatch 判定）
 */
function detectStructuralMismatch(before: Set<Element>, after: Set<Element>): boolean {
  // hydrate 前的元素在 hydrate 后消失 → 被 Vue 替换（结构性 mismatch）
  for (const el of before) {
    if (!after.has(el)) return true;
  }
  // hydrate 后出现新元素 → Vue 新增（结构性 mismatch）
  for (const el of after) {
    if (!before.has(el)) return true;
  }
  return false;
}

/**
 * SSR → 注入 DOM → hydrate → console.warn 拦截检测 mismatch。
 *
 * @description 通过拦截 Vue hydration 过程中的 console.warn 警告检测水合 mismatch。
 *   Vue 的 hydration 警告覆盖所有常见 mismatch 类型（文本值、节点类型、子节点数量、
 *   非法 HTML 嵌套、Teleport、class/style/属性 mismatch），是唯一必要的检测机制。
 *   textContent 对比和 Element 引用对比作为诊断字段保留，用于辅助定位 mismatch 类型，
 *   但不参与 hasMismatch 判定（实测表明它们的检测范围是 console.warn 的严格子集）。
 *   唯一不可突破的盲区：v-html 内容不同但文本相同。
 * @param component Vue 组件定义
 * @param props 组件 props
 * @param slotText 默认插槽文本
 * @returns 包含 mismatch 检测结果、SSR HTML、hydration 警告详情、诊断字段等
 *
 * 检测原理（console.warn 拦截为主判据）：
 *
 *   1. renderToString → SSR HTML → 注入浏览器 DOM
 *      浏览器解析 HTML 时会自动修正非法嵌套（如 <p> 嵌 <div>），导致 DOM 结构与 SSR 输出不同
 *   2. hydrate 前临时覆盖 console.warn，收集包含 "Hydration" 关键词的警告消息
 *   3. createSSRApp(...).mount(root, true) → Vue hydrate（同步）
 *      mount 是同步的，onMounted 钩子还没执行，DOM 只反映 hydrate 阶段的结果
 *      Vue 在 hydrate 中遇到 mismatch 时通过 console.warn 报告具体类型
 *      （class / style / children / text content / attribute / node mismatch）
 *   4. hydrate 后恢复原始 console.warn，分析收集到的警告
 *   5. hydrationWarnings.length > 0 → hasMismatch = true
 *
 * 诊断字段（不参与 hasMismatch 判定，供开发者辅助定位 mismatch 类型）：
 *   - textMismatch：hydrate 前后 textContent 不同（辅助定位文本类 mismatch）
 *   - structuralMismatch：hydrate 前后 Element 引用集合不同（辅助定位结构类 mismatch）
 *
 * console.warn 覆盖的 mismatch 类型：
 *   - 文本值不同： Math.random()、Date.now() → Hydration text content mismatch
 *   - 节点类型不同： SSR <div> vs 客户端 <span> → Hydration node mismatch
 *   - 子节点数量不同 → Hydration children mismatch
 *   - 非法 HTML 嵌套： 浏览器自动修正 → Hydration children mismatch
 *   - Teleport 移出 root → Hydration text content mismatch + Hydration attribute mismatch
 *   - class 属性 mismatch（check-only，Vue 只 warn 不 patch DOM）
 *   - style 属性 mismatch（check-only）
 *   - 普通属性 mismatch（title/data-testid/aria-label 等，check-only）
 *
 * 不可突破的盲区：
 *   - v-html 内容不同但文本相同（如 <b>xxx</b> vs <i>xxx</i>）
 *     Vue 对 v-html(innerHTML) 的处理：hydrate 时完全不比较 innerHTML 值，
 *     不 patch DOM（保留 SSR 版本）、不发 console.warn、不替换 Element 对象。
 *     DOM 在同步 mount 阶段完全不变 → console.warn 和诊断字段均无法检测。
 *     等 nextTick 再比较 innerHTML 会误报 onMounted 合法更新 → 此方案不可行。
 *     这是 Vue 的设计决策：v-html 内容被视为"不透明"，hydrate 时跳过 innerHTML 比较。
 *
 * 不误报的场景：
 *   - Vue SSR 注释标记（<!--v-if--> 等）→ 无 hydration warn
 *   - SVG path 内容差异 → 无 hydration warn
 *   - onMounted 合法更新 → mount 同步阶段还没执行，console.warn 无警告
 *   - 正常 hydrate（SSR 和客户端一致）→ 无 hydration warn
 *   - check-only mismatch 的 Element 不变 → Vue 只 warn 不 patch DOM
 *
 * 在 1920×1080 desktop 视口下执行，避免响应式断点导致 DOM 结构变化。
 *
 * Browser Mode 环境共享限制：SSR 和客户端在同一浏览器上下文执行，
 * typeof window / window.innerWidth / navigator.userAgent 等两端一致，
 * 无法测试真实 Node.js SSR 与客户端环境差异。
 */
export async function ssrHydrateAndCompare(component: Component, props: Record<string, unknown> = {}, slotText: string = '') {
  // 确保在 desktop 视口下执行（避免响应式断点导致 DOM 变化）
  const { page } = await import('vitest/browser');
  await page.viewport(1920, 1080);

  // Step 1: SSR 渲染
  const ssrHtml = await renderSSR(component, props, slotText);

  // Step 2: 注入 DOM + 提取 SSR textContent + 收集 Element 引用
  const root = document.createElement('div');
  root.innerHTML = ssrHtml;
  document.body.appendChild(root);
  // 浏览器解析 HTML 时可能修正非法嵌套，textContent 反映修正后的 DOM
  const ssrTextContent = root.textContent ?? '';
  // 收集 hydrate 前的 Element 引用集合（诊断字段：结构性对比）
  const preElements = collectElements(root);

  // Step 3: 拦截 console.warn，收集 Vue hydration mismatch 警告（主判据）
  // 测试代码和 Vue 在同一浏览器页面上下文，直接覆盖 console.warn 可生效
  // mount 是同步操作，Vue 在 hydrate 中同步调用 console.warn → 拦截窗口精确
  const hydrationWarnings: string[] = [];
  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    const message = args.map((a) => (typeof a === 'string' ? a : '')).join('');
    // 仅收集 Vue hydration mismatch 警告（含 "Hydration" 关键词）
    if (message.includes('Hydration')) {
      hydrationWarnings.push(message);
    }
    // 仍转发到原始 console.warn，让 vitest 正常捕获输出
    originalWarn.apply(console, args);
  };

  // Step 4: 客户端 hydrate（同步完成）
  const clientApp = createSSRApp({
    render: () => h(component, props, slotText ? { default: () => slotText } : undefined),
  });
  clientApp.mount(root, true);

  // Step 5: 恢复 console.warn + 提取 hydrated textContent + 收集 Element 引用
  console.warn = originalWarn;
  const hydratedTextContent = root.textContent ?? '';
  // 收集 hydrate 后的 Element 引用集合（诊断字段：结构性对比）
  const postElements = collectElements(root);

  // Step 6: console.warn 为主判据，textContent / Element 引用为诊断字段
  const hydrationMismatch = hydrationWarnings.length > 0;
  const structuralMismatch = detectStructuralMismatch(preElements, postElements);
  // hasMismatch 仅基于 console.warn（实测证明其覆盖所有 mismatch 类型，其余两维度为子集）
  const hasMismatch = hydrationMismatch;

  return {
    root,
    ssrHtml,
    ssrTextContent,
    hydratedTextContent,
    /** 存在 mismatch（仅基于 console.warn 判定） */
    hasMismatch,
    /** Vue hydration mismatch 警告消息列表（含 check-only 类型如 class/style mismatch） */
    hydrationWarnings,
    /** 诊断字段：Element 引用对比检测到结构性 mismatch（hydrate 前后有 Element 被替换/增删） */
    structuralMismatch,
  };
}

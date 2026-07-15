/**
 * Toggle effect 单元测试。
 *
 * 重点验证 activeClass 在 normalizeClass 重构后的行为：
 * 原始行为是 classList.add/remove(this.activeClass) 直接操作单个类名字符串。
 * 重构后使用 normalizeClass().split() 处理，对字符串型 activeClass 应保持一致行为。
 *
 * 纯 .ts 类文件，测试与源文件同级放置。
 */
import { test, expect, describe, vi } from 'vitest';
import Toggle from './toggle';
import type { EffectOptionT } from './effect';

/**
 * 创建一组模拟 slide DOM 元素和容器
 * @param count slide 数量
 * @returns slides 数组和容器元素
 */
function createMockSlides(count: number) {
  const container = document.createElement('div');
  container.style.width = '300px';
  container.style.height = '100px';
  container.style.position = 'relative';
  container.style.overflow = 'hidden';

  const slides: HTMLElement[] = [];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.style.width = '100px';
    el.style.height = '100px';
    el.style.position = 'absolute';
    el.style.left = `${i * 100}px`;
    container.appendChild(el);
    slides.push(el);
  }
  document.body.appendChild(container);

  return { slides, container };
}

/**
 * 清理 DOM 元素
 * @param container 容器元素
 */
function cleanup(container: HTMLElement) {
  container.remove();
}

/**
 * 创建 Toggle 实例并等待构造函数中的异步 active 完成
 * @description 构造函数调用 active(activeIndex, false, false) 返回 Promise，
 *   .then() 回调（微任务）设置 currentIndex。等待一个微任务确保 currentIndex 就绪。
 * @param count slide 数量
 * @param options Effect 选项
 * @returns Toggle 实例、slides 数组、container 元素
 */
async function createToggle(count: number, options?: EffectOptionT) {
  const { slides, container } = createMockSlides(count);
  const toggle = new Toggle(slides, container, 0, options);
  await Promise.resolve();
  return { toggle, slides, container };
}

describe('Toggle - 构造与基础', () => {
  test('Toggle 构造不抛出错误且正确设置 total', async () => {
    const { slides, container } = createMockSlides(3);
    const toggle = new Toggle(slides, container, 0);
    expect(toggle.total).toBe(3);
    toggle.destroyed();
    cleanup(container);
  });

  test('Toggle active - 无 activeClass 时不添加额外类', async () => {
    const { toggle, slides, container } = await createToggle(3);

    // 切换到 slide 1（非动画模式）
    await toggle.active(1, false, true);

    // 内置 CURRENT 类始终添加
    expect(slides[1].classList.contains('o-carousel-toggle-current')).toBe(true);
    expect(slides[0].classList.contains('o-carousel-toggle-current')).toBe(false);

    toggle.destroyed();
    cleanup(container);
  });
});

describe('Toggle - activeClass 字符串型（重构前后行为一致）', () => {
  test('Toggle active - activeClass 为单个字符串时正确添加到目标 slide', async () => {
    const { toggle, slides, container } = await createToggle(3, { activeClass: 'my-active' });

    await toggle.active(1, false, true);

    expect(slides[1].classList.contains('my-active')).toBe(true);
    expect(slides[0].classList.contains('my-active')).toBe(false);

    toggle.destroyed();
    cleanup(container);
  });

  test('Toggle active - 切换时从旧 slide 移除 activeClass 并添加到新 slide', async () => {
    const { toggle, slides, container } = await createToggle(3, { activeClass: 'active-slide' });

    // 构造函数已激活 slide 0（activeClass 已添加）
    expect(slides[0].classList.contains('active-slide')).toBe(true);

    // 切换到第 1 个
    await toggle.active(1, false, true);
    expect(slides[0].classList.contains('active-slide')).toBe(false);
    expect(slides[1].classList.contains('active-slide')).toBe(true);

    toggle.destroyed();
    cleanup(container);
  });

  test('Toggle active - activeClass 为含空格的多类名字符串时正确拆分添加', async () => {
    const { toggle, slides, container } = await createToggle(3, { activeClass: 'active highlighted' });

    await toggle.active(1, false, true);

    // 原始行为：classList.add("active highlighted") 不会正确添加含空格的类名
    // 重构后：normalizeClass 拆分为 ["active", "highlighted"]，两个类都应存在
    expect(slides[1].classList.contains('active')).toBe(true);
    expect(slides[1].classList.contains('highlighted')).toBe(true);
    expect(slides[0].classList.contains('active')).toBe(false);
    expect(slides[0].classList.contains('highlighted')).toBe(false);

    toggle.destroyed();
    cleanup(container);
  });

  test('Toggle active - 切换多类名 activeClass 时从旧 slide 移除全部', async () => {
    const { toggle, slides, container } = await createToggle(3, { activeClass: 'active highlighted' });

    // 构造函数已激活 slide 0（activeClass 已添加）
    expect(slides[0].classList.contains('active')).toBe(true);
    expect(slides[0].classList.contains('highlighted')).toBe(true);

    await toggle.active(2, false, true);
    expect(slides[0].classList.contains('active')).toBe(false);
    expect(slides[0].classList.contains('highlighted')).toBe(false);
    expect(slides[2].classList.contains('active')).toBe(true);
    expect(slides[2].classList.contains('highlighted')).toBe(true);

    toggle.destroyed();
    cleanup(container);
  });

  test('Toggle active - activeClass 为对象形式时正确解析 truthy 键', async () => {
    const { toggle, slides, container } = await createToggle(3, {
      activeClass: { 'obj-active': true, 'obj-inactive': false },
    });

    await toggle.active(1, false, true);

    expect(slides[1].classList.contains('obj-active')).toBe(true);
    expect(slides[1].classList.contains('obj-inactive')).toBe(false);

    toggle.destroyed();
    cleanup(container);
  });

  test('Toggle active - activeClass 为数组形式时正确展开', async () => {
    const { toggle, slides, container } = await createToggle(3, {
      activeClass: ['arr-active-1', { 'arr-active-2': true }],
    });

    await toggle.active(1, false, true);

    expect(slides[1].classList.contains('arr-active-1')).toBe(true);
    expect(slides[1].classList.contains('arr-active-2')).toBe(true);

    toggle.destroyed();
    cleanup(container);
  });
});

describe('Toggle - onChanged 回调', () => {
  test('Toggle active - 非动画模式下切换成功后触发 onChanged 回调', async () => {
    const onChanged = vi.fn();
    const { toggle, slides, container } = await createToggle(3, { onChanged });

    await toggle.active(1, false, true);
    expect(onChanged).toHaveBeenCalledWith(1, 0);

    toggle.destroyed();
    cleanup(container);
  });
});

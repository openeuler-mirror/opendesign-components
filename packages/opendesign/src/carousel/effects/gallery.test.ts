/**
 * Gallery effect 单元测试。
 *
 * 重点验证 activeClass 在 normalizeClass 重构后的行为：
 * 原始行为是 classList.add/remove(this.activeClass) 直接操作单个类名字符串。
 * 重构后使用 normalizeClass().split() 处理，对字符串型 activeClass 应保持一致行为。
 *
 * 纯 .ts 类文件，测试与源文件同级放置。
 */
import { test, expect, describe, vi } from 'vitest';
import Gallery from './gallery';
import type { GalleryOptionT } from './gallery';

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
 * 创建 Gallery 实例并手动初始化 slideList
 * @description Gallery 的 slideList 由 ResizeObserver 异步回调填充，
 *   手动调用 update 确保数据就绪后再测试 active 行为
 * @param count slide 数量
 * @param options Gallery 选项
 * @returns Gallery 实例、slides 数组、container 元素
 */
function createGallery(count: number, options?: GalleryOptionT) {
  const { slides, container } = createMockSlides(count);
  const gallery = new Gallery(slides, container, 0, options);
  gallery.update(slides, container);
  return { gallery, slides, container };
}

describe('Gallery - 构造与基础', () => {
  test('Gallery 构造不抛出错误且正确设置 total', async () => {
    const { slides, container } = createMockSlides(3);
    const options: GalleryOptionT = { alignType: 'center' };
    const gallery = new Gallery(slides, container, 0, options);
    expect(gallery.total).toBe(3);
    gallery.destroyed();
    cleanup(container);
  });

  test('Gallery active - 无 activeClass 时不添加额外类', async () => {
    const { gallery, slides, container } = createGallery(3);
    await gallery.active(1, false, true);
    // 内置 CURRENT 类始终添加
    expect(slides[1].classList.contains('o-carousel-toggle-current')).toBe(true);
    gallery.destroyed();
    cleanup(container);
  });
});

describe('Gallery - activeClass 字符串型（重构前后行为一致）', () => {
  test('Gallery active - activeClass 为单个字符串时正确添加到目标 slide', async () => {
    const { gallery, slides, container } = createGallery(3, { activeClass: 'my-active' });

    await gallery.active(1, false, true);

    // 目标 slide 应有 activeClass
    expect(slides[1].classList.contains('my-active')).toBe(true);
    // 源 slide 不应有 activeClass
    expect(slides[0].classList.contains('my-active')).toBe(false);

    gallery.destroyed();
    cleanup(container);
  });

  test('Gallery active - 切换时从旧 slide 移除 activeClass 并添加到新 slide', async () => {
    const { gallery, slides, container } = createGallery(3, { activeClass: 'active-slide' });

    // 先激活第 0 个
    await gallery.active(0, false, true);
    expect(slides[0].classList.contains('active-slide')).toBe(true);

    // 切换到第 1 个
    await gallery.active(1, false, true);
    expect(slides[0].classList.contains('active-slide')).toBe(false);
    expect(slides[1].classList.contains('active-slide')).toBe(true);

    gallery.destroyed();
    cleanup(container);
  });

  test('Gallery active - activeClass 为含空格的多类名字符串时正确拆分添加', async () => {
    const { gallery, slides, container } = createGallery(3, { activeClass: 'active highlighted' });

    await gallery.active(1, false, true);

    // 原始行为：classList.add("active highlighted") 在现代浏览器中不会正确添加含空格的类名
    // 重构后：normalizeClass 拆分为 ["active", "highlighted"]，两个类都应存在
    // 此测试验证重构后的行为是正确的
    expect(slides[1].classList.contains('active')).toBe(true);
    expect(slides[1].classList.contains('highlighted')).toBe(true);
    expect(slides[0].classList.contains('active')).toBe(false);
    expect(slides[0].classList.contains('highlighted')).toBe(false);

    gallery.destroyed();
    cleanup(container);
  });

  test('Gallery active - 切换多类名 activeClass 时从旧 slide 移除全部', async () => {
    const { gallery, slides, container } = createGallery(3, { activeClass: 'active highlighted' });

    await gallery.active(0, false, true);
    expect(slides[0].classList.contains('active')).toBe(true);
    expect(slides[0].classList.contains('highlighted')).toBe(true);

    await gallery.active(2, false, true);
    expect(slides[0].classList.contains('active')).toBe(false);
    expect(slides[0].classList.contains('highlighted')).toBe(false);
    expect(slides[2].classList.contains('active')).toBe(true);
    expect(slides[2].classList.contains('highlighted')).toBe(true);

    gallery.destroyed();
    cleanup(container);
  });

  test('Gallery active - activeClass 为对象形式时正确解析 truthy 键', async () => {
    const { gallery, slides, container } = createGallery(3, {
      activeClass: { 'obj-active': true, 'obj-inactive': false },
    });

    await gallery.active(1, false, true);

    // normalizeClass 会解析对象：truthy 键保留，falsy 键去除
    expect(slides[1].classList.contains('obj-active')).toBe(true);
    expect(slides[1].classList.contains('obj-inactive')).toBe(false);

    gallery.destroyed();
    cleanup(container);
  });

  test('Gallery active - activeClass 为数组形式时正确展开', async () => {
    const { gallery, slides, container } = createGallery(3, {
      activeClass: ['arr-active-1', { 'arr-active-2': true }],
    });

    await gallery.active(1, false, true);

    expect(slides[1].classList.contains('arr-active-1')).toBe(true);
    expect(slides[1].classList.contains('arr-active-2')).toBe(true);

    gallery.destroyed();
    cleanup(container);
  });
});

describe('Gallery - onChanged 回调', () => {
  test('Gallery active - 切换成功后触发 onChanged 回调', async () => {
    const onChanged = vi.fn();
    const { gallery, slides, container } = createGallery(3, { onChanged });

    // 先激活第 0 个，设置初始 currentIndex=0
    await gallery.active(0, false, true);
    // 再切换到第 1 个，触发 onChanged(1, 0)
    await gallery.active(1, false, true);
    expect(onChanged).toHaveBeenCalledWith(1, 0);

    gallery.destroyed();
    cleanup(container);
  });
});

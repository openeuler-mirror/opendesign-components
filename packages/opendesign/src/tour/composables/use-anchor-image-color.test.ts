/**
 * tour/composables/use-anchor-image-color.ts 箭头图片像素采样测试。
 *
 * 验证维度：
 *   1. coverCrop：object-fit:cover 裁剪参数（横图 / 竖图 / 方图 / 零尺寸）
 *   2. sampleAnchorColor：箭头中心点在图片上时返回对应像素色；无图片 / 箭头越界 / 图片加载失败 / canvas 污染时返回 null
 *
 * 采样基于一份带 crossOrigin 的副本图片，使用 data URI（同源、不污染 canvas）可确定性触发 onSuccess 路径。
 */
import { test, expect, describe, beforeEach, vi } from 'vitest';
import { coverCrop, loadCleanImage, sampleAnchorColor, __resetCleanImageCacheForTest } from './use-anchor-image-color';

/** 等待微任务 + 两帧，确保副本图片 onload 与 RAF 完成 */
function waitFrames(n = 2) {
  return new Promise<void>((r) => {
    const step = (left: number) => {
      if (left <= 0) {
        r();
        return;
      }
      requestAnimationFrame(() => step(left - 1));
    };
    step(n);
  });
}

/** 生成一张指定纯色、指定尺寸的 data URI 图片（同源，可安全用于 canvas） */
function solidDataUrl(color: string, size = 10): string {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, size, size);
  return c.toDataURL();
}

/** 构造一个 Tour 根 DOM：图片 + 箭头（箭头中心默认落在图片内） */
function buildRoot(opts: { imgSrc?: string; arrowLeft?: number; arrowTop?: number } = {}) {
  const root = document.createElement('div');
  root.className = 'o-tour';
  root.style.cssText = 'position:absolute; left:0; top:0; width:300px;';

  const img = document.createElement('img');
  img.className = 'o-tour-img';
  img.src = opts.imgSrc ?? solidDataUrl('rgb(255, 0, 0)');
  img.style.cssText = 'display:block; width:300px; height:100px; object-fit:cover;';
  root.appendChild(img);

  // 箭头 8x8，中心点 = left+4, top+4；默认落在图片左上区域内
  const arrow = document.createElement('div');
  arrow.className = 'o-popup-anchor';
  const left = opts.arrowLeft ?? 50;
  const top = opts.arrowTop ?? 0;
  arrow.style.cssText = `position:absolute; left:${left}px; top:${top}px; width:8px; height:8px;`;
  root.appendChild(arrow);

  document.body.appendChild(root);
  return { root, img, arrow };
}

describe('coverCrop', () => {
  test('coverCrop - 横图填满宽，高度居中裁剪', () => {
    // 源 200x100，渲染 300x100：scale = max(1.5, 1) = 1.5，sw = 200, sh = 100/1.5 ≈ 66.67
    const { sx, sy, sw, sh } = coverCrop(200, 100, 300, 100);
    expect(sw).toBeCloseTo(200, 5);
    expect(sh).toBeCloseTo(66.6667, 3);
    expect(sx).toBeCloseTo(0, 5);
    expect(sy).toBeCloseTo((100 - 66.6667) / 2, 3);
  });

  test('coverCrop - 竖图填满高，宽度居中裁剪', () => {
    // 源 100x200，渲染 100x300：scale = max(1, 1.5) = 1.5，sw = 100/1.5 ≈ 66.67, sh = 200
    const { sx, sy, sw, sh } = coverCrop(100, 200, 100, 300);
    expect(sw).toBeCloseTo(66.6667, 3);
    expect(sh).toBeCloseTo(200, 5);
    expect(sx).toBeCloseTo((100 - 66.6667) / 2, 3);
    expect(sy).toBeCloseTo(0, 5);
  });

  test('coverCrop - 方图等比填满，无裁剪', () => {
    const { sx, sy, sw, sh } = coverCrop(100, 100, 200, 200);
    expect(sw).toBeCloseTo(100, 5);
    expect(sh).toBeCloseTo(100, 5);
    expect(sx).toBeCloseTo(0, 5);
    expect(sy).toBeCloseTo(0, 5);
  });

  test('coverCrop - 任一维为 0 时返回全图，避免除零', () => {
    const r = coverCrop(0, 100, 100, 100);
    expect(r).toEqual({ sx: 0, sy: 0, sw: 0, sh: 100 });
    const r2 = coverCrop(100, 100, 0, 100);
    expect(r2).toEqual({ sx: 0, sy: 0, sw: 100, sh: 100 });
  });
});

describe('sampleAnchorColor', () => {
  beforeEach(() => {
    __resetCleanImageCacheForTest();
    document.body.innerHTML = '';
  });

  test('sampleAnchorColor - 箭头中心在红色图片上时返回 rgb(255, 0, 0)', async () => {
    const { root } = buildRoot({ imgSrc: solidDataUrl('rgb(255, 0, 0)') });
    // 等待副本图片加载
    await loadCleanImage((root.querySelector('.o-tour-img') as HTMLImageElement).src);
    const color = await sampleAnchorColor(root);
    expect(color).toBe('rgb(255, 0, 0)');
  });

  test('sampleAnchorColor - 蓝色图片返回 rgb(0, 0, 255)', async () => {
    const { root } = buildRoot({ imgSrc: solidDataUrl('rgb(0, 0, 255)') });
    await loadCleanImage((root.querySelector('.o-tour-img') as HTMLImageElement).src);
    const color = await sampleAnchorColor(root);
    expect(color).toBe('rgb(0, 0, 255)');
  });

  test('sampleAnchorColor - 无图片元素时返回 null', async () => {
    const root = document.createElement('div');
    root.className = 'o-tour';
    const arrow = document.createElement('div');
    arrow.className = 'o-popup-anchor';
    root.appendChild(arrow);
    document.body.appendChild(root);
    expect(await sampleAnchorColor(root)).toBeNull();
  });

  test('sampleAnchorColor - 箭头中心在图片范围外（指向页脚侧）时返回 null', async () => {
    // 图片高 100，箭头 top=200 使中心 py≈204 越界
    const { root } = buildRoot({ arrowTop: 200 });
    await loadCleanImage((root.querySelector('.o-tour-img') as HTMLImageElement).src);
    expect(await sampleAnchorColor(root)).toBeNull();
  });

  test('sampleAnchorColor - 副本图片加载失败（跨域拒绝）时返回 null', async () => {
    // 损坏的 data URI 触发 onerror，loadCleanImage 解析为 null
    const { root } = buildRoot({ imgSrc: 'data:image/png;base64,!!!invalid!!!' });
    expect(await sampleAnchorColor(root)).toBeNull();
  });

  test('sampleAnchorColor - canvas 被污染（getImageData 抛错）时返回 null', async () => {
    const { root } = buildRoot({ imgSrc: solidDataUrl('rgb(255, 0, 0)') });
    await loadCleanImage((root.querySelector('.o-tour-img') as HTMLImageElement).src);
    // 模拟跨域图片污染 canvas
    const spy = vi.spyOn(CanvasRenderingContext2D.prototype, 'getImageData').mockImplementation(() => {
      throw new DOMException('The canvas has been tainted by cross-origin data.', 'SecurityError');
    });
    try {
      expect(await sampleAnchorColor(root)).toBeNull();
    } finally {
      spy.mockRestore();
    }
  });

  test('sampleAnchorColor - 无 2D 上下文时返回 null', async () => {
    const { root } = buildRoot({ imgSrc: solidDataUrl('rgb(255, 0, 0)') });
    await loadCleanImage((root.querySelector('.o-tour-img') as HTMLImageElement).src);
    const spy = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    try {
      expect(await sampleAnchorColor(root)).toBeNull();
    } finally {
      spy.mockRestore();
    }
  });
});

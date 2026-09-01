import { nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';
import { throttleRAF } from '../../_utils/helper';
import type { TourStepPropsT } from '../types';

/** 箭头采样上下文：传入 Tour 的显隐、当前步骤与根元素引用 */
interface AnchorColorCtx {
  /** 是否显示 Tour，仅 visible 时才采样 */
  visible: Ref<boolean>;
  /** 当前步骤数据（含 img / position） */
  currentStep: Ref<TourStepPropsT | undefined>;
  /** Tour 根元素引用，用于查询 .o-tour-img 与 .o-popup-anchor */
  rootEl: Ref<HTMLElement | null>;
}

/**
 * @description 计算 object-fit:cover 下源图到渲染区的裁剪参数
 *
 * cover 的语义为「按较短边填满、较长边居中裁剪」：取 scale 为 rw/nw 与 rh/nh 的较大值，
 * 使源图按该比例缩放后至少有一维等于渲染尺寸；再在另一维上居中裁出渲染尺寸的源切片。
 *
 * @param nw - 源图自然宽度
 * @param nh - 源图自然高度
 * @param rw - 渲染宽度（目标盒宽）
 * @param rh - 渲染高度（目标盒高）
 * @returns drawImage 的源裁剪参数 { sx, sy, sw, sh }，任一维为 0 时返回全图
 */
export function coverCrop(nw: number, nh: number, rw: number, rh: number) {
  if (!nw || !nh || !rw || !rh) {
    return { sx: 0, sy: 0, sw: nw, sh: nh };
  }
  const scale = Math.max(rw / nw, rh / nh);
  const sw = rw / scale;
  const sh = rh / scale;
  return { sx: (nw - sw) / 2, sy: (nh - sh) / 2, sw, sh };
}

/** 已解码的「干净」图片（CORS 通过），失败时缓存 null 以避免重复请求 */
const cleanImageCache = new Map<string, Promise<HTMLImageElement | null>>();

/**
 * @description 加载一份与展示用 `<img>` 同源、但带 `crossOrigin=anonymous` 的副本图片
 *
 * 直接在展示用 `<img>` 上加 `crossorigin` 属性有风险：若图片服务器未返回 CORS 头，
 * 图片会加载失败导致 Tour 不显示图片。改为额外加载一份带 `crossOrigin` 的副本：
 * - 服务器支持 CORS → 加载成功，可安全用于 canvas 采样；
 * - 服务器不支持 / 网络失败 → onerror → resolve(null)，由调用方回退到默认色。
 * 展示用 `<img>` 始终不受影响，保证图片正常显示。结果按 src 缓存避免滚动时重复请求。
 *
 * @param src - 图片地址
 * @returns 解码完成的图片元素，加载失败时返回 null
 */
export function loadCleanImage(src: string): Promise<HTMLImageElement | null> {
  const cached = cleanImageCache.get(src);
  if (cached) return cached;
  const p = new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
  cleanImageCache.set(src, p);
  return p;
}

/** 测试用：清空图片缓存，避免用例间相互干扰 */
export function __resetCleanImageCacheForTest() {
  cleanImageCache.clear();
}

/** 箭头中心点相对图片左上的渲染坐标，越界时返回 null */
interface ImagePoint {
  px: number;
  py: number;
}

/**
 * @description 计算箭头中心点在图片渲染区内的坐标
 * @param img - 展示图片元素
 * @param arrow - 箭头元素
 * @returns 图片内坐标 { px, py }，箭头中心不在图片范围内时返回 null
 */
function getAnchorPointInImage(img: HTMLElement, arrow: HTMLElement): ImagePoint | null {
  const iRect = img.getBoundingClientRect();
  const aRect = arrow.getBoundingClientRect();
  const px = aRect.left + aRect.width / 2 - iRect.left;
  const py = aRect.top + aRect.height / 2 - iRect.top;
  if (px < 0 || py < 0 || px > iRect.width || py > iRect.height) return null;
  return { px, py };
}

/**
 * @description 按图片渲染区尺寸绘制 cover 裁剪后的副本图，读取指定像素点颜色
 * @param clean - 已加载的 CORS 副本图片
 * @param iRect - 展示图片的渲染矩形
 * @param px - 像素 X 坐标（图片内）
 * @param py - 像素 Y 坐标（图片内）
 * @returns `rgb(r, g, b)` 字符串，canvas 污染或无上下文时返回 null
 */
function readPixel(clean: HTMLImageElement, iRect: DOMRect, px: number, py: number): string | null {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(iRect.width));
  canvas.height = Math.max(1, Math.round(iRect.height));
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  const { sx, sy, sw, sh } = coverCrop(clean.naturalWidth, clean.naturalHeight, iRect.width, iRect.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  try {
    ctx.drawImage(clean, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    const d = ctx.getImageData(Math.round(px), Math.round(py), 1, 1).data;
    return `rgb(${d[0]}, ${d[1]}, ${d[2]})`;
  } catch {
    // canvas 被跨域图片污染（getImageData 抛 SecurityError）→ 回退
    return null;
  }
}

/**
 * @description 采样箭头中心点在 Tour 图片上的像素色
 *
 * 流程：
 * 1. 在 Tour 根内查询展示图片 `.o-tour-img` 与箭头 `.o-popup-anchor`；
 * 2. 计算箭头中心点相对图片左上的渲染坐标 (px, py)，若不在图片范围内则返回 null（如箭头指向页脚侧）；
 * 3. 加载一份带 CORS 的副本图片，按 object-fit:cover 语义绘制到离屏 canvas；
 * 4. 读取 (px, py) 处像素并返回 `rgb(r, g, b)`。
 *
 * 任一步骤失败（无图片 / 副本加载失败 / canvas 被污染 / 无 2D 上下文）均返回 null，
 * 由调用方回退到默认 `--popup-bg-color`。
 *
 * @param root - Tour 根元素
 * @returns 像素色字符串，或 null 表示回退
 */
export async function sampleAnchorColor(root: HTMLElement): Promise<string | null> {
  const img = root.querySelector<HTMLImageElement>('.o-tour-img');
  const arrow = root.querySelector<HTMLElement>('.o-popup-anchor');
  if (!img || !arrow || !img.src) return null;

  const point = getAnchorPointInImage(img, arrow);
  if (!point) return null;

  const clean = await loadCleanImage(img.src);
  if (!clean || !clean.naturalWidth) return null;

  return readPixel(clean, img.getBoundingClientRect(), point.px, point.py);
}

/**
 * @description 采样箭头中心点像素色并写入 `--_tour-anchor-bg` CSS 变量
 *
 * 采样时机：步骤切换 / 显隐切换后 nextTick + RAF；挂载后立即采一次；
 * 滚动 / resize 时通过 throttleRAF 节流重采（箭头随 target 滚动而水平移动，对应像素色可能变化）。
 * 失败时 anchorBg 为 null，由 SCSS `var(--_tour-anchor-bg, var(--popup-bg-color))` 回退到默认色。
 *
 * @returns anchorBg - 箭头背景色 ref，null 表示回退
 */
export function useAnchorImageColor({ visible, currentStep, rootEl }: AnchorColorCtx) {
  /** 箭头背景色 CSS 变量值，null 表示回退到默认 */
  const anchorBg = ref<string | null>(null);

  const sample = throttleRAF(() => {
    const root = rootEl.value;
    if (!root || !visible.value) {
      anchorBg.value = null;
      return;
    }
    sampleAnchorColor(root).then((color) => {
      // 异步返回期间若已隐藏，不再写入，避免覆盖回退态
      if (!visible.value) {
        anchorBg.value = null;
        return;
      }
      anchorBg.value = color;
    });
  });

  watch([visible, () => currentStep.value?.img, () => currentStep.value?.position], () => {
    nextTick(sample);
  });

  onMounted(() => {
    window.addEventListener('scroll', sample, { passive: true });
    window.addEventListener('resize', sample);
    sample();
  });

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', sample);
    window.removeEventListener('resize', sample);
    sample.cancel();
  });

  return { anchorBg };
}

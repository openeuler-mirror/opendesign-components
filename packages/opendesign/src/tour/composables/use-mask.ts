import { computed } from 'vue';
import { useWindowSize } from '@vueuse/core';
import type { CSSProperties, Ref } from 'vue';
import type { PosInfo } from '../types';

/**
 * @description 计算 SVG 遮罩镂空路径和样式
 * @param pos - 目标区域位置信息
 * @param zIndex - 层级
 */
export function useMask(pos: Ref<PosInfo | null>, zIndex: Ref<number>) {
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  /**
   * @description 圆角弧线信息
   */
  const roundInfo = computed(() => {
    const v = pos.value?.radius ?? 2;
    const base = `a${v},${v} 0 0 1`;
    return {
      topRight: `${base} ${v},${v}`,
      bottomRight: `${base} ${-v},${v}`,
      bottomLeft: `${base} ${-v},${-v}`,
      topLeft: `${base} ${v},${-v}`,
    };
  });

  /**
   * @description SVG viewBox，使路径坐标与视口像素对齐
   */
  const viewBox = computed(() => `0 0 ${windowWidth.value} ${windowHeight.value}`);

  const path = computed(() => {
    const w = windowWidth.value;
    const h = windowHeight.value;
    const info = roundInfo.value;
    const r = pos.value?.radius ?? 2;
    const outerPath = `M${w},0 L0,0 L0,${h} L${w},${h} L${w},0 Z`;
    if (!pos.value) return outerPath;
    const p = pos.value;
    return `${outerPath} M${p.left + r},${p.top} h${p.width - r * 2} ${info.topRight} v${p.height - r * 2} ${info.bottomRight} h${-p.width + r * 2} ${info.bottomLeft} v${-p.height + r * 2} ${info.topLeft} z`;
  });

  const maskStyle = computed<CSSProperties>(() => ({
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: zIndex.value,
  }));

  const pathStyle = computed<CSSProperties>(() => ({
    fill: 'var(--tour-mask-fill)',
    fillRule: 'evenodd',
    pointerEvents: 'auto',
    cursor: 'auto',
  }));

  return { path, maskStyle, pathStyle, viewBox };
}

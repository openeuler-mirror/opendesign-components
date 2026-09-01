import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { isFunction, isString } from '../../_utils/is';
import type { Ref } from 'vue';
import type { PosInfo } from '../types';
import type { VirtualElement } from '../../popup/types';

/** 默认镂空圆角半径（px），未配置或值非法时回退 */
const DEFAULT_SPOTLIGHT_RADIUS = 4;

/**
 * @description 将 CSS 长度字符串解析为像素数值，支持 '12px'、'var(--o-radius-l)' 等任意 CSS 长度
 * @param raw - CSS 长度值字符串
 * @returns 像素数值，解析失败回退默认值
 */
function measureCssLengthPx(raw: string): number {
  // SSR 环境无 document，回退默认值
  if (typeof document === 'undefined') {
    return DEFAULT_SPOTLIGHT_RADIUS;
  }
  const probe = document.createElement('div');
  // inline-block 无内容时自然宽度为 0，非法值被忽略后回退 0 而非撑满容器
  probe.style.cssText = `position:absolute;left:-9999px;top:-9999px;display:inline-block;width:${raw};height:0;visibility:hidden;`;
  document.body.appendChild(probe);
  const px = parseFloat(getComputedStyle(probe).width);
  probe.remove();
  return Number.isFinite(px) ? px : DEFAULT_SPOTLIGHT_RADIUS;
}

/**
 * @description 判断元素是否在视口内
 * @param element - 目标元素
 * @returns 是否在视口内
 */
function isInViewPort(element: HTMLElement): boolean {
  const viewWidth = window.innerWidth || document.documentElement.clientWidth;
  const viewHeight = window.innerHeight || document.documentElement.clientHeight;
  const { top, right, bottom, left } = element.getBoundingClientRect();
  return top >= 0 && left >= 0 && right <= viewWidth && bottom <= viewHeight;
}

/**
 * @description 解析 target 并计算镂空位置信息
 * @param target - 目标元素引用
 * @param open - 是否打开
 * @param spotlightPadding - 间隙偏移量
 * @param spotlightRadius - 镂空圆角，支持 'pill' 或 '8px'
 * @param mergedMask - 合并后的遮罩配置
 */
export function useTarget(
  target: Ref<string | HTMLElement | (() => HTMLElement | null) | null | undefined>,
  open: Ref<boolean>,
  spotlightPadding: Ref<number>,
  spotlightRadius: Ref<'pill' | '8px' | undefined>,
  mergedMask: Ref<boolean>,
) {
  const posInfo: Ref<PosInfo | null> = ref(null);

  /**
   * @description 非 pill 的 spotlightRadius 预解析为像素数值；'pill' 由 mergedPosInfo 按镂空尺寸计算
   */
  const spotlightRadiusPx = ref<number>(DEFAULT_SPOTLIGHT_RADIUS);
  watch(
    spotlightRadius,
    (raw) => {
      if (raw === undefined || raw === '' || raw === 'pill') {
        spotlightRadiusPx.value = DEFAULT_SPOTLIGHT_RADIUS;
        return;
      }
      // '8px' 解析为像素值；'pill' 由 mergedPosInfo 按镂空尺寸计算
      spotlightRadiusPx.value = measureCssLengthPx(raw);
    },
    { immediate: true },
  );

  /**
   * @description 获取目标元素
   */
  const getTargetEl = (): HTMLElement | null | undefined => {
    if (isString(target.value)) {
      return document.querySelector<HTMLElement>(target.value);
    }
    if (isFunction(target.value)) {
      return target.value();
    }
    return target.value;
  };

  /**
   * @description 更新目标元素的位置信息
   */
  const updatePosInfo = () => {
    const targetEl = getTargetEl();
    if (!targetEl || !open.value) {
      posInfo.value = null;
      return;
    }
    if (!isInViewPort(targetEl)) {
      targetEl.scrollIntoView({ block: 'center' });
    }
    const { left, top, width, height } = targetEl.getBoundingClientRect();
    posInfo.value = { left, top, width, height, radius: 0 };
  };

  watch([open, target], () => updatePosInfo());

  onMounted(() => {
    updatePosInfo();
    window.addEventListener('resize', updatePosInfo);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updatePosInfo);
  });

  const mergedPosInfo = computed(() => {
    if (!posInfo.value) return posInfo.value;
    const gap = spotlightPadding.value;
    const width = posInfo.value.width + gap * 2;
    const height = posInfo.value.height + gap * 2;
    // pill：胶囊形，圆角取短边一半，保证两侧为半圆且不超出宽高；其余用预解析像素值
    const radius = spotlightRadius.value === 'pill' ? Math.floor(Math.min(width, height) / 2) : spotlightRadiusPx.value;
    return {
      left: posInfo.value.left - gap,
      top: posInfo.value.top - gap,
      width,
      height,
      radius,
    };
  });

  /**
   * @description 虚拟触发元素，提供给 OPopup 的 targetRect。
   * 始终返回 VirtualElement：有遮罩时用含间隙的区域，无遮罩时委托真实元素的 getBoundingClientRect。
   */
  const triggerTarget = computed<VirtualElement | undefined>(() => {
    const targetEl = getTargetEl();
    if (!targetEl || typeof window === 'undefined') {
      return undefined;
    }
    if (!mergedMask.value) {
      // 无遮罩时委托真实元素，保持 VirtualElement 类型一致
      return { getBoundingClientRect: () => targetEl.getBoundingClientRect() };
    }
    return {
      getBoundingClientRect() {
        return new DOMRect(mergedPosInfo.value?.left || 0, mergedPosInfo.value?.top || 0, mergedPosInfo.value?.width || 0, mergedPosInfo.value?.height || 0);
      },
    };
  });

  return { mergedPosInfo, triggerTarget, getTargetEl };
}

/**
 * 定义全局图标，支持全局初始化自定义
 */
import { Component } from 'vue';
import {
  IconLoading,
  IconLinkPrefix,
  IconLinkArrow,
  IconClose,
  IconAdd,
  IconMinus,
  IconDone,
  IconChevronUp,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconEllipsis,
  IconStar,
} from './icons';

/**
 * 全局loading图标
 */
export function initIconLoading(icon: Component) {
  IconLoading.value = icon;
}

/**
 * link前缀图标
 */
export function initIconLinkPrefix(icon: Component) {
  IconLinkPrefix.value = icon;
}

/**
 * link箭头图标
 */
export function initIconLinkArrow(icon: Component) {
  IconLinkArrow.value = icon;
}

/**
 * close图标
 */
export function initIconClose(icon: Component) {
  IconClose.value = icon;
}

/**
 * add图标
 */
export function initIconAdd(icon: Component) {
  IconAdd.value = icon;
}

/**
 * minus图标
 */
export function initIconMinus(icon: Component) {
  IconMinus.value = icon;
}

/**
 * up图标
 */
export function initIconChevronUp(icon: Component) {
  IconChevronUp.value = icon;
}

/**
 * down图标
 */
export function initIconChevronDown(icon: Component) {
  IconChevronDown.value = icon;
}

/**
 * left图标
 */
export function initIconChevronLeft(icon: Component) {
  IconChevronLeft.value = icon;
}

/**
 * right图标
 */
export function initIconChevronRight(icon: Component) {
  IconChevronRight.value = icon;
}

/**
 * done图标
 */
export function initIconDone(icon: Component) {
  IconDone.value = icon;
}
/**
 * 更多...图标
 */
export function initIconEllipsis(icon: Component) {
  IconEllipsis.value = icon;
}
/**
 * star图标
 */
export function initIconStar(icon: Component) {
  IconStar.value = icon;
}

/**
 * 定义全局图标，支持全局初始化自定义
 */
import { Component, shallowRef } from 'vue';
import {
  IconLoading as _IconLoading,
  IconLink as IconLink,
  IconArrowRight
} from '../icons';

/**
 * 全局loading图标
 */
export const IconLoading = shallowRef<Component>(_IconLoading);
export function initLoadingIcon(icon: Component) {
  IconLoading.value = icon;
}

/**
 * link前缀图标
 */
export const IconLinkPrefix = shallowRef<Component>(IconLink);
export function initLinkPrefixIcon(icon: Component) {
  IconLinkPrefix.value = icon;
}

/**
 * link箭头图标
 */
export const IconLinkArrow = shallowRef<Component>(IconArrowRight);
export function initLinkArrowIcon(icon: Component) {
  IconLinkArrow.value = icon;
}
/**
 * 定义全局图标，支持全局初始化自定义
 */
import { Component, shallowRef } from 'vue';
import {
  IconLoading as _IconLoading,
  IconLink as IconLink,
  IconArrowRight,
  IconX,
  IconAdd as _IconAdd,
  IconMinus as _IconMinus,
  IconDone as _IconDone,
  IconChevronUp as _IconChevronUp,
  IconChevronDown as _IconChevronDown,
  IconChevronLeft as _IconChevronLeft,
  IconChevronRight as _IconChevronRight,
  IconEllipsis as _IconEllipsis,
  IconStar as _IconStar
} from '../icons';

/**
 * 全局loading图标
 */
export const IconLoading = shallowRef<Component>(_IconLoading);

/**
 * link前缀图标
 */
export const IconLinkPrefix = shallowRef<Component>(IconLink);

/**
 * link箭头图标
 */
export const IconLinkArrow = shallowRef<Component>(IconArrowRight);

/**
 * close图标
 */
export const IconClose = shallowRef<Component>(IconX);

/**
 * add图标
 */
export const IconAdd = shallowRef<Component>(_IconAdd);

/**
 * minus图标
 */
export const IconMinus = shallowRef<Component>(_IconMinus);

/**
 * up图标
 */
export const IconChevronUp = shallowRef<Component>(_IconChevronUp);

/**
 * down图标
 */
export const IconChevronDown = shallowRef<Component>(_IconChevronDown);

/**
 * left图标
 */
export const IconChevronLeft = shallowRef<Component>(_IconChevronLeft);

/**
 * right图标
 */
export const IconChevronRight = shallowRef<Component>(_IconChevronRight);

/**
 * done图标
 */
export const IconDone = shallowRef<Component>(_IconDone);

/**
 * 更多...图标
 */
export const IconEllipsis = shallowRef<Component>(_IconEllipsis);

/**
 * star图标
 */
export const IconStar = shallowRef<Component>(_IconStar);

/**
 * 定义全局图标，支持全局初始化自定义
 */
import { Component, shallowRef } from 'vue';
import {
  OIconLoading,
  OIconLink,
  OIconArrowRight,
  OIconX,
  OIconAdd,
  OIconMinus,
  OIconDone,
  OIconChevronUp,
  OIconChevronDown,
  OIconChevronLeft,
  OIconChevronRight,
  OIconEllipsis,
  OIconStar,
  OIconRefresh,
  OIconDelete,
  OIconEye,
  OIconEyeOff,
  OIconFile,
  OIconEdit,
  OIconImageError,
} from '../icon-components';

/**
 * 全局loading图标
 */
export const IconLoading = shallowRef<Component>(OIconLoading);

/**
 * link前缀图标
 */
export const IconLinkPrefix = shallowRef<Component>(OIconLink);

/**
 * link箭头图标
 */
export const IconLinkArrow = shallowRef<Component>(OIconArrowRight);

/**
 * close图标
 */
export const IconClose = shallowRef<Component>(OIconX);

/**
 * add图标
 */
export const IconAdd = shallowRef<Component>(OIconAdd);

/**
 * minus图标
 */
export const IconMinus = shallowRef<Component>(OIconMinus);

/**
 * up图标
 */
export const IconChevronUp = shallowRef<Component>(OIconChevronUp);

/**
 * down图标
 */
export const IconChevronDown = shallowRef<Component>(OIconChevronDown);

/**
 * left图标
 */
export const IconChevronLeft = shallowRef<Component>(OIconChevronLeft);

/**
 * right图标
 */
export const IconChevronRight = shallowRef<Component>(OIconChevronRight);

/**
 * done图标
 */
export const IconDone = shallowRef<Component>(OIconDone);

/**
 * 更多...图标，用于pagition
 */
export const IconEllipsis = shallowRef<Component>(OIconEllipsis);

/**
 * star图标
 */
export const IconStar = shallowRef<Component>(OIconStar);

/**
 * 刷新图标
 */
export const IconRefresh = shallowRef<Component>(OIconRefresh);

/**
 * 删除图标
 */
export const IconDelete = shallowRef<Component>(OIconDelete);

/**
 * 预览图标
 */
export const IconPreview = shallowRef<Component>(OIconEye);

/**
 * 文件图标
 */
export const IconFile = shallowRef<Component>(OIconFile);

/**
 * 编辑图标
 */
export const IconEdit = shallowRef<Component>(OIconEdit);

/**
 * 可见图标，用于密码框等
 */
export const IconEyeOn = shallowRef<Component>(OIconEye);

/**
 * 不可见图标，用于密码框等
 */
export const IconEyeOff = shallowRef<Component>(OIconEyeOff);

/**
 * 加载失败的图片
 */
export const IconImageError = shallowRef<Component>(OIconImageError);

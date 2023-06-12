/**
 * 定义全局图标，支持全局初始化自定义
 */
import { Component, shallowRef } from 'vue';
import {
  OIconArrowUp,
  OIconArrowDown,
  OIconArrowLeft,
  OIconArrowRight,
  OIconChevronUp,
  OIconChevronDown,
  OIconChevronLeft,
  OIconChevronRight,
  OIconInfo,
  OIconSuccess,
  OIconWarning,
  OIconDanger,
  OIconLoading,
  OIconLink,
  OIconClose,
  OIconAdd,
  OIconMinus,
  OIconDone,
  OIconEllipsis,
  OIconStar,
  OIconRefresh,
  OIconDelete,
  OIconEye,
  OIconEyeOff,
  OIconFile,
  OIconEdit,
  OIconImageError,
  OIconChecked,
} from '../icon-components';

/**
 * 向上箭头图标
 */
export const IconArrowUp = shallowRef<Component>(OIconArrowUp);

/**
 * 向右箭头图标
 */
export const IconArrowDown = shallowRef<Component>(OIconArrowDown);

/**
 * 向左箭头图标
 */
export const IconArrowLeft = shallowRef<Component>(OIconArrowLeft);

/**
 * 向右箭头图标
 */
export const IconArrowRight = shallowRef<Component>(OIconArrowRight);

/**
 * v形向上图标
 */
export const IconChevronUp = shallowRef<Component>(OIconChevronUp);

/**
 * v形向下图标
 */
export const IconChevronDown = shallowRef<Component>(OIconChevronDown);

/**
 * v形向左图标
 */
export const IconChevronLeft = shallowRef<Component>(OIconChevronLeft);

/**
 * v形向右图标
 */
export const IconChevronRight = shallowRef<Component>(OIconChevronRight);

/**
 * info图标
 */
export const IconInfo = shallowRef<Component>(OIconInfo);

/**
 * success图标
 */
export const IconSuccess = shallowRef<Component>(OIconSuccess);

/**
 * warning图标
 */
export const IconWarning = shallowRef<Component>(OIconWarning);

/**
 * danger图标
 */
export const IconDanger = shallowRef<Component>(OIconDanger);

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
 * done图标
 */
export const IconDone = shallowRef<Component>(OIconDone);

/**
 * close图标
 */
export const IconClose = shallowRef<Component>(OIconClose);

/**
 * add图标
 */
export const IconAdd = shallowRef<Component>(OIconAdd);

/**
 * minus图标
 */
export const IconMinus = shallowRef<Component>(OIconMinus);

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

export const IconChecked = shallowRef<Component>(OIconChecked);

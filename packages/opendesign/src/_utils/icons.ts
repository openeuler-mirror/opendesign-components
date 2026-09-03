/**
 * 定义全局图标，支持全局初始化自定义
 */
import { Component, shallowRef, h } from 'vue';
import {
  OIconArrowUp,
  OIconArrowDown,
  OIconArrowLeft,
  OIconArrowRight,
  OIconChevronUp,
  OIconChevronDown,
  OIconChevronDownBold,
  OIconChevronLeft,
  OIconChevronRight,
  OIconChevronRightSmall,
  OIconInfo,
  OIconInfoTip,
  OIconSuccess,
  OIconWarning,
  OIconDanger,
  OIconLoading,
  OIconLoadingSmall,
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
  OIconCalendar,
  OIconDoubleArrowLeft,
  OIconDoubleArrowRight,
  OIconVideoPlay,
  OIconImgError,
  OIconDownload,
  OIconAvatar,
  OIconTime,
  OIconZoomIn,
  OIconZoomOut,
  OIconOneToOne,
  OIconAsterisk,
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
 * v形向下图标-加粗
 */
export const IconChevronDownBold = shallowRef<Component>(OIconChevronDownBold);

/**
 * v形向左图标
 */
export const IconChevronLeft = shallowRef<Component>(OIconChevronLeft);

/**
 * v形向右图标
 */
export const IconChevronRight = shallowRef<Component>(OIconChevronRight);
/**
 * v形向右图标 - 小
 */
export const IconChevronRightSmall = shallowRef<Component>(OIconChevronRightSmall);

/**
 * info图标
 */
export const IconInfo = shallowRef<Component>(OIconInfo);

/**
 * info-tip图标
 */
export const IconInfoTip = shallowRef<Component>(OIconInfoTip);

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
 * loading图标 - 小
 */
export const IconLoadingSmall = shallowRef<Component>(OIconLoadingSmall);

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
 * 加载失败图标
 */
export const IconImageError = shallowRef<Component>(OIconImageError);

/**
 * 播放图标
 */
export const IconVideoPlay = shallowRef<Component>(OIconVideoPlay);

// 复选框选中图标
export const IconChecked = shallowRef<Component>(OIconChecked);

/**
 * 上传失败图标
 */
export const IconImgError = shallowRef<Component>(OIconImgError);

/**
 * 下载图标
 */
export const IconDownload = shallowRef<Component>(OIconDownload);

/**
 * 日期组件图标
 */
export const IconTime = shallowRef<Component>(OIconTime);

/**
 * 日期组件图标
 */
export const IconCalendar = shallowRef<Component>(OIconCalendar);
export const IconCalendarPrevYear = shallowRef<Component>(OIconDoubleArrowLeft);
export const IconCalendarNextYear = shallowRef<Component>(OIconDoubleArrowRight);
export const IconCalendarPrevMonth = shallowRef<Component>(OIconChevronLeft);
export const IconCalendarNextMonth = shallowRef<Component>(OIconChevronRight);

/**
 * 默认用户头像图标
 */
export const IconAvatar = shallowRef<Component>(OIconAvatar);

/**
 * 放大图标
 */
export const IconZoomIn = shallowRef<Component>(OIconZoomIn);

/**
 * 缩小图标
 */
export const IconZoomOut = shallowRef<Component>(OIconZoomOut);

/**
 * 原始比例图标
 */
export const IconOneToOne = shallowRef<Component>(OIconOneToOne);

/**
 * 顺时针旋转图标
 */
export const IconRotateClockwise = shallowRef<Component>(OIconRefresh);

/**
 * 逆时针旋转图标（使用 Refresh 水平翻转）
 */
export const IconRotateAnticlockwise = shallowRef<Component>({
  name: 'OIconRotateAnticlockwise',
  setup() {
    return () => h(OIconRefresh, { class: 'o-icon-rotate-anticlockwise' });
  },
});

/**
 * 表单项必选星号
 */
export const IconAsterisk = shallowRef<Component>(OIconAsterisk);

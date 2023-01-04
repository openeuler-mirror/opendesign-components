/**
 * 定义全局图标，支持全局初始化自定义
 */
import { IconLoading, IconLink, IconArrowRight } from '../icons';
import type { Component } from 'vue';

let iLoading: Component = IconLoading;
export function setLoadingIcon(icon: Component) {
  iLoading = icon;
}
export function getLoadingIcon() {
  return iLoading;
}


let iLink: Component = IconLink;
export function setLinkIcon(icon: Component) {
  iLink = icon;
}
export function getLinkIcon() {
  return iLink;
}

let iLinkArrow: Component = IconArrowRight;
export function setLinkArrowIcon(icon: Component) {
  iLinkArrow = icon;
}
export function getLinkArrowIcon() {
  return iLinkArrow;
}
import { createRouter, createWebHashHistory } from 'vue-router';
import TheHome from './pages/TheHome.vue';

export const routes = [
  {
    path: '/',
    name: 'Home',
    label: '首页',
    component: TheHome,
  },
  {
    path: '/button',
    name: 'Button',
    label: '按钮',
    component: () => import('@demo/button/__demo__/IndexBtn.vue'),
  },
  {
    path: '/link',
    name: 'Link',
    label: '链接',
    component: () => import('@demo/link/__demo__/IndexLink.vue'),
  },

  {
    path: '/switch',
    name: 'Switch',
    label: '开关',
    component: () => import('@demo/switch/__demo__/IndexSwitch.vue'),
  },
  {
    path: '/resize-observer',
    name: 'ResizeObserver',
    label: 'resize监听',
    component: () => import('@demo/resize-observer/__demo__/IndexResize.vue'),
  },
  {
    path: '/intersection-observer',
    name: 'IntersectionObserver',
    label: 'Intersection监听',
    component: () => import('@demo/intersection-observer/__demo__/IndexIntersection.vue'),
  },
  {
    path: '/child-only',
    name: 'ChildOnly',
    label: '只渲染一个子元素',
    component: () => import('@demo/child-only/__demo__/IndexChildOnly.vue'),
  },
  {
    path: '/popup',
    name: 'Popup',
    label: '弹层',
    component: () => import('@demo/popup/__demo__/IndexPopup.vue'),
  },
  {
    path: '/popover',
    name: 'Popover',
    label: '弹出框',
    component: () => import('@demo/popover/__demo__/IndexPopover.vue'),
  },
  {
    path: '/input',
    name: 'Input',
    label: '输入框',
    component: () => import('@demo/input/__demo__/IndexInput.vue'),
  },
  {
    path: '/input-number',
    name: 'InputNumber',
    label: '数字输入框',
    component: () => import('@demo/input-number/__demo__/IndexInputNumber.vue'),
  },
  {
    path: '/select',
    name: 'Select',
    label: '下拉框',
    component: () => import('@demo/select/__demo__/IndexSelect.vue'),
  },
  {
    path: '/radio',
    name: 'Radio',
    label: '单选',
    component: () => import('@demo/radio/__demo__/IndexRadio.vue'),
  },
  {
    path: '/checkbox',
    name: 'Checkbox',
    label: '多选',
    component: () => import('@demo/checkbox/__demo__/IndexCheckbox.vue'),
  },
  {
    path: '/tabs',
    name: 'Tabs',
    label: '标签页',
    component: () => import('@demo/tabs/__demo__/IndexTabs.vue'),
  },
  {
    path: '/table',
    name: 'Table',
    label: '表格',
    component: () => import('@demo/table/__demo__/IndexTable.vue'),
  },
  {
    path: '/pagination',
    name: 'Pagination',
    label: '分页',
    component: () => import('@demo/pagination/__demo__/IndexPagination.vue'),
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savePosition) {
    if (savePosition) {
      return savePosition;
    } else {
      return {
        top: 0,
        behavior: 'smooth',
      };
    }
  },
});

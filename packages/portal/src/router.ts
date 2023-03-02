import { createRouter, createWebHashHistory } from 'vue-router';
import TheHome from './pages/TheHome.vue';

export const routes = [
  {
    path: '/',
    name: 'Home',
    label: '通用',
    component: TheHome,
  },
  {
    path: '/icons',
    name: 'Icons',
    label: '图标',
    component: () => import('./pages/TheIcons.vue'),
  },
  {
    path: '/button',
    name: 'Button',
    label: '按钮',
    component: () => import('@components/button/__demo__/IndexBtn.vue'),
  },
  {
    path: '/link',
    name: 'Link',
    label: '链接',
    component: () => import('@components/link/__demo__/IndexLink.vue'),
  },

  {
    path: '/switch',
    name: 'Switch',
    label: '开关',
    component: () => import('@components/switch/__demo__/IndexSwitch.vue'),
  },
  {
    path: '/resize-observer',
    name: 'ResizeObserver',
    label: 'resize监听',
    component: () => import('@components/resize-observer/__demo__/IndexResize.vue'),
  },
  {
    path: '/intersection-observer',
    name: 'IntersectionObserver',
    label: 'Intersection监听',
    component: () => import('@components/intersection-observer/__demo__/IndexIntersection.vue'),
  },
  {
    path: '/child-only',
    name: 'ChildOnly',
    label: '只渲染一个子元素',
    component: () => import('@components/child-only/__demo__/IndexChildOnly.vue'),
  },
  {
    path: '/popup',
    name: 'Popup',
    label: '弹层',
    component: () => import('@components/popup/__demo__/IndexPopup.vue'),
  },
  {
    path: '/popover',
    name: 'Popover',
    label: '弹出框',
    component: () => import('@components/popover/__demo__/IndexPopover.vue'),
  },
  {
    path: '/input',
    name: 'Input',
    label: '输入框',
    component: () => import('@components/input/__demo__/IndexInput.vue'),
  },
  {
    path: '/input-number',
    name: 'InputNumber',
    label: '数字输入框',
    component: () => import('@components/input-number/__demo__/IndexInputNumber.vue'),
  },
  {
    path: '/textarea',
    name: 'Textarea',
    label: '文本域',
    component: () => import('@components/textarea/__demo__/IndexTextarea.vue'),
  },
  {
    path: '/select',
    name: 'Select',
    label: '下拉框',
    component: () => import('@components/select/__demo__/IndexSelect.vue'),
  },
  {
    path: '/radio',
    name: 'Radio',
    label: '单选',
    component: () => import('@components/radio/__demo__/IndexRadio.vue'),
  },
  {
    path: '/checkbox',
    name: 'Checkbox',
    label: '多选',
    component: () => import('@components/checkbox/__demo__/IndexCheckbox.vue'),
  },
  {
    path: '/tabs',
    name: 'Tabs',
    label: '页签',
    component: () => import('@components/tabs/__demo__/IndexTabs.vue'),
  },
  {
    path: '/table',
    name: 'Table',
    label: '表格',
    component: () => import('@components/table/__demo__/IndexTable.vue'),
  },
  {
    path: '/pagination',
    name: 'Pagination',
    label: '分页',
    component: () => import('@components/pagination/__demo__/IndexPagination.vue'),
  },
  {
    path: '/divider',
    name: 'Divider',
    label: '分割线',
    component: () => import('@components/divider/__demo__/IndexDivider.vue'),
  },
  {
    path: '/tag',
    name: 'Tag',
    label: '标签',
    component: () => import('@components/tag/__demo__/IndexTag.vue'),
  },
  {
    path: '/badge',
    name: 'Badge',
    label: '徽标',
    component: () => import('@components/badge/__demo__/IndexBadge.vue'),
  },
  {
    path: '/rate',
    name: 'Rate',
    label: '评分',
    component: () => import('@components/rate/__demo__/IndexRate.vue'),
  },
  {
    path: '/breadcrumb',
    name: 'Breadcrumb ',
    label: '面包屑',
    component: () => import('@components/breadcrumb/__demo__/IndexBreadcrumb.vue'),
  },
  {
    path: '/menu',
    name: 'OMenu ',
    label: '菜单',
    component: () => import('@components/menu/__demo__/IndexMenu.vue'),
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

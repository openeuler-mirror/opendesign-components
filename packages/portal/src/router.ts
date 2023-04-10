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
    label: '图标 Icon',
    component: () => import('./pages/TheIcons.vue'),
  },
  {
    path: '/button',
    name: 'Button',
    label: '按钮 Button',
    component: () => import('@components/button/__demo__/IndexBtn.vue'),
  },
  {
    path: '/link',
    name: 'Link',
    label: '链接 Link',
    component: () => import('@components/link/__demo__/IndexLink.vue'),
  },
  {
    path: '/switch',
    name: 'Switch',
    label: '开关 Switch',
    component: () => import('@components/switch/__demo__/IndexSwitch.vue'),
  },
  {
    path: '/popup',
    name: 'Popup',
    label: '弹层 Popup',
    component: () => import('@components/popup/__demo__/IndexPopup.vue'),
  },
  {
    path: '/popover',
    name: 'Popover',
    label: '气泡提示 Popover',
    component: () => import('@components/popover/__demo__/IndexPopover.vue'),
  },
  {
    path: '/input',
    name: 'Input',
    label: '输入框 Input',
    component: () => import('@components/input/__demo__/IndexInput.vue'),
  },
  {
    path: '/input-number',
    name: 'InputNumber',
    label: '数字输入框 InputNumber',
    component: () => import('@components/input-number/__demo__/IndexInputNumber.vue'),
  },
  {
    path: '/textarea',
    name: 'Textarea',
    label: '文本域 Textarea',
    component: () => import('@components/textarea/__demo__/IndexTextarea.vue'),
  },
  {
    path: '/select',
    name: 'Select',
    label: '下拉选择器 Select',
    component: () => import('@components/select/__demo__/IndexSelect.vue'),
  },
  {
    path: '/cascader',
    name: 'Cascader',
    label: '级联选择器 Cascader',
    component: () => import('@components/cascader/__demo__/IndexCascader.vue'),
  },
  {
    path: '/radio',
    name: 'Radio',
    label: '单选框 Radio',
    component: () => import('@components/radio/__demo__/IndexRadio.vue'),
  },
  {
    path: '/checkbox',
    name: 'Checkbox',
    label: '多选框 Checkbox',
    component: () => import('@components/checkbox/__demo__/IndexCheckbox.vue'),
  },
  {
    path: '/tabs',
    name: 'Tabs',
    label: '页签 Tabs',
    component: () => import('@components/tabs/__demo__/IndexTabs.vue'),
  },
  {
    path: '/table',
    name: 'Table',
    label: '表格 Table',
    component: () => import('@components/table/__demo__/IndexTable.vue'),
  },
  {
    path: '/pagination',
    name: 'Pagination',
    label: '分页 Pagination',
    component: () => import('@components/pagination/__demo__/IndexPagination.vue'),
  },
  {
    path: '/divider',
    name: 'Divider',
    label: '分割线 Divider',
    component: () => import('@components/divider/__demo__/IndexDivider.vue'),
  },
  {
    path: '/tag',
    name: 'Tag',
    label: '标签 Tag',
    component: () => import('@components/tag/__demo__/IndexTag.vue'),
  },
  {
    path: '/badge',
    name: 'Badge',
    label: '徽标 Badge',
    component: () => import('@components/badge/__demo__/IndexBadge.vue'),
  },
  {
    path: '/rate',
    name: 'Rate',
    label: '评分 Rate',
    component: () => import('@components/rate/__demo__/IndexRate.vue'),
  },
  {
    path: '/breadcrumb',
    name: 'Breadcrumb',
    label: '面包屑 Breadcrumb',
    component: () => import('@components/breadcrumb/__demo__/IndexBreadcrumb.vue'),
  },
  {
    path: '/menu',
    name: 'Menu',
    label: '菜单 Menu',
    component: () => import('@components/menu/__demo__/IndexMenu.vue'),
  },
  {
    path: '/dropdown',
    name: 'Dropdown',
    label: '下拉按钮 Dropdown',
    component: () => import('@components/dropdown/__demo__/IndexDropdown.vue'),
  },
  {
    path: '/progress',
    name: 'Progress',
    label: '进度条 Progress',
    component: () => import('@components/progress/__demo__/IndexProgress.vue'),
  },
  {
    path: '/dialog',
    name: 'Dialog',
    label: '对话框 Dialog',
    component: () => import('@components/dialog/__demo__/IndexDialog.vue'),
  },
  {
    path: '/figure',
    name: 'Figure',
    label: '图片 Figure',
    component: () => import('@components/figure/__demo__/IndexFigure.vue'),
  },
  {
    path: '/card',
    name: 'Card',
    label: '卡片 Card',
    component: () => import('@components/card/__demo__/IndexCard.vue'),
  },
  {
    path: '/message',
    name: 'Message',
    label: '消息提示 Message',
    component: () => import('@components/message/__demo__/IndexMessage.vue'),
  },
  {
    path: '/slides',
    name: 'Slides',
    label: '轮播 Slides',
    component: () => import('@components/slides/__demo__/IndexSlides.vue'),
  },
  {
    path: '/grid',
    name: 'Grid',
    label: '栅格 Grid',
    component: () => import('@components/grid/__demo__/IndexGrid.vue'),
  },
  {
    path: '/loading',
    name: 'Loading',
    label: '加载 Loading',
    component: () => import('@components/loading/__demo__/IndexLoading.vue'),
  },
  {
    path: '/result',
    name: 'Result',
    label: '结果 Result',
    component: () => import('@components/result/__demo__/IndexResult.vue'),
  },
  {
    path: '/resize-observer',
    name: 'ResizeObserver',
    label: 'Resize监听',
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

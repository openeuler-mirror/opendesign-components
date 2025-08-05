import { createRouter, createWebHistory } from 'vue-router';
import TheHome from './pages/TheHome.vue';
import { oa, OpenEventKeys } from '@/analytics';

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: TheHome,
    meta: {
      title: '通用',
    },
  },
  {
    path: '/i18n',
    name: 'i18n',
    component: () => import('@opendesign-src/locale/__demo__/TheIndex.vue'),
    meta: {
      title: '多语言',
    },
  },
  {
    path: '/virtual-list',
    name: 'virtual-list',
    component: () => import('@opendesign-src/virtual-list/__demo__/TheIndex.vue'),
    meta: {
      title: '虚拟滚动',
    },
  },
  {
    path: '/in-input',
    name: 'InInput',
    component: () => import('@opendesign-src/_components/in-input/__demo__/TheIndex.vue'),
    meta: {
      title: '_输入框',
    },
  },
  {
    path: '/in-textarea',
    name: 'InTextarea',
    component: () => import('@opendesign-src/_components/in-textarea/__demo__/TheIndex.vue'),
    meta: {
      title: '_文本域',
    },
  },
  {
    path: '/config-provider',
    name: 'config-provider',
    component: () => import('@opendesign-src/config-provider/__demo__/TheIndex.vue'),
    meta: {
      title: '全局配置 config-provider',
    },
  },
  {
    path: '/form',
    name: 'Form',
    component: () => import('@opendesign-src/form/__demo__/TheIndex.vue'),
    meta: {
      title: '表单 Form',
    },
  },
  {
    path: '/text',
    name: 'Text',
    component: () => import('./pages/TheText.vue'),
    meta: {
      title: '文本 Text',
    },
  },
  {
    path: '/icons',
    name: 'Icons',
    component: () => import('@opendesign-src/icon/__demo__/TheIndex.vue'),
    meta: {
      title: '图标 Icon',
    },
  },
  {
    path: '/button',
    name: 'Button',
    component: () => import('@opendesign-src/button/__demo__/TheIndex.vue'),
    meta: {
      title: '按钮 Button',
    },
  },
  {
    path: '/link',
    name: 'Link',
    component: () => import('@opendesign-src/link/__demo__/TheIndex.vue'),
    meta: {
      title: '链接 Link',
    },
  },
  {
    path: '/switch',
    name: 'Switch',
    component: () => import('@opendesign-src/switch/__demo__/TheIndex.vue'),
    meta: {
      title: '开关 Switch',
    },
  },
  {
    path: '/popup',
    name: 'Popup',
    component: () => import('@opendesign-src/popup/__demo__/TheIndex.vue'),
    meta: {
      title: '弹层 Popup',
    },
  },
  {
    path: '/popover',
    name: 'Popover',
    component: () => import('@opendesign-src/popover/__demo__/IndexPopover.vue'),
    meta: {
      title: '气泡提示 Popover',
    },
  },
  {
    path: '/input',
    name: 'Input',
    component: () => import('@opendesign-src/input/__demo__/TheIndex.vue'),
    meta: {
      title: '输入框 Input',
    },
  },
  {
    path: '/input-number',
    name: 'InputNumber',
    component: () => import('@opendesign-src/input-number/__demo__/TheIndex.vue'),
    meta: {
      title: '数字输入框 InputNumber',
    },
  },
  {
    path: '/textarea',
    name: 'Textarea',
    component: () => import('@opendesign-src/textarea/__demo__/TheIndex.vue'),
    meta: {
      title: '文本域 Textarea',
    },
  },
  {
    path: '/select',
    name: 'Select',
    component: () => import('@opendesign-src/select/__demo__/TheIndex.vue'),
    meta: {
      title: '下拉选择器 Select',
    },
  },
  {
    path: '/cascader',
    name: 'Cascader',
    component: () => import('@opendesign-src/cascader/__demo__/IndexCascader.vue'),
    meta: {
      title: '级联选择器 Cascader',
    },
  },
  {
    path: '/radio',
    name: 'Radio',
    component: () => import('@opendesign-src/radio/__demo__/TheIndex.vue'),
    meta: {
      title: '单选框 Radio',
    },
  },
  {
    path: '/checkbox',
    name: 'Checkbox',
    component: () => import('@opendesign-src/checkbox/__demo__/TheIndex.vue'),
    meta: {
      title: '多选框 Checkbox',
    },
  },
  {
    path: '/tab',
    name: 'Tab',
    component: () => import('@opendesign-src/tab/__demo__/IndexTab.vue'),
    meta: {
      title: '页签 Tab',
    },
  },
  {
    path: '/table',
    name: 'Table',
    component: () => import('@opendesign-src/table/__demo__/TheIndex.vue'),
    meta: {
      title: '表格 Table',
    },
  },
  {
    path: '/pagination',
    name: 'Pagination',
    component: () => import('@opendesign-src/pagination/__demo__/IndexPagination.vue'),
    meta: {
      title: '分页 Pagination',
    },
  },
  {
    path: '/divider',
    name: 'Divider',
    component: () => import('@opendesign-src/divider/__demo__/TheIndex.vue'),
    meta: {
      title: '分割线 Divider',
    },
  },
  {
    path: '/tag',
    name: 'Tag',
    component: () => import('@opendesign-src/tag/__demo__/TheIndex.vue'),
    meta: {
      title: '标签 Tag',
    },
  },
  {
    path: '/badge',
    name: 'Badge',
    component: () => import('@opendesign-src/badge/__demo__/TheIndex.vue'),
    meta: {
      title: '徽标 Badge',
    },
  },
  {
    path: '/rate',
    name: 'Rate',
    component: () => import('@opendesign-src/rate/__demo__/TheIndex.vue'),
    meta: {
      title: '评分 Rate',
    },
  },
  {
    path: '/breadcrumb',
    name: 'Breadcrumb',
    component: () => import('@opendesign-src/breadcrumb/__demo__/TheIndex.vue'),
    meta: {
      title: '面包屑 Breadcrumb',
    },
  },
  {
    path: '/menu',
    name: 'Menu',
    component: () => import('@opendesign-src/menu/__demo__/IndexMenu.vue'),
    meta: {
      title: '菜单 Menu',
    },
  },
  {
    path: '/dropdown',
    name: 'Dropdown',
    component: () => import('@opendesign-src/dropdown/__demo__/IndexDropdown.vue'),
    meta: {
      title: '下拉按钮 Dropdown',
    },
  },
  {
    path: '/progress',
    name: 'Progress',
    component: () => import('@opendesign-src/progress/__demo__/IndexProgress.vue'),
    meta: {
      title: '进度条 Progress',
    },
  },
  {
    path: '/layer',
    name: 'Layer',
    component: () => import('@opendesign-src/layer/__demo__/TheIndex.vue'),
    meta: {
      title: '浮层 Layer',
    },
  },
  {
    path: '/dialog',
    name: 'Dialog',
    component: () => import('@opendesign-src/dialog/__demo__/TheIndex.vue'),
    meta: {
      title: '对话框 Dialog',
    },
  },
  {
    path: '/loading',
    name: 'Loading',
    component: () => import('@opendesign-src/loading/__demo__/TheIndex.vue'),
    meta: {
      title: '加载 Loading',
    },
  },
  {
    path: '/figure',
    name: 'Figure',
    component: () => import('@opendesign-src/figure/__demo__/TheIndex.vue'),
    meta: {
      title: '图片 Figure',
    },
  },
  {
    path: '/card',
    name: 'Card',
    component: () => import('@opendesign-src/card/__demo__/TheIndex.vue'),
    meta: {
      title: '卡片 Card',
    },
  },
  {
    path: '/message',
    name: 'Message',
    component: () => import('@opendesign-src/message/__demo__/TheIndex.vue'),
    meta: {
      title: '消息提示 Message',
    },
  },
  {
    path: '/carousel',
    name: 'Carousel',
    component: () => import('@opendesign-src/carousel/__demo__/IndexCarousel.vue'),
    meta: {
      title: '幻灯片 Carousel',
    },
  },
  {
    path: '/grid',
    name: 'Grid',
    component: () => import('@opendesign-src/grid/__demo__/TheIndex.vue'),
    meta: {
      title: '栅格 Grid',
    },
  },
  {
    path: '/result',
    name: 'Result',
    component: () => import('@opendesign-src/result/__demo__/TheIndex.vue'),
    meta: {
      title: '结果 Result',
    },
  },
  {
    path: '/scrollbar',
    name: 'Scrollbar',
    component: () => import('@opendesign-src/scrollbar/__demo__/TheIndex.vue'),
    meta: {
      title: '滚动条 Scrollbar',
    },
  },
  {
    exclude: true,
    path: '/scrollbar/body',
    name: 'Scrollbar-body',
    component: () => import('@opendesign-src/scrollbar/__demo__/ScrollerBody.vue'),
    meta: {
      title: '全局滚动条 Scrollbar-body',
    },
  },
  {
    path: '/upload',
    name: 'Upload',
    component: () => import('@opendesign-src/upload/__demo__/TheIndex.vue'),
    meta: {
      title: '上传 Upload',
    },
  },
  {
    path: '/toggle',
    name: 'Toggle',
    component: () => import('@opendesign-src/toggle/__demo__/TheIndex.vue'),
    meta: {
      title: '选择块 Toggle',
    },
  },
  {
    path: '/anchor',
    name: 'Anchor',
    component: () => import('@opendesign-src/anchor/__demo__/TheIndex.vue'),
    meta: {
      title: '锚点 Anchor',
    },
  },
  {
    path: '/collapse',
    name: 'Collapse',
    component: () => import('@opendesign-src/collapse/__demo__/TheIndex.vue'),
    meta: {
      title: '折叠面板 Collapse',
    },
  },
  {
    path: '/skeleton',
    name: 'Skeleton',
    component: () => import('@opendesign-src/skeleton/__demo__/TheIndex.vue'),
    meta: {
      title: '骨架屏 Skeleton',
    },
  },
  {
    path: '/resize-observer',
    name: 'ResizeObserver',
    component: () => import('@opendesign-src/resize-observer/__demo__/IndexResize.vue'),
    meta: {
      title: 'Resize监听',
    },
  },
  {
    path: '/intersection-observer',
    name: 'IntersectionObserver',
    component: () => import('@opendesign-src/intersection-observer/__demo__/IndexIntersection.vue'),
    meta: {
      title: 'Intersection监听',
    },
  },
  {
    path: '/child-only',
    name: 'ChildOnly',
    component: () => import('@opendesign-src/child-only/__demo__/IndexChildOnly.vue'),
    meta: {
      title: '只渲染一个子元素',
    },
  },
];

export const router = createRouter({
  // history: createWebHashHistory('./'),
  history: createWebHistory(),
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

router.afterEach((to, from) => {
  oa.report(OpenEventKeys.PV, {
    prev_page: from.fullPath,
    url: to.fullPath,
    title: to.meta.title,
  });
});

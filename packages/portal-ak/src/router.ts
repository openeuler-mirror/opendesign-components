import { createRouter, createWebHashHistory } from 'vue-router';
import TheHome from './pages/TheHome.vue';
import TheComponent from './pages/TheComponent.vue';

export const routes = [
  {
    path: '/',
    name: 'Home',
    label: '通用',
    component: TheHome,
  },
  {
    path: '/component',
    name: 'component',
    label: '通用',
    component: TheComponent,
    children: [
      {
        path: 'text',
        name: 'Text',
        label: '文本 Text',
        component: () => import('./pages/TheText.vue'),
      },
      {
        path: 'icons',
        name: 'Icons',
        label: '图标 Icon',
        component: () => import('@components/icon/__demo__/TheIndex.vue'),
      },
      {
        path: 'button',
        name: 'Button',
        label: '按钮 Button',
        component: () => import('./pages/button/TheIndex.vue'),
      },
      {
        path: 'switch',
        name: 'Switch',
        label: '开关 Switch',
        component: () => import('./pages/switch/TheIndex.vue'),
      },

      {
        path: 'radio',
        name: 'Radio',
        label: '单选框 Radio',
        component: () => import('./pages/radio/TheIndex.vue'),
      },
      {
        path: 'checkbox',
        name: 'Checkbox',
        label: '多选框 Checkbox',
        component: () => import('./pages/checkbox/TheIndex.vue'),
      },
      {
        path: 'input',
        name: 'input',
        label: '输入框 input',
        component: () => import('./pages/input/TheIndex.vue'),
      },
      {
        path: 'divider',
        name: 'Divider',
        label: '分割线 Divider',
        component: () => import('./pages/divider/TheIndex.vue'),
      },
      {
        path: 'progress',
        name: 'Progress',
        label: '进度条 Progress',
        component: () => import('./pages/progress/TheIndex.vue'),
      },
      {
        path: 'scroller',
        name: 'scroller',
        label: '滚动条 scroller',
        component: () => import('./pages/scroller/TheIndex.vue'),
      },
      {
        path: 'popover',
        name: 'popover',
        label: '气泡提示 popover',
        component: () => import('./pages/popover/TheIndex.vue'),
      },
      {
        path: 'dialog',
        name: 'dialog',
        label: '弹窗 dialog',
        component: () => import('./pages/dialog/TheIndex.vue'),
      },
      {
        path: 'select',
        name: 'select',
        label: '下拉选择器 select',
        component: () => import('./pages/select/TheIndex.vue'),
      },
      {
        path: 'badge',
        name: 'Badge',
        label: '徽标 Badge',
        component: () => import('./pages/badge/TheIndex.vue'),
      },
      {
        path: 'message',
        name: 'Message',
        label: '消息 Message',
        component: () => import('./pages/message/TheIndex.vue'),
      },
      {
        path: 'rate',
        name: 'Rate',
        label: '评分 Rate',
        component: () => import('./pages/rate/TheIndex.vue'),
      },
      {
        path: 'tag',
        name: 'Tag',
        label: '标签 Tag',
        component: () => import('./pages/tag/TheIndex.vue'),
      },
      {
        path: 'breadcrumb',
        name: 'Breadcrumb',
        label: '面包屑 Breadcrumb',
        component: () => import('./pages/breadcrumb/TheIndex.vue'),
      },
    ],
  },
  {
    path: '/mb/button',
    name: 'mb-Button',
    label: '按钮 Button',
    component: () => import('./pages/button/TheIndex.vue'),
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

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

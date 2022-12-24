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
    component: () => import('./pages/TheButton.vue'),
  },
  {
    path: '/switch',
    name: 'Switch',
    label: '开关',
    component: () => import('./pages/TheSwitch.vue'),
  },
  {
    path: '/resize-observer',
    name: 'ResizeObserver',
    label: 'resize监听',
    component: () => import('./pages/TheResizeObserver.vue'),
  },
  {
    path: '/popup',
    name: 'Popup',
    label: '浮层',
    component: () => import('./pages/ThePopup.vue'),
  },
  {
    path: '/select',
    name: 'Select',
    label: '下拉框',
    component: () => import('./pages/TheSelect.vue'),
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

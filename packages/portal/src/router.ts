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

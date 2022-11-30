import {createRouter, createWebHashHistory} from 'vue-router';
import TheHome from './pages/TheHome.vue';

export const routes = [
  {
    'path':'/', component: TheHome, name: 'Home', label: '首页',
  },
  {
    'path':'/button', component: () => import('./pages/TheButton.vue'), name: 'Button', label: '按钮',
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savePosition) {
    if(savePosition) {
      return savePosition;
    } else {
      return {
        top: 0,
        behavior: 'smooth',
      };
    }
  },
});
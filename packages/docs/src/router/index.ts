import { createRouter, createWebHistory } from 'vue-router';
import TheHome from '../pages/TheHome.vue';
import { routes as componentRoutes } from './components';
import { useI18n } from '@opensig/opendesign';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: TheHome,
    },
    ...componentRoutes,
  ]
});

export const sidebarRouteConfig = {
  component: {
    routes: componentRoutes,
    label: () => useI18n().t('components.component'),
  },
};

export type SidebarNameT = keyof typeof sidebarRouteConfig;

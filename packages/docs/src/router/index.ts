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
  ],
});
export type MetaT = { sidebar: string; lang: string; kind: string; sidebarName: string };
export type RouteT = {
  path: string;
  meta: MetaT;
};
export type SidebarItemT = {
  routes: RouteT[];
  label: string | (() => string);
  subMenuOrder: string[];
};
export const sidebarRouteConfig = {
  components: {
    routes: componentRoutes,
    label: () => useI18n().t('components.component'),
    subMenuOrder: ['nav', 'operator', 'input', 'container', 'display', 'feedback'],
  },
} satisfies Record<string, SidebarItemT>;

export type SidebarNameT = keyof typeof sidebarRouteConfig;

import type { App } from 'vue';

import _OBreadcrumb from './OBreadcrumb.vue';
import OBreadcrumbItem from './OBreadcrumbItem.vue';

const OBreadcrumb = Object.assign(_OBreadcrumb, {
  OBreadcrumbItem,
  install(app: App) {
    app.component(_OBreadcrumb.name, _OBreadcrumb);
    app.component(OBreadcrumbItem.name, OBreadcrumbItem);
  },
});

export * from './types';

export { OBreadcrumb, OBreadcrumbItem };

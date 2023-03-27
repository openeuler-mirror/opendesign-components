import type { App } from 'vue';
import _OLoading from './OLoading.vue';
import { vLoading } from './vLoading';
import useLoading from './useLoading';

const OLoading = Object.assign(_OLoading, {
  vLoading,
  useLoading,
  install(app: App) {
    app.component(_OLoading.name, _OLoading);
  },
});

export { OLoading, vLoading, useLoading };

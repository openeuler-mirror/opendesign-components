import _OTextarea from './OTextarea.vue';
import type { App } from 'vue';

const OTextarea = Object.assign(_OTextarea, {
  install(app: App) {
    app.component(_OTextarea.name, _OTextarea);
  },
});
export { OTextarea };

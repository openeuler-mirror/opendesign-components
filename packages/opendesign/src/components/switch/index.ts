import _OSWitch from './OSwitch.vue';
import type { App } from 'vue';

// export * from './types';

const OSWitch = Object.assign(_OSWitch, {
  install(app: App) {
    app.component(_OSWitch.name, _OSWitch);
  },
});

export { OSWitch };

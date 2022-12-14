import _OButton from './OButton.vue';
import type { App } from 'vue';

export * from './types';

const OButton = Object.assign(_OButton, {
  install(app: App) {
    app.component(_OButton.name, _OButton);
  },
});

export {
  OButton,
};

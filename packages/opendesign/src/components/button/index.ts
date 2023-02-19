import _OButton from './OButton.vue';
import type { App } from 'vue';


const OButton = Object.assign(_OButton, {
  install(app: App) {
    app.component(_OButton.name, _OButton);
  },
});

export {
  OButton,
};
export * from './types';

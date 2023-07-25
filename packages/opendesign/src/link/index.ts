import _OLink from './OLink.vue';
import type { App } from 'vue';

const OLink = Object.assign(_OLink, {
  install(app: App) {
    app.component(_OLink.name, _OLink);
  },
});

export {
  OLink,
};

import _OFlex from './OFlex.vue';
import OFlexItem from './OFlexItem.vue';
import type { App } from 'vue';

const OFlex = Object.assign(_OFlex, {
  OFlexItem,
  install(app: App) {
    app.component(_OFlex.name, _OFlex);
  },
});

export { OFlex, OFlexItem };
export * from './types';

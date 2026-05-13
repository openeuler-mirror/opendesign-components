import type { App } from 'vue';
import _OAvatar from './OAvatar.vue';
import _OAvatarGroup from './OAvatarGroup.vue';

const OAvatar = Object.assign(_OAvatar, {
  install(app: App) {
    app.component('OAvatar', _OAvatar);
  },
});

const OAvatarGroup = Object.assign(_OAvatarGroup, {
  install(app: App) {
    app.component('OAvatarGroup', _OAvatarGroup);
  },
});

export { OAvatar, OAvatarGroup };
export * from './types';

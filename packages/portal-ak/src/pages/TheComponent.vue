<script setup lang="ts">
import TheHeader from '../components/TheHeader.vue';
import TheAside from '../components/TheAside.vue';
</script>

<template>
  <TheHeader class="app-header" />
  <TheAside class="app-aside" />
  <div class="app-body">
    <router-view />
  </div>
</template>

<style lang="scss">
:root {
  --app-header-height: 48px;
  --app-footer-height: 80px;
  --app-aside-width: 240px;
}
body {
  @media (max-width: 720px) {
    --app-aside-width: 0;
  }
}
.app-header {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: var(--app-header-height);
  z-index: 10;
}
.app-aside {
  position: fixed;
  top: var(--app-header-height);
  left: 0;
  bottom: 0;
  width: var(--app-aside-width);
  z-index: 9;
}
.app-body {
  margin-top: var(--app-header-height);
  margin-left: var(--app-aside-width);
  min-height: calc(100vh - 48px);
  background-color: var(--o-color-fill1);
}
</style>

<script setup lang="ts">
import { OButton, ButtonTypeT, SizeT } from 'opendesign';
</script>
<template>
  <div class="page-demo">
    <section>
      <h4>Type</h4>
      <div class="row">
        <OButton :type="ButtonTypeT.PRIMARY">
          Primary Button
        </OButton>
        <OButton :type="ButtonTypeT.OUTLINE">
          Outline Button
        </OButton>
        <OButton :type="ButtonTypeT.TEXT">
          Text Button
        </OButton>
        <OButton :type="ButtonTypeT.LINK">
          Link Button
        </OButton>
      </div>
    </section>
    <section>
      <h4>Disabled</h4>
      <div class="row">
        <OButton :type="ButtonTypeT.PRIMARY" disabled>
          Primary Button
        </OButton>
        <OButton :type="ButtonTypeT.OUTLINE" disabled>
          Outline Button
        </OButton>
        <OButton :type="ButtonTypeT.TEXT" disabled>
          Text Button
        </OButton>
        <OButton :type="ButtonTypeT.LINK" disabled>
          Link Button
        </OButton>
      </div>
    </section>
    <section>
      <h4>Size</h4>
      <div class="row">
        <OButton :type="ButtonTypeT.PRIMARY" :size="SizeT.LARGE">
          Large Button
        </OButton>
        <OButton :type="ButtonTypeT.PRIMARY" :size="SizeT.NORMAL">
          Normal Button
        </OButton>
        <OButton :type="ButtonTypeT.PRIMARY" :size="SizeT.SMALL">
          Small Button
        </OButton>
      </div>
    </section>
  </div>
</template>
<style lang="scss">
@import 'opendesign/components/button/button.scss';

</style>
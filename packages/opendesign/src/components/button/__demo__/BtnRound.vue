<script setup lang="ts">
import { OButton } from '../index';
import { IconAdd } from '../../icons';
</script>
<template>
  <h4>Shape</h4>
  <section>
    <div>
      <p>round="pill"</p>
      <section>
        <OButton type="primary" size="large" round="pill">
          <template #icon><IconAdd /></template>
        </OButton>
        <OButton type="outline" round="pill">
          <template #icon><IconAdd /></template>
        </OButton>
        <OButton type="outline" size="small" round="pill">
          <template #icon><IconAdd /></template>
        </OButton>

        <OButton type="primary" size="large" round="pill">
          <template #icon><IconAdd /></template>Round Button
        </OButton>
        <OButton type="outline" round="pill">
          <template #icon><IconAdd /></template>Round Button
        </OButton>
        <OButton type="outline" size="small" round="pill">
          <template #icon><IconAdd /></template>Round Button
        </OButton>
      </section>
    </div>
    <div>
      <p>round="16px"</p>
      <section>
        <OButton type="primary" size="large" round="16px">
          <template #icon><IconAdd /></template>Round Button
        </OButton>
        <OButton type="outline" round="16px">
          <template #icon><IconAdd /></template>Round Button
        </OButton>
        <OButton type="outline" size="small" round="16px">
          <template #icon><IconAdd /></template>Round Button
        </OButton>
      </section>
    </div>
    <div>
      <p>round="0"</p>
      <section>
        <OButton type="primary" size="large" round="0">
          <template #icon><IconAdd /></template>Round Button
        </OButton>
        <OButton type="outline" round="0">
          <template #icon><IconAdd /></template>Round Button
        </OButton>
        <OButton type="outline" size="small" round="0">
          <template #icon><IconAdd /></template>Round Button
        </OButton>
      </section>
    </div>
  </section>
</template>
<style lang="scss"></style>
